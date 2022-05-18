const { getSingleCount, getAllCounts, GENRES } = require('./fetcher');
const { JWT, auth } = require('google-auth-library');
const { google } = require('googleapis');
const readline = require('readline');
const fs = require('fs');
require('dotenv').config();

const TOKEN_PATH = "blank.json";
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
const authorize = (credentials, callback) => {
  const { client_secret, client_id, redirect_uris } = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
    client_id, client_secret, redirect_uris[0]);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getNewToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client);
  });
};

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
const getNewToken = (oAuth2Client, callback) => {
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
      if (err) return console.error('Error retrieving access token', err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) console.error(err);
        console.log('Token stored to', TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
};

/**
 * Prints the names and majors of students in a sample spreadsheet:
 * @see https://docs.google.com/spreadsheets/d/1B0kUj8O8Qo01asSStcHfAtdpzrni4AUMxNfzvFTaoR0/edit
 * @param {google.auth.OAuth2} auth The authenticated Google OAuth client.
 */
const listMajors = (auth) => {
  const sheets = google.sheets({ version: 'v4', auth });
  sheets.spreadsheets.values.get({
    spreadsheetId: '1B0kUj8O8Qo01asSStcHfAtdpzrni4AUMxNfzvFTaoR0',
    range: 'B1:AD1',
  }, (err, res) => {
    if (err) return console.log('The API returned an error: ' + err);
    const row = res.data;
    sheets.spreadsheets.batchUpdate({
      spreadsheetId: '1B0kUj8O8Qo01asSStcHfAtdpzrni4AUMxNfzvFTaoR0',
      resource: {
        requests: [{
          updateCells: {
            rows: row,
            range: 'B6:AD6'
          }
        }]
      }
    })
      .then(val => {
        console.log(JSON.stringify(val));
      });
  });
};

const keys = JSON.parse(process.env.OAUTH);
authorize(keys, listMajors);