var app = require('express')();
const firebase = require('firebase-admin');
const serviceAccount = require('./evakey.json');
var server = require('http').Server(app);
const fs = require('fs');
var decode = require('decode-html');

firebase.initializeApp({
    credential: firebase.credential.cert(serviceAccount),
    databaseURL: "https://evapay-91708-default-rtdb.europe-west1.firebasedatabase.app"
});
var db = firebase.database();

const port = 3002;
server.listen(port);
console.log("started.");

app.get('/iq/securepage', function (request, res, next) {
    var threed_data = "";
    var referans = request.query.b;
    var ref = db.ref("iq/" + request.query.b);

    ref.once("value", function (snapshot) {
        var values = snapshot.val();
        if (values) {
            let change_to_form = Buffer.from(values.message, 'base64');
            ref.remove().then(() => {
                res.send(decode(change_to_form.toString('utf-8')));
            });
        }
        else {
            res.send("Ödeme bilgileri getirilemedi");
        }


    }).catch(function (e) {
        res.send("hata: " + e);
    });
});
