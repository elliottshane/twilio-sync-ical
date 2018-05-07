'use strict';

const http = require('http');
const path = require('path');
const express = require('express');
const AccessToken = require('twilio').jwt.AccessToken;
const SyncGrant = AccessToken.SyncGrant;
const randomUsername = require('./randos');
const config = require('./config.js');
const ical = require('ical-generator')

// Create Express webapp
var app = express();
app.use(express.static(path.join(__dirname, 'public')));

/*
Generate an Access Token for a sync application user - it generates a random
username for the client requesting a token, and takes a device ID as a query
parameter.
*/
app.get('/token', (request, response) => {
  let appName = 'TwilioSyncDemo';
  let identity = randomUsername();

  // Create a "grant" which enables a client to use Sync as a given user,
  // on a given device
  let syncGrant = new SyncGrant({
    serviceSid: config.serviceSid,
  });

  // Create an access token which we will sign and return to the client,
  // containing the grant we just created
  let token = new AccessToken(
    config.accountSid, 
    config.apiKey, 
    config.apiSecret
  );
  token.addGrant(syncGrant);
  token.identity = identity;

  // Serialize the token to a JWT string and include it in a JSON response
  response.send({
    identity: identity,
    token: token.toJwt()
  });
});

app.get('/appt', (request, response) => {
    
    var cal = ical();
    
    cal.createEvent({
        start: new Date(),
        end: new Date(new Date().getTime() + 3600000),
        summary: 'Example Event',
        description: 'It works ;)',
        location: 'my room',
        url: 'http://sebbo.net/'
    });
    cal.serve(response)
    
 /* response.send({appt:request.query.appt,
      location:request.query.loc
  });*/

    
    
});
var text={"hello.txt":"Hello World!","bye.txt":"Goodbye Cruel World!"};
app.get('/files',(req,res)=>{
    
   //  res.send('yes'
    //);
   res.set({"Content-Disposition":"attachment; filename=\"req.params.name\""});
   res.send(text);
});


// Create http server and run it
var server = http.createServer(app);
var port = process.env.PORT || 4567;
server.listen(port, () => {
  console.log('Express server running on *:' + port);
});
