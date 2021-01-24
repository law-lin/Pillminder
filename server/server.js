const dotenv = require('dotenv');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const multer = require('multer');
const cors = require('cors');
const text2num = require('./text2num.js');
const twilio = require('twilio');
const vision = require('@google-cloud/vision');

const app = express();
const port = 8000;

dotenv.config();

var accountSid = process.env.TWILIO_ACCOUNT_SID;
var authToken = process.env.TWILIO_AUTH_TOKEN;

const twilioClient = new twilio(accountSid, authToken);

const client = new vision.ImageAnnotatorClient({
  keyFilename: 'keys.json',
});

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

  const [result] = await client.textDetection(gcsImageUri);

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

app.listen(port, () => {
  console.log('Server running on port ' + port);
});
