const express = require("express");
const router = express.Router();

const axios = require("axios");

const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');


var fileIdRequest = "";
var fileNameRequest = "";
router.get("/", (req, res)=>{
  fileIdRequest = req.query.id;
  fileNameRequest = req.query.name;


  const SCOPES = ["https://www.googleapis.com/auth/drive","https://www.googleapis.com/auth/drive.appdata","https://www.googleapis.com/auth/drive.apps.readonly","https://www.googleapis.com/auth/drive.file","https://www.googleapis.com/auth/drive.metadata","https://www.googleapis.com/auth/drive.metadata.readonly","https://www.googleapis.com/auth/drive.photos.readonly","https://www.googleapis.com/auth/drive.readonly"];
  const TOKEN_PATH = 'credentials.json';
  
  fs.readFile('client_secret.json', (err, content) => {
    if (err) return console.log('Error loading client secret file:', err);
    

    authorize(JSON.parse(content).web, listFiles); 
    
    res.send("termina funcion <a href='/'>index</a>");
  });

  function authorize(credentials, callback) {
    const client_secret = credentials.client_secret;
    const client_id = credentials.client_id;
    const redirect_uris = credentials.redirect_uris;
    console.log(client_id + "   " + client_secret + "    " + redirect_uris);

    const oAuth2Client = new google.auth.OAuth2(
        client_id, client_secret, redirect_uris[0]);

    fs.readFile(TOKEN_PATH, (err, token) => {
      if (err) return getAccessToken(oAuth2Client, callback);
      oAuth2Client.setCredentials(JSON.parse(token));
      callback(oAuth2Client);
    });
  }

  function getAccessToken(oAuth2Client, callback) {
    const authUrl = oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES,
    });

    console.log('Authorize this app by visiting this url:', authUrl);
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    rl.question('Enter the code from that page here: ', (code) => {
      rl.close();
      oAuth2Client.getToken(code, (err, token) => {
        if (err){ console.log("Error en oauth2" + err);return callback(err);}
        oAuth2Client.setCredentials(token);
        fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
          if (err) console.error(err);
          console.log('Token stored to', TOKEN_PATH);
        });
        callback(oAuth2Client);
      });
    });
  }
  
  
   
  async function listFiles(auth) {
    console.log("Llega al list files function");
    const drive = google.drive({version: 'v3', auth});
    var fileName = fileNameRequest;
    var fileId = fileIdRequest;
    var urldelarchivonuevo="/tmp/"+fileName;
var dest = fs.createWriteStream(urldelarchivonuevo);
const respuesta = await drive.files.get({
  fileId: fileId,
  alt: 'media' 
},{responseType : 'stream'},
function(err, result) {
  result.data.pipe(dest);
  
  
});
  }
  
  
});




module.exports = router; 