const otpGenerator = require("otp-generator");
const crypto       = require("crypto");
const admin = require('firebase-admin');
const DBUtil = require('../util/db_util');
admin.initializeApp();


exports.handler = async (data, context) => {
    const firestore = admin.firestore();
    const step = data["step"];
    const phoneNumber = `${data['phoneNumber']}`
    const key          = "fUjXn2r5u8x!A%D*G-KaPdSgVkYp3s6v";
    var otp = ''; // Key for cryptograpy. Keep it secret

    function createNewOTP(phoneNumber){
        // Generate a 6 digit numeric OTP
        const otp      = otpGenerator.generate(6, {alphabets: false, upperCase: false, specialChars: false});
        const ttl      = 5 * 60 * 1000; //5 Minutes in miliseconds
        const expires  = Date.now() + ttl; 
        const data     = `${phoneNumber}.${otp}.${expires}`; 
        const hash     = crypto.createHmac("sha256",key).update(data).digest("hex"); // creating SHA256 hash of the data
        const fullHash = `${hash}.${expires}`; // Hash.expires, format to send to the user

        // const accountSid = 'AC08c299ad810f7251a885eade6fb14552';
        // const authToken = 'c12a7ae6655a9758ab62d7ccce66bb77';
        // const client = require('twilio')(accountSid, authToken);

        // client.messages
        // .create({
        //     body: `This is your Verification Code ${otp}`,
        //     from: '+12029373069',
        //     to: phoneNumber
        // })
        return [fullHash,otp];
}
    function verifyOTP(phoneNumber,otp,hashNum){
        // Seperate Hash value and expires from the hash returned from the user
        let [hashValue,expires] = hashNum.split(".");
        let now = Date.now();
        if(now>parseInt(expires)) return 'falsebytime';
        let data  = `${phoneNumber}.${otp}.${expires}`;
        let newCalculatedHash = crypto.createHmac("sha256",key).update(data).digest("hex");
        // Match the hashes
        if(newCalculatedHash === hashValue){
            return true;
        } 
        return false;
    }
    
    if (step === '1') {
        //calculate fine
        var fine = 0.0;
        var amount = data['fineAmounts'];
        var commitedOff = data['offences'];
        for (let index = 0; index < commitedOff.length; index++) {
            fine = fine + amount[index];            
        }
        return fine;
    }
    else if(step === '2'){
        // var phoneNumber = data['phoneNumber'];
        var countryCode = '+94'
        var smsNumber = String(countryCode.concat(phoneNumber));

        var hashNum = createNewOTP(smsNumber);
        return hashNum;
}
else if(step === '3'){
    const otp = data['otp'];
    const hashNum = data['hashNum'];
    var cCode = '+94'
    var smsNum = String(cCode.concat(phoneNumber));
    var isTrue = verifyOTP(smsNum,otp,hashNum);
    return isTrue;
}
else if(step === '4'){
    var status = data['status'];
    var result= await admin.firestore().collection('Ticket').add({
        LicensePlate: data['licensePlate'],
        LicenseNumber: data['licenseNumber'],
        Area: new admin.firestore.GeoPoint(data['area'][0],data['area'][1]),
        Time: admin.firestore.FieldValue.serverTimestamp(),
        Status: data['status'],
        Offences: data['offences'],
        PhoneNumber: data['phoneNumber'],
        Vehicle: data['vehicle'],
        FineAmount: data['fineAmount'],
    });
    var updateSuccessLog = await admin.firestore().collection('PoliceMenActivity').doc(data['userID']).update({
        SuccessTickets :admin.firestore.FieldValue.increment(1)
    })
    if(status === 'reported'){
        var updateReportedLog = await admin.firestore().collection('PoliceMenActivity').doc(data['userID']).update({
            ReportedTickets :admin.firestore.FieldValue.increment(1)
        })
    }

    return result;
    }
    return `none`;

}

// const timestamp = admin.firestore.FieldValue.serverTimestamp()
// console.log(timestamp)