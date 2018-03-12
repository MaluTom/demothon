'use strict';

const http = require('http');


function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}

exports.handler = (event, context, callback) => {
   
   console.log(event);
    
    var options = {
  method: 'POST',
   host: event.router,
   port: event.port,
   path: event.topic,
   // authentication headers
   headers: {
      'Authorization': 'Basic ' + new Buffer(event.username + ':' + event.password).toString('base64')
   }   
};
    const req = http.request(options, (res) => {
        let body = '';
        console.log('Status:', res.statusCode);
        console.log('Headers:', JSON.stringify(res.headers));
        res.setEncoding('utf8');
        res.on('data', (chunk) => console.log(chunk));
        res.on('end', () => {
            console.log('Successfully processed HTTPS response');
           
        });
    });
    
    //add a UUID to the event.data
    event.data.uuid=guid();
    
    req.on('error', (error)=>{console.log(error)});
    req.write(JSON.stringify(event.data));
    req.end();
    
   const response = {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin" : "*", // Required for CORS support to work
        "Access-Control-Allow-Credentials" : true // Required for cookies, authorization headers with HTTPS 
      },
      body: JSON.stringify({ "message": "OK" })
   };

   callback(null, response);
};
