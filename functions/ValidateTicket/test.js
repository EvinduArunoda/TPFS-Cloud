// const path = require('path');
// const os = require('os');
// var request = require('request'); 
// var fs = require('fs')
// const util = require('util');
// async function start(){
// const form_data_image = {
//     file: fs.createReadStream('KI-8407.jpg'),
//     }

//     const form_data_number = {
//         file: fs.createReadStream('53388233bh.jpg'),
//     }
    
//     const options_number = {
//         url : "https://app.nanonets.com/api/v2/OCR/Model/4d4d06e2-31b2-44be-b315-6feece5ccdf0/LabelFile/",
//         formData: form_data_number,
//         headers: {
//             'Authorization' : 'Basic ' + Buffer.from('xgsQeortRtYkkno0536vkXDFpL8TJScy' + ':').toString('base64')
//         }
//     }

//     const options_image = {
//         url : "https://app.nanonets.com/api/v2/OCR/Model/323b562f-afe4-4fcd-8940-f6658bc93512/LabelFile/",
//         formData: form_data_image,
//         headers: {
//             'Authorization' : 'Basic ' + Buffer.from('xgsQeortRtYkkno0536vkXDFpL8TJScy' + ':').toString('base64')
//         }
//     }
// // async function processlicense(callback){
//     const readFilePromise = util.promisify(request.post)
//     results = await readFilePromise(options_image)
//     .then(body => { 
//         imagedetail = body
//         return imagedetail.body
//         // console.log(imagedetail.body);
//     })
//     .catch(err => { console.error(err)})
//     // console.log(results)
//     jsonObjext = JSON.parse(results);
//     upload = jsonObjext.result[0]
//     // delete upload.filepath
//     // delete upload.page
//     // delete upload.request_file_id
//     // delete upload.prediction[0].xmax
//     // delete upload.prediction[0].xmin
//     // delete upload.prediction[0].ymax
//     // delete upload.prediction[0].ymin
//     console.log(upload)
//     // upload = results.result[0] 
//     // console.log(upload);
//     // request.post(options_image, function (err, httpResponse, body) {
//     //     // console.log(body);
//     //     if (err) {
//     //         return console.error(err);
//     //     }
//     //     // imageDetails = body
//     //     // return callback(imageDetails);
//     //     // return callback(body);
//     // });
// // // }
// // await processlicense(function(response){return response;})

// // console.log(image)

// }
// start();
   

//     // console.log(results);
//     // console.log(results);