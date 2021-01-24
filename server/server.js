const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const multer = require('multer');
const cors = require('cors');
const text2num = require('./text2num.js');

const vision = require('@google-cloud/vision');

const app = express();
const port = 8000;

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
  const { gcsImageUri } = req.body;

  if (!gcsImageUri) {
    res.status(400).send('No Uri Passed');
  }

  const [result] = await client.textDetection(gcsImageUri);

  const detections = result.textAnnotations;
  description = detections[0]['description'];

  const details = text2num(description);

  let response = {
    description,
    details,
  };

  res.status(200).send(response);
});

app.listen(port, () => {
  console.log('Server running on port ' + port);
});
