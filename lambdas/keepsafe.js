console.log('Loading event');

// Twilio Credentials 
var accountSid = '';
var authToken = '';
var fromNumber = '';

var https = require('https');
var http = require('http');
var queryString = require('querystring');

// Lambda function:
exports.handler = function (event, context) {

    console.log('Running event:', event);

    // Send an SMS message to the number provided in the event data.
    // End the lambda function when the send function completes.
    SendSMS(event.emergencyContact, 'I NEED HELP!!! MY LOCATION IS ('+event.latitude+','+event.longitude+')', event.uuid,
                function (error, response) { context.done(error, response); });

    
    
};


function SendSMSSuccess(uuid,completedCallback) {
    console.log(uuid);
    
     var options = {
  method: 'POST',
   host: '13.56.60.2',
   port: 8081,
   path: '/solace/aws/keepsafeSMS/sent',
   // authentication headers
   headers: {
      'Authorization': 'Basic ' + new Buffer('demo_user:password').toString('base64')
   }   
};
    const req = http.request(options, (res) => {
        let body = '';
        console.log('Status:', res.statusCode);
        console.log('Headers:', JSON.stringify(res.headers));
        res.setEncoding('utf8');
        res.on('data', (chunk) => console.log(chunk));
        res.on('end', () => {
            console.log('Successfully processed HTTP response');
            completedCallback(null,'ok');
           
        });
    });
    req.on('error', (error)=>{console.log(error);  completedCallback(JSON.stringify(e));});
    req.write(JSON.stringify({uuid:uuid}));
    req.end();
}


// Sends an SMS message using the Twilio API
// to: Phone number to send to
// body: Message body
// completedCallback(status) : Callback with status message when the function completes.
function SendSMS(to, body, uuid, completedCallback) {

    // The SMS message to send
    var message = {
        To: to,
        From: fromNumber,
        Body: body
    };

    var messageString = queryString.stringify(message);

    // Options and headers for the HTTP request
    var options = {
        host: 'api.twilio.com',
        port: 443,
        path: '/2010-04-01/Accounts/' + accountSid + '/Messages.json',
        method: 'POST',
        headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Content-Length': Buffer.byteLength(messageString),
                    'Authorization': 'Basic ' + new Buffer(accountSid + ':' + authToken).toString('base64')
                 }
    };

    // Setup the HTTP request
    var req = https.request(options, function (res) {

        res.setEncoding('utf-8');

        // Collect response data as it comes back.
        var responseString = '';
        res.on('data', function (data) {
            responseString += data;
        });

        // Log the responce received from Twilio.
        // Or could use JSON.parse(responseString) here to get at individual properties.
        res.on('end', function () {
            console.log('Twilio Response: ' + responseString);
         
            var r = JSON.parse(responseString);
            if (!r.sid) {
                completedCallback(JSON.stringify(r));
            } else {
                SendSMSSuccess(uuid,completedCallback);
            }
        });
    });

    // Handler for HTTP request errors.
    req.on('error', function (e) {
        console.error('HTTP error: ' + e.message);
        completedCallback(JSON.stringify(e));
    });

    // Send the HTTP request to the Twilio API.
    // Log the message we are sending to Twilio.
    console.log('Twilio API call: ' + messageString);
    req.write(messageString);
    req.end();

}