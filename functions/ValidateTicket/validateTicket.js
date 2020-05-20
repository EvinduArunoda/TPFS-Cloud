const admin = require('firebase-admin');
const DBUtil = require('../util/db_util');
const path = require('path');
const os = require('os');
var request = require('request');   // install request module by - 'npm install request'
var fs = require('fs');
const util = require('util');
admin.initializeApp();

exports.handler = async (data, context) => {

    const uid = data['uid']
    const id = data['id']
    const platefilePath = data['platefilePath'];
    // const numberfilePath = data['numberfilePath']

    const bucket = admin.storage().bucket('e-fining-sep.appspot.com');
    const tempFilePathImage = path.join(os.tmpdir(), `${uid}licenseplate.jpg`);
    // const tempFilePathNumber = path.join(os.tmpdir(), `${uid}licensenumber.jpg`);

    await bucket.file(platefilePath).download({destination: tempFilePathImage});
    // await bucket.file(numberfilePath).download({destination: tempFilePathNumber});
    // }

    const form_data_image = {
    file: fs.createReadStream(tempFilePathImage),
    }
    // const form_data_number = {
    //     file: fs.createReadStream(tempFilePathNumber),
    // }
    
    // const options_number = {
    //     url : "https://app.nanonets.com/api/v2/OCR/Model/4d4d06e2-31b2-44be-b315-6feece5ccdf0/LabelFile/",
    //     formData: form_data_number,
    //     headers: {
    //         'Authorization' : 'Basic ' + Buffer.from('xgsQeortRtYkkno0536vkXDFpL8TJScy' + ':').toString('base64')
    //     }
    // }

    const options_image = {
        url : "https://app.nanonets.com/api/v2/OCR/Model/323b562f-afe4-4fcd-8940-f6658bc93512/LabelFile/",
        formData: form_data_image,
        headers: {
            'Authorization' : 'Basic ' + Buffer.from('xgsQeortRtYkkno0536vkXDFpL8TJScy' + ':').toString('base64')
        }
    }

    async function processlicense(callback){
        request.post(options_image, function (err, httpResponse, body) {
            if (err) {
                return console.error(err);
            }
                return callback(body);
            });
    }

    // async function processlicenseNumber(callback){
    //     request.post(options_number, function (err, httpResponse, body) {
    //         if (err) {
    //             return console.error(err);
    //         }
    //             return callback(body);
    //         });
    // }

    await processlicense(async function(response){
        result = response
        jsonObjext = JSON.parse(result);
        upload = jsonObjext.result[0]
        console.log(upload)
        // await processlicenseNumber(async function(responseNumber){
            // resultNumber = responseNumber
            // jsonObjextNumber = JSON.parse(resultNumber);
            // uploadNumber = jsonObjextNumber.result[0]
            // console.log(uploadNumber)
            await admin.firestore().collection('TicketValidate').doc(uid).set({
                assessedPolicemenId : id,
                LicensePlateImage : upload,
                // LicenseNumberImage : uploadNumber
            });
            fs.unlinkSync(tempFilePathImage);
            // fs.unlinkSync(tempFilePathNumber);
        // })
        
    })
    return null;
}