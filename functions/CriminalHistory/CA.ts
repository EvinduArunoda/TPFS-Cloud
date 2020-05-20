const faceapi = require('face-api.js');
const fs = require('fs');
const os = require('os');
import '@tensorflow/tfjs-node';
import fetch from 'node-fetch';
const admin = require('firebase-admin');
const DBUtil = require('../util/db_util');
const path = require('path');
import * as canvas from 'canvas';
const { Canvas, Image, ImageData } = canvas
faceapi.env.monkeyPatch({ Canvas, Image, ImageData,fetch: fetch  })
const MODELS_URL = path.join(__dirname, 'models');
async function loadModels(){
  await faceapi.nets.faceRecognitionNet.loadFromDisk(MODELS_URL)
  await faceapi.nets.faceLandmark68Net.loadFromDisk(MODELS_URL)
  await faceapi.nets.ssdMobilenetv1.loadFromDisk(MODELS_URL)
  start()
}
loadModels()

async function start() {
  const labeledFaceDescriptors = await loadLabeledImages()
  const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, 0.5)

    const image = await canvas.loadImage(`labeled_images/Captain America/1.jpg`)
    const displaySize = { width: image.width, height: image.height }
    const detections = await faceapi.detectSingleFace(image).withFaceLandmarks().withFaceDescriptor()
    const resizedDetections = faceapi.resizeResults(detections, displaySize)
    // const results = resizedDetections.map(d => faceMatcher.findBestMatch(d.descriptor))
    var results = faceMatcher.findBestMatch(resizedDetections.descriptor);
    const distance = results.distance
    const label = results.label
    const criminalString = `{ "personName": "${label}", "corelation":"${distance}"}`
    const criminalObject = JSON.parse(criminalString)
    console.log(criminalObject)
}

function loadLabeledImages() {
  const labels = ['Black Widow', 'Captain America', 'Captain Marvel', 'Hawkeye', 'Jim Rhodes', 'Thor', 'Tony Stark']
  const fullarray = []
  return Promise.all(
    labels.map(async label => {
      const descriptions = []
      for (let i = 1; i <= 2; i++) {
        const img = await canvas.loadImage(`labeled_images/${label}/${i}.jpg`)
        const detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor()
        descriptions.push(detections.descriptor)
      }
      // console.log(descriptions);
      return new faceapi.LabeledFaceDescriptors(label, descriptions)
    })
  )
}