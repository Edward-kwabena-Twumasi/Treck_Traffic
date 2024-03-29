//App.js file owns the functionalities of reading and preprocessing 
//the input file the program is to run with and then creating 
//a request file to be scheduled by the program
'use strict'
const myxlsx=require("xlsx");

const fs = require('fs/promises')
const streamfs=require('fs')
const requestsNdOutput=require('./cron')
const Stream = require('stream');
require("dotenv").config()

const google_api_key=process.env.google_api_key
//Read input file from the output folder 
//if it yet exists or access it from root folder

var input_work_book;
try {
 input_work_book= myxlsx.readFile("./output/input_data.xlsx",{})
} catch (error) {
  input_work_book= myxlsx.readFile("./input_data.xlsx",{})
  
}


var mysheets=input_work_book.SheetNames;


var trip_times=input_work_book.Sheets[mysheets[3]];
var od_pairs=input_work_book.Sheets[mysheets[1]];

 trip_times=myxlsx.utils.sheet_to_json(trip_times);

 //console.log(trip_times)
var odpairs=myxlsx.utils.sheet_to_json(od_pairs);
 
//all request times
var reqtimes=[]
var starttimes=[];
var stoptimes=[];
var req_times24hr=[];
var ids=[]

//Contains ids with all their request times as an object
var totalreqtimes=[];
//generated outout json
var trip_time_series=[];

//all times for one particular id
var timesfroneid=[]
//time_ids_array is an empty list now

var time_ids_array=[]

//3
 function createReqTimes(startime,stoptime,timestep,timesforid) {
  
    reqtimes=[]
    var start=startime.toString();
    var stop=stoptime.toString();
    var step=timestep.toString();
    //push request times for all ids into giant array
    reqtimes.push((start.split(".")[0]*60 +start.split(".")[1]*1))
    //push request times for a single id into one array
    timesforid.push((start.split(".")[0]*60 +start.split(".")[1]*1))
    //push unique request times
    req_times24hr.push((start.split(".")[0]*60 +start.split(".")[1]*1))
    //console.log(start+"  "+stop)
    
   var difference=-(start.split(".")[0]*60 +start.split(".")[1]*1)+(stop.split(".")[0]*60+stop.split(".")[1]*1)

   //console.log(start+"  "+stop +"1")
   var periods=difference/step*1
   for (let i = 1; i <= periods; i++) {
    reqtimes.push((start.split(".")[0]*60 +  start.split(".")[1]*1)+i*timestep)

    timesforid.push((start.split(".")[0]*60 +  start.split(".")[1]*1)+i*timestep)

    req_times24hr.push((   start.split(".")[0]*60  +  start.split(".")[1]*1)+i*timestep)
   
   }
    }


//trip times is a work sheet from our excel workbook containing
//fields for start time,end time,time step and trip ids
//we will try to read,preprocess and convert the data into a usable
//and more understandable format

// 4
exports.parse_tripTimes= function parse_tripTimes() {
  console.log("-------------------------------------------------------")
  console.log("parsing trip times for preprocessing @ app.js ,line 70")
  console.log("-------------------------------------------------------")
//console.log("creating request times from parsed trip times")
trip_times.map(function(row) {

timesfroneid=[]

starttimes=[]

stoptimes=[]

var steps=[]

ids=[]
   
   ids.push(row["trip_id"]);
   for (let index = 0; index < Object.keys(row).length; index++) {
    if (row["start_time_"+index] !=undefined) {
        starttimes.push(row["start_time_"+index]);
    }
    if (row["stop_time_"+index] !=undefined) {
        stoptimes.push(row["stop_time_"+index]);
    }
    if (row["time_step_min_"+index] !=undefined) {
       steps.push(row["time_step_min_"+index]);
    }
       
   }
  
  for (let j = 0; j < starttimes.length; j++) {
    createReqTimes(starttimes[j],stoptimes[j],steps[j],timesfroneid) 
    
  }
    totalreqtimes.push({"id":ids.toString(),reqtimes:timesfroneid})
  trip_time_series.push({})

});

}

//5
// parse_tripTimes();
//###############################################################


exports.get_runTime=function get_runTime(params) {
  console.log("------------------------------------------------------------------")
  console.log("Getting run time from trip times after parsing @ app.js ,line 116")
  console.log("------------------------------------------------------------------")
 
  req_times24hr = [...new Set(req_times24hr)]
  req_times24hr.sort(function(a, b) {
      return a - b;
    });
  console.log("Requests start time(hrs) .. "+req_times24hr[0]/60+".... Requests end time(hrs) ....."+req_times24hr[req_times24hr.length-1]/60);

  var startTime=req_times24hr[0]/60;
  var endTime=req_times24hr[req_times24hr.length-1]/60;

  exports.startTime=startTime
  exports.endTime=endTime

  
}

exports.sort_ttseries= function sort_ttseries(params) {
  
  console.log("----------------------------------------------")
  console.log("Sorting trip times after parsing @ app.js ,line 132")
 console.log("----------------------------------------------")

  req_times24hr = [...new Set(req_times24hr)]
  req_times24hr.sort(function(a, b) {
      return a - b;
    });
// console.log("Start making requests at ... "+req_times24hr[0]/60+" | end Reuests at ... "+req_times24hr[req_times24hr.length-1]/60)



//generate generate trip_time_series
for (let ob = 0; ob < totalreqtimes.length; ob++) {
  trip_time_series[ob]["id"]= totalreqtimes[ob]["id"]
 

  for (let t = 0; t < req_times24hr.length; t++) {
  if (totalreqtimes[ob]["reqtimes"].includes(req_times24hr[t])) {
    trip_time_series[ob][req_times24hr[t]]=1
  } else {
    trip_time_series[ob][req_times24hr[t]]=0
  }
  
  }
  
}

//time_ids_array generation
for (const k in req_times24hr) {
  var ids=[]
  for (const l in trip_time_series) {
   
     if (trip_time_series[l][req_times24hr[k]]==1) {
       ids.push(trip_time_series[l].id)
       ids=[...new Set(ids)]

    } 
  }
  time_ids_array.push({time:req_times24hr[k],ids:ids})
  time_ids_array=[...new Set(time_ids_array)]
}

if (mysheets.indexOf("trip_time_series")>-1) {
  //console.log("Trip time series exists")
}

else{var output=myxlsx.utils.json_to_sheet(trip_time_series)
myxlsx.utils.book_append_sheet(input_work_book,output,"trip_time_series")
myxlsx.writeFile(input_work_book,"./output/input_data.xlsx")
}

}


// sort_ttseries()

// //###############################################################

// //convert generated output into excel sheet-

//1

/////////////////////
//Function to build request strings
////////////////////

 function genRequestString(obj,key,mode,traffic_mode,obj1,finalstring) {
  var today = new Date();
var month = today.getUTCMonth() ; //months from 1-12
var day = today.getUTCDate();
var year = today.getUTCFullYear();

  const hour=parseInt(obj1.time*1/60);
  const min=obj1.time*1%60;
    const departure = new Date(year, month, day, hour, min);
    //const timemil=departure.getTime()
    var destinations=`${obj.origin_latitude}%2c${obj.origin_longitude}`;
    var origins=`${obj.destination_latitude}%2c${obj.destination_longitude}`;
    var baseUrl="https://maps.googleapis.com/maps/api/distancematrix/json";
    var thisRequest=`${baseUrl}?destinations=${destinations}&origins=${origins}&mode=${mode}&traffic_mode=${traffic_mode}&departure_time=today&key=${key}`;

    return thisRequest;
   
  }


//2
//createe requests for the day

exports.createDayRequests= function createDayRequests(params) {

var request_data24hr=[]
var today = new Date();
var month = today.getUTCMonth() ; //months from 1-12
var day = today.getUTCDate();
var year = today.getUTCFullYear();
for (const thisrequest in time_ids_array) {
  var timeAndIds=time_ids_array[thisrequest]
  const hour=parseInt( timeAndIds.time*1/60);
  
  const min=parseInt(timeAndIds.time*1%60);
  const departure = new Date(year, month, day, hour, min);

 var outputobjectforid={}

 //set the time to empty string to be set later

var time=`${departure}`;

//get time for request strings
outputobjectforid["time"]=time

//array of all ids and request strings
var strings=[]
var ids=[]

 for (const m in timeAndIds.ids) {

   var id= timeAndIds.ids[m]

   for (const k in odpairs) {
     
     
     if (odpairs[k].trip_id==timeAndIds.ids[m]) {
       
    var string= genRequestString(odpairs[k],google_api_key,"driving","best-guess",timeAndIds,string)
    strings.push(string)
    ids.push(id)
    
     }
   }
   
 }
 outputobjectforid["strings"]=strings
 outputobjectforid["ids"]=ids
 request_data24hr.push(outputobjectforid)
 
}
return request_data24hr;
}




exports.readRequestFile=async function readFiles(parse_tripTimes,sort_ttseries,createDayRequests) {
  var TempRequestFileData="";
  let readJsonTempRequestFile = streamfs.createReadStream("./output/request_data24hrTemp.json",{ encoding: 'utf8' });
  const writeTempRequests = new Stream.Writable();
  //write streams for request file
   writeTempRequests._write = (chunk, {}, next) => {
    // console.log(chunk.toString());
    TempRequestFileData += chunk;
     next();
     };
  
     readJsonTempRequestFile.pipe(writeTempRequests);

   //Try reading the temp file to create main request data for the day 
readJsonTempRequestFile.on('end', function() {
  var getdata=JSON.parse(TempRequestFileData);
  console.log("----------------------------------------------------")
  console.log("Updating the requests data file @ app.js ,line 283 ")
  console.log("---------------------------------------------------")
 
  for (const obj in getdata) {
      let recentDate=new Date(getdata[obj].time);
      let newDate=new Date();
      let nextday = newDate.getUTCDate();
      let month = newDate.getUTCMonth() ; //months from 1-12
      let year =newDate.getUTCFullYear();
      let hour=recentDate.getUTCHours();

      let minutes=recentDate.getUTCMinutes();
      
      let nextDate=new Date(year,month,nextday,hour,minutes);
      let timeinSeconds=nextDate.getTime()/1000;
      let newStrings=[];
      
      getdata[obj].strings.forEach(element => {
        newStrings.push(element.replace("today",`${timeinSeconds}`))
      });
       
      getdata[obj].time=`${nextDate}`
      getdata[obj].strings=newStrings    
  }
      //remove and recreate request data file
        fs.rm("./output/request_data24hr.json")
      .then(()=>{
        fs.writeFile("./output/request_data24hr.json",JSON.stringify(getdata,null,2))
        .then((data) => {
          console.log("---------------------------------------------")
          console.log("file  succesfully updated @ app.js ,line 308")
          console.log("Day's requests file updated")
         console.log("----------------------------------------------")

            requestsNdOutput.makeReqWriteOutput()

        }).catch((error) =>
        {
          console.log("This error was thrown during request data file creation @ app.js 335")
          console.log(error)
        
        }
        
        )
      }).catch((eror)=>{
        console.log("This error was thrown during template request data file deletion @ app.js 344")

        console.log(eror)});
      //######

})
//#####
//If this file in question doesnt exist 

readJsonTempRequestFile.on('error', function(err) { 
  console.log(err); 
 console.log("----------------------------------------------")
 console.log("24hr request file not ready for  reading @ app.js, line 278 ")
 console.log("Creating it now...")
 console.log("----------------------------------------------")


   parse_tripTimes();
   sort_ttseries();
  //* Replace departure_time *//

  let request_data24hr= createDayRequests()
  for (const obj in request_data24hr) {
    let recentDate=new Date(request_data24hr[obj].time);
    let newDate=new Date();
    let nextday = newDate.getUTCDate();
    let month = newDate.getUTCMonth() ; //months from 1-12
    let year =newDate.getUTCFullYear();
    let hour=recentDate.getUTCHours();
    let minutes=recentDate.getUTCMinutes();

    const nextDate=new Date(year,month,nextday,hour,minutes);

    let timeinSeconds=nextDate.getTime()/1000;
    var newStrings=[];
    request_data24hr[obj].strings.forEach(element => {
      newStrings.push(element.replace("today",`${timeinSeconds}`))
    });
     request_data24hr[obj].time=`${nextDate.toUTCString()}`

     request_data24hr[obj].strings=newStrings    
}
  
  //* Template request variable *//
  let request_data24hrTemp= createDayRequests()
  console.log("----------------------------------------------")
  console.log("----------------------------------------------")

  console.log("Creating 24hr requests  file @ app.js,line 356")
  console.log("----------------------------------------------")

  fs.writeFile("./output/request_data24hr.json",JSON.stringify(request_data24hr,null,2))

  .then((data) => {
    console.log("Request file for 24 hour period succesfully created @ app.js, line 357")
    console.log("----------------------------------------------")
    console.log("----------------------------------------------")



  })
.catch((error) =>
{
  console.log("This error was thrown during request data file creation @ app.js 400")

  console.log(error)}
)

//**** */
fs.writeFile("./output/request_data24hrTemp.json",JSON.stringify(request_data24hrTemp,null,2))
.then((data) => {
  console.log("----------------------------------------------")
  console.log("----------------------------------------------")
  console.log("----------------------------------------------")

  console.log("Temporary/template requests data file succesfully created @ app.js, line 368")
  console.log("------------READY TO MAKE REQUESTS-------------")
  requestsNdOutput.makeReqWriteOutput()


}).catch((error) =>
console.log("Couldnt create temporrary/template requests data file @ app.js , line 368")
)

}

  );
}































