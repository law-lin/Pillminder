
const express = require("express")
const bodyParser = require('body-parser')
const path = require("path")
const multer = require("multer")

const vision = require('@google-cloud/vision')

const app = express()
const port = 8000

const client = new vision.ImageAnnotatorClient({
    keyFilename: 'keys.json'
});

app.use(bodyParser.json());

const getFields = multer()

app.get('/', async(req, res)=> {
    res.send('Welcome to Pillminder\'s API')
})

app.post('/extract/', getFields.none(), async(req, res)=> {
    // TODO: make sure req is a file 
 
    const { gcsImageUri } = req.body

    if (!gcsImageUri){
        res.status(400).send('No Uri Passed')
    }

    const [result] = await client.textDetection(gcsImageUri)

    const detections = result.textAnnotations;
    description = detections[0]['description']

    let response = {
        description: description
    }   

    res.status(200).send(response)
});

app.listen(port, ()=> {
    console.log('Server running on port ' + port);
});
