const functions = require('firebase-functions');
const axios = require('axios');
const dayjs = require('dayjs');
const admin = require('firebase-admin');
admin.initializeApp();


exports.getSingleCampsiteAvailability = functions.https.onRequest(async (req, res) => {
    
    console.log(req.headers);
    console.log(`hotelID: ${req.body.hotelID}`);

    axios.defaults.headers.post['Content-Type'] ='application/json;charset=utf-8';
    axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';
    axios.post('https://secure-hotels.net/INPA/BE_Engine.aspx/getAvalibility', 
    JSON.stringify({
        "hotelID": req.body.hotelID,
        "dsn": "",
        "lang": "heb",
        "days": 365,
        "fromdate": null,
        "enddate": null
    }))
    .then((response) => {
        const m = response.data.d.Availibility;
        m.length = 20;
        const data = [];
        for(let day of m) {
            let d = day.DayDate.match(/\d+/g)[0];
            d = new Date(parseInt(d));
            data.push({
                date: d.toISOString().split('T')[0],
            });
        }
        res.json(m);
        return m;
    }).catch((error) => {
        console.log(error);
        res.json({error: error});
        return false;
    });

  });

  exports.getAllCampsitesAvailability = functions.https.onRequest(async (req, res) => {
    const hotelIds = [8, 10, 11, 12, 13, 21, 9, 15, 24, 23, 26, 27, 17, 22];
    axios.defaults.headers.post['Content-Type'] ='application/json;charset=utf-8';
    axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';
    let promises = [];
    for (let hotelID of hotelIds) {
        promises.push(axios.post('https://secure-hotels.net/INPA/BE_Engine.aspx/getAvalibility', 
        JSON.stringify({
            "hotelID": hotelID,
            "dsn": "",
            "lang": "heb",
            "days": 365,
            "fromdate": null,
            "enddate": null
        })))
    }

    const results = await Promise.allSettled(promises);
    console.log(Date.now());
    let data = {
        lastUpdate: Date.now()
    };
    for (let result of results) {
        console.log('result.status:');
        console.log(result.status);
        if (result.status === 'fulfilled') {
            const config = JSON.parse(result.value.config.data);
            console.log('config:');
            console.log(config);
            if (!data[config.hotelID]) data[config.hotelID] = {};
            const resultData = result.value.data;
            console.log('data:');
            console.log(resultData);
            let availability = resultData.d.Availibility;
            availability.length = 2;
            console.log('availability:');
            console.log(availability);
            for(let day of availability) {
                console.log('day:');
                console.log(day);
                if (day && day.DayDate) {
                    const { DayDate, IsAvail, CloseToArrival, CloseToDeparture, MinDays, SumRoomsForSale, RoomsInHotel } = day;
                    const DayDateNum = parseInt(DayDate.substr(6));
                    const DayDateYYYYMMDD = (new Date(DayDateNum)).toISOString().split('T')[0];
                    data[config.hotelID][DayDateYYYYMMDD] = { IsAvail, CloseToArrival, CloseToDeparture, MinDays, SumRoomsForSale, RoomsInHotel };
                }
            }
        }
    }
    console.log(data);

    // Push the new message into Cloud Firestore using the Firebase Admin SDK.
    // const writeResult = await admin.firestore().collection('campsites').doc('worker').update(data);
    // data.writeResult = writeResult;

    // const db = admin.database();
    // const ref = db.ref("worker");
    // var usersRef = ref.child("latest");
    // usersRef.set(JSON.stringify(data));

    res.json(data);
  });


  exports.getAllCampsitesAvailabilityRawData = functions.https.onRequest(async (req, res) => {
    const hotelIds = [8, 10, 11, 12, 13, 21, 9, 15, 24, 23, 26, 27, 17, 22];
    axios.defaults.headers.post['Content-Type'] ='application/json;charset=utf-8';
    axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';
    let promises = [];
    for (let hotelID of hotelIds) {
        promises.push(axios.post('https://secure-hotels.net/INPA/BE_Engine.aspx/getAvalibility', 
        JSON.stringify({
            "hotelID": hotelID,
            "dsn": "",
            "lang": "heb",
            "days": "60",
            "fromdate": null,
            "enddate": null
        })))
    }

    const results = await Promise.all(promises);
    let data = {
        lastUpdate: Date.now()
    };
    for (let result of results) {
        const config = JSON.parse(result.config.data);
        data[config.hotelID] = result.data.d.Availibility;
    }
    res.json(data);
  });


  exports.saveAvailability = functions.https.onRequest(async (req, res) => {
    const snapshot = req.body.data;
    console.log(`updating RTDB. snapshot time: ` + snapshot.lastUpdate);

    // const writeResult = await admin.firestore().collection('campsites').doc('worker').update(snapshot);
    // console.log(writeResult);

    const db = admin.database();
    const ref = db.ref("worker");
    const childRef = ref.child("latest");
    childRef.update(snapshot);

    res.json(snapshot.lastUpdate);
  });

  exports.saveLogMessage = functions.https.onRequest(async (req, res) => {
    const queryStringMessage = req.query.message;
    console.log('adding log message: ' + queryStringMessage);
    const db = admin.database();
    const ref = db.ref('worker');
    const childRef = ref.child('log');
    const timestamp = Date.now()
    const d = (new Date(timestamp)).toISOString().split('.')[0];
    try {
        const saveResult = await childRef.update({ [timestamp] : d + ' ' + queryStringMessage });
        saveResult ? console.log(saveResult) : null;
        res.json(saveResult ? saveResult : true);
    } catch(error) {
        console.log(error);
        res.json(error);
    }
  });