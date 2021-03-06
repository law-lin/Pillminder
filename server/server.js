const dotenv = require('dotenv');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const multer = require('multer');
const cors = require('cors');
const cron = require('node-cron')
const text2num = require('./text2num.js');
const twilio = require('twilio');
const vision = require('@google-cloud/vision');
const fs = require('firebase-admin')

require('dotenv').config()

const app = express();
const port = 8000;

dotenv.config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

const twilioClient = new twilio(accountSid, authToken);

const visionClient = new vision.ImageAnnotatorClient({
  keyFilename: 'keys.json',
});

const fsServiceAccount = 'firestore_keys.json';
const { async } = require('q');
fs.initializeApp({
    credential: fs.credential.cert(fsServiceAccount)
})

const db = fs.firestore()

app.use(cors());
app.use(bodyParser.json());

const getFields = multer();

app.get('/', async (req, res) => {
  res.send("Welcome to Pillminder's API");
});

app.post('/extract', getFields.none(), async (req, res) => {
  const { gcsImageUri, phoneNumber } = req.body;

  if (!gcsImageUri) {
    res.status(400).send('No Uri Passed');
  }

  const [result] = await visionClient.textDetection(gcsImageUri);

  const detections = result.textAnnotations;
  description = detections[0]['description'];

  const info = text2num(description);

  let response = {
    description,
    details: info.reminderMessage,
    reminderMessage: 'Take your pill in an hour!',
    frequency: info.frequency,
    numPills: info.pills,
  };
  twilioClient.messages
    .create({
      body: 'Take your pill right now!',
      to: `+1${phoneNumber}`,
      from: '+13479708459',
    })
    .then((message) => console.log(message.sid));

  res.status(200).send(response);
});

cron.schedule('30 * * * *', async () => {
  const querySnapshot = await db.collection('users').get();
  querySnapshot.forEach(async (doc) => {
    const phoneNumber = doc.data().phoneNumber
    const reminder = await db.collection('users').doc(doc.id).collection('reminders').get();
    reminder.forEach(async (r) => {
      const timeLeft = r.data().timeLeft - .5

      if(timeLeft <= 0){
        const xAmt = r.data().pillCount;
        const frequency = r.data().frequency
        //  TODO: Feature add the name of the medication
        let details = `Reminder to take ${xAmt} pill(s)`;
        // console.log(r.data().reminderMessage);
        
        await db.collection('users').doc(doc.id).collection('reminders').doc(r.id).update({ timeLeft: frequency});

        twilioClient.messages
        .create({
          body: details,
          to: `+1${phoneNumber}`,
          from: '+13479708459',
        })
        .then((message) => console.log(message.sid));
      }
      else{
        await db.collection('users').doc(doc.id).collection('reminders').doc(r.id).update({ timeLeft: timeLeft})
      }

    });
  });
});

app.listen(port, () => {
  console.log('Server running on port ' + port);
});
