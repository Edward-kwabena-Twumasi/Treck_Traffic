
'use strict'

const schedule = require('node-schedule');
const fs = require('fs');
const getTraffic=require('./request')
const Stream = require('stream');

var allrequests=0;
var currentDatabase="";
var requestFileData="";

//function begins

exports.makeReqWriteOutput=
  function Cron(params) {

    try { 

//read json database file using read srteams

  let readJsonDatabase = fs.createReadStream("./output/output.json",{ encoding: 'utf8' });

  //write stream for json database declaraiton
  const writeJsonData = new Stream.Writable();

  let readJsonRequestsFile=fs.createReadStream("./output/request_data24hr.json",{ encoding:'utf8' });

  //write stream for request file declaration
  const writeRequests = new Stream.Writable();

//write streams for request file
  writeRequests._write = (chunk, {}, next) => {
    // console.log(chunk.toString());
     requestFileData += chunk;
     next();
     };

  //write stream for json database
  writeJsonData._write = (chunk, {}, next) => {
 // console.log(chunk.toString());
  currentDatabase+=chunk;
  next();
  };

  readJsonDatabase.pipe(writeJsonData);
    readJsonDatabase.on('end', function() { 
       // After reading file using streams
   var dates=[];
  
    console.log("currentDatabase");
    currentDatabase=JSON.parse(currentDatabase);
    console.log(currentDatabase[currentDatabase.length-1]);

//pipe read rwuest stream to write stream
   readJsonRequestsFile.pipe(writeRequests);
//read stream on end
   readJsonRequestsFile.on('end',function(){
    
    console.log("############################################");
    console.log("Reading and scheduling requests right now");
    console.log("############################################");

    //console.log(requestFileData);
    console.log("Request files");
    requestFileData=JSON.parse(requestFileData);
    const requestArray=requestFileData;
   // console.log(requestFileData[requestFileData.length-1]);
   
  
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
   //read request file stream on error
   readJsonRequestsFile.on('error',function(){

    throw erroor;
  })


});

//error reading json database
readJsonDatabase.on('error', function(err) { 
 console.log(err); 
 

});

} 

catch (error) {
  console.log("An error occured in catch block")
    console.log(error)
   
  }

}
                        
  
//Cron()

