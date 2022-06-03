
const schedule = require('node-schedule');
const fs = require('fs/promises');
const getTraffic=require('./request')
var allrequests=0;
var currentDatabase=[];
exports.makeReqWriteOutput=function name(params) {
  
 fs.readFile("output.json")
.then((data) => {
   currentDatabase=JSON.parse(data);

}).catch((error) =>
console.log(error));
var dates=[];
fs.readFile("./output/request_data24hr.json")
.then((data) => {
  const requestArray=JSON.parse(data);
 
  for (const request in requestArray) {
dates.push(new Date(requestArray[request].time));
   
  }
 
  for (const dait in dates) {
    //console.log(`execute at ${dates[dait]}`);
    var id=0;
    requestArray[dait]["strings"].forEach(request => {
     
    //   console.log(requestArray[dait].strings[id])
    //   console.log("...")
    //   console.log(requestArray[dait].ids[id])
    //  /// getTraffic.getTrafficInfo(request,currentDatabase,requestArray[dait].ids[id],requestArray[dait].time);

      id+=1;

    });
    allrequests+=id;
    const job = schedule.scheduleJob(dates[dait], function(){
      // console.log(`executed at ${dates[dait]}`);
      // console.log("---")
     
var ar=[]
var id=0;
      requestArray[dait]["strings"].forEach(request => {
       
        console.log(requestArray[dait].strings[id])
        console.log("...")
        console.log(requestArray[dait].ids[id])
        getTraffic.getTrafficInfo(request,currentDatabase,requestArray[dait].ids[id],requestArray[dait].time);

        id+=1;

      });
     
   
    });
  
  }
  console.log(`Scheduled  ${allrequests} requests  @ cron.js, line 50`);
 
})}
                      
//console.log(dates.length);
//function to add hours to date

Date.prototype.addHours = function(h) {
  this.setTime(this.getTime() + (h*60*60*1000));
  return this;
}

//function to add minuts to date
Date.prototype.addMinutes = function(m) {
  this.setTime(this.getTime() + (m*60*1000));
  return this;
}



