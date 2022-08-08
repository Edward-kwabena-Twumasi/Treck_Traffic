
'use strict'

const schedule = require('node-schedule');
const fs = require('fs');
const getTraffic=require('./request')
const Stream = require('stream');

var allrequests=0;
var currentDatabase=[];
var requestFileData=[];

//function begins

exports.makeReqWriteOutput=
  function Cron(params) {

    try { 

//read json database file using read srteams

  let readJsonDatabase = fs.createReadStream("./output/output.json");

  //write stream for json database declaraiton
  const writeJsonData = new Stream.Writable();

  let readJsonRequestsFile=fs.createReadStream("./output/request_data24hr.json");
  //write stream for request file declaration
  const writeJRequests = new Stream.Writable();

//write streams for request file
  writeJRequests._write = (chunk, {}, next) => {
    // console.log(chunk.toString());
     currentDatabase.push(chunk.toString());
     next();
     };

  //write stream for json database
  writeJsonData._write = (chunk, {}, next) => {
 // console.log(chunk.toString());
  currentDatabase.push(chunk.toString());
  next();
  };

  readJsonDatabase.pipe(writeJsonData);
    readJsonDatabase.on('end', function() { 
       // After reading file using streams
   var dates=[];
  
    console.log("currentDatabase");
    currentDatabase=JSON.parse(currentDatabase);
    console.log(currentDatabase);

   
  fs.readFile("./output/request_data24hr.json",(err,data) => {
  
    if (err) {
      throw err;
    }
    console.log("############################################");
    console.log("Reading and scheduling requests right now");
    console.log("############################################");


    const requestArray=JSON.parse(data);
  
    for (const request in requestArray) {
   dates.push(new Date(requestArray[request].time));
    
    }
  
    for (const dait in dates) {
      //console.log(`execute at ${dates[dait]}`);
      var id=0;
      requestArray[dait]["strings"].forEach(request => {
      
        id+=1;

      });
      allrequests+=id;
      const job = schedule.scheduleJob(dates[dait], function(){
        
           var id=0;
           requestArray[dait]["strings"].forEach(request => {
        
          console.log(requestArray[dait].strings[id])
          console.log("...")
          console.log(requestArray[dait].ids[id])
          getTraffic.getTrafficInfo(request,currentDatabase,requestArray[dait].ids[id],requestArray[dait].time);

          id+=1;
          console.log(id)
            });
      
    
      });
    
    }
    console.log(`Scheduled  ${allrequests} requests  @ cron.js, line 50`);
  
  })

});
readJsonDatabase.on('error', function(err) { 
 console.log(err); 
 throw err;

});

} 
catch (error) {
  console.log("An error occured in catch block")
    console.log(error)
  }

}
                        
  
//Cron()

