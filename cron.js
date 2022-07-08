const schedule = require('node-schedule');
const fs = require('fs/promises');
const getTraffic=require('./request')
var allrequests=0;
var currentDatabase=[];
exports.makeReqWriteOutput=function sheduleNmakeReqs(params) {
  // fs.readFile("./output/output.json")
  // .then((data) => {
  // currentDatabase=JSON.parse(data);

  // console.log("Old database file read @ cron.js line 9 to 11")
  // console.log("Last item")
  // console.log(currentDatabase[currentDatabase.length-1])
  // })
  // .catch((error) =>
  // console.log("Making new request json output file"));
 getRecentDatabase()

  var dates=[];
  //Read request file and schedule requests

  fs.readFile("./output/request_data24hr.json")
  .then((data) => {
    const requestArray=JSON.parse(data);
    console.log(requestArray.length)
  
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
        // console.log(`executed at ${dates[dait]}`);
        // console.log("---")
      
 
           var id=0;
           requestArray[dait]["strings"].forEach(request => {
        
          console.log(requestArray[dait].strings[id])
          console.log("...")
          console.log(requestArray[dait].ids[id])
          getTraffic.getTrafficInfo(request,currentDatabase,requestArray[dait].ids[id],requestArray[dait].time);

          id+=1;
          console.log(id)
          currentDatabase=getTraffic.returnDatabase
        });
      
    
      });
    
    }
    console.log(`Scheduled  ${allrequests} requests  @ cron.js, line 50`);
  
   })
}
                        
  
//sheduleNmakeReqs()


                        
  
  function getRecentDatabase(params) {

    fs.readFile("./output/output.json")
    .then((data) => {
    currentDatabase=JSON.parse(data);
  
    console.log("Current database file read @ cron.js line 9 to 11")
    console.log("Last item")
    console.log(currentDatabase[currentDatabase.length-1])
    console.log(currentDatabase[currentDatabase.length-1])
    return currentDatabase;
    })
    .catch((error) =>
    {
      console.log(error)
      console.log("Error reading request file");
      return [];
    });
    
  }

