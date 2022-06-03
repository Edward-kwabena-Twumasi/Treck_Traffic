const myxlsx=require("xlsx");

const fs = require('fs/promises')
const requestsNdOutput=require('./cron')

var input_work_book;
try {
 input_work_book= myxlsx.readFile("./output/input_data.xlsx",{})
} catch (error) {
  //console.log("File doesnt exist")
  input_work_book= myxlsx.readFile("./input_data.xlsx",{})
  //console.log(input_work_book)

}


var mysheets=input_work_book.SheetNames;


var trip_times=input_work_book.Sheets[mysheets[3]];
var od_pairs=input_work_book.Sheets[mysheets[1]];
//var calender=input_work_book.Sheets[mysheets[2]];
var err=input_work_book.Sheets[mysheets[5]];
console.log(err)
var trip_times=myxlsx.utils.sheet_to_json(trip_times);
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
    var start=startime;
    var stop=stoptime;
    var step=timestep;
    //push request times for all ids into giant array
    reqtimes.push((start.split(".")[0]*60 +start.split(".")[1]*1))
    //push request times for a single id into one array
    timesforid.push((start.split(".")[0]*60 +start.split(".")[1]*1))
    //push unique request times
    req_times24hr.push((start.split(".")[0]*60 +start.split(".")[1]*1))
    
   var difference=-(start.split(".")[0]*60 +start.split(".")[1]*1)+(stop.split(".")[0]*60+stop.split(".")[1]*1)
   var periods=difference/step
   for (let i = 1; i <= periods; i++) {
    reqtimes.push((  start.split(".")[0]*60 +  start.split(".")[1]*1)+i*timestep)

    timesforid.push((start.split(".")[0]*60 +  start.split(".")[1]*1)+i*timestep)

    req_times24hr.push((   start.split(".")[0]*60  +  start.split(".")[1]*1)+i*timestep)
   
   }
    }


//trip times is a work sheet from our excel workbook containing
//fields for start time,end time,time step and trip ids
//we will try to read,preprocess and convert the data into a usable
//and more understandable format

//4
exports.parse_tripTimes= function parse_tripTimes() {
  console.log("-------------------------------------------------------")
  console.log("parsing trip times for preprocessing @ app.js ,line 70")
  console.log("-------------------------------------------------------")
//console.log("creating request times from parsed trip times")
trip_times.map(function(row) {

timesfroneid=[]

starttimes=[]

stoptimes=[]

steps=[]

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
  //Push all request times for a particular id and the id as object into totalreqtimes array
  //this will be stored and used later
  totalreqtimes.push({"id":ids+"",reqtimes:timesfroneid})
  trip_time_series.push({})

});
}

//5
// parse_tripTimes();
//###############################################################

//get a unique set of 
exports.get_runTime=function get_runTime(params) {
  console.log("------------------------------------------------------------------")
  console.log("Getting run time from trip times after parsing @ app.js ,line 116")
  console.log("------------------------------------------------------------------")
 
  req_times24hr = [...new Set(req_times24hr)]
  req_times24hr.sort(function(a, b) {
      return a - b;
    });
  console.log("start..."+req_times24hr[0]/60+"...............end ....."+req_times24hr[req_times24hr.length-1]/60)
  var startTime=req_times24hr[0]/60
  var endTime=req_times24hr[req_times24hr.length-1]/60
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
console.log("start..."+req_times24hr[0]/60+"| end ..."+req_times24hr[req_times24hr.length-1]/60)
var startTime=req_times24hr[0]/60
var endTime=req_times24hr[req_times24hr.length-1]/60



//generate generate trip_time_series
for (let ob = 0; ob < totalreqtimes.length; ob++) {
  trip_time_series[ob]["id"]= totalreqtimes[ob]["id"]
 

  for (let t = 0; t < req_times24hr.length; t++) {
  if (totalreqtimes[ob]["reqtimes"].includes(req_times24hr[t])) {
    trip_time_series[ob][ req_times24hr[t]]=1
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

  const hour=parseInt( obj1.time*1/60);
  const min=obj1.time*1%60;
    const departure = new Date(year, month, day, hour, min, 00, 00);
    const timemil=departure.getTime()
    var destinations=`${obj.origin_latitude}%2c${obj.origin_longitude}`;
    var origins=`${obj.destination_latitude}%2c${obj.destination_longitude}`;
    var baseUrl="https://maps.googleapis.com/maps/api/distancematrix/json";
     //var thisRequestTemp=`${baseUrl}?destinations=${destinations}&origins=${origins}&mode=${mode}&traffic_mode=${traffic_mode}&departure_time=${timemil}&key=${key}`;
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
//console.log("Time and ids "+time_ids_array )
for (const thisrequest in time_ids_array) {
  var timeAndIds=time_ids_array[thisrequest]
  const hour=parseInt( timeAndIds.time*1/60);
  
  const min=parseInt(timeAndIds.time*1%60);
  const departure = new Date(year, month, day, hour, min, 00, 00);

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
       
    var string= genRequestString(odpairs[k],"AIzaSyCyCr5WebY0cl5VyeBiBxfZ7dOJr9mHnIg","driving","best-guess",timeAndIds,string)
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


//console.log(fullyProcessedData)

exports.readRequestFile=async function readFiles(parse_tripTimes,sort_ttseries,createDayRequests) {
 //Try reading the temp file to create main request data for the day 
fs.readFile("./output/request_data24hrTemp.json")
.then((data) => {
  var getdata=JSON.parse(data);
  console.log("----------------------------------------------------")
  console.log("Updating the requests data file @ app.js ,line 283 ")
  console.log("---------------------------------------------------")
 
  for (const obj in getdata) {
      var recentDate=new Date(getdata[obj].time);
      var newDate=new Date();
      var nextday = newDate.getUTCDate()+1;
      var month = newDate.getUTCMonth() ; //months from 1-12
      var year =newDate.getUTCFullYear();
      var hour=recentDate.getUTCHours();

      var minutes=recentDate.getUTCMinutes();
      
      const nextDate=new Date(year,month,nextday,hour,minutes);
      var timeeMilliseconds=nextDate.getTime();
      var newStrings=[];
      //newStrings=getdata[obj].strings;
      getdata[obj].strings.forEach(element => {
        newStrings.push(element.replace("today",`${timeeMilliseconds}`))
      });
       //console.log(newStrings)
       
      getdata[obj].time=`${nextDate}`
      getdata[obj].strings=newStrings    
  }
      //remove and recreate request data file
        fs.rm("./output/request_data24hr.json")
      .then(()=>{
        fs.writeFile("./output/request_data24hr.json",JSON.stringify(getdata,null,2))
        .then((data) => {
          console.log("----------------------------------------------")
          console.log("file  succesfully updated @ app.js ,line 308")
          console.log("Day's requests file updated")
         console.log("----------------------------------------------")

            requestsNdOutput.makeReqWriteOutput()

        }).catch((error) =>
        console.log(error))
      }).catch((eror)=>console.log(eror));
      //######

})
//#####
//If this file in question doesnt exist 
.catch((error) =>
{
 console.log("----------------------------------------------")
 console.log("File not ready for reading @ app.js, line 278")
 console.log("Creating it...")
console.log("----------------------------------------------")

    //
   parse_tripTimes();
   sort_ttseries();
  //* Replace departure_time *//
  request_data24hr= createDayRequests()
  for (const obj in request_data24hr) {
    var recentDate=new Date(request_data24hr[obj].time);
    var newDate=new Date();
    var nextday = newDate.getUTCDate();
    var month = newDate.getUTCMonth() ; //months from 1-12
    var year =newDate.getUTCFullYear();
    var hour=recentDate.getUTCHours();
    var minutes=recentDate.getUTCMinutes();

    const nextDate=new Date(year,month,nextday,hour,minutes);

    var timeeMilliseconds=nextDate.getTime();
    var newStrings=[];
    //newStrings=getdata[obj].strings;
    request_data24hr[obj].strings.forEach(element => {
      newStrings.push(element.replace("today",`${timeeMilliseconds}`))
    });
     //console.log(newStrings)
     request_data24hr[obj].time=`${nextDate.toUTCString()}`

     request_data24hr[obj].strings=newStrings    
}
  
  //* Template file *//
  request_data24hrTemp= createDayRequests()
  console.log("Creating 24hr requests  file @ app.js,line 356")
  fs.writeFile("./output/request_data24hr.json",JSON.stringify(request_data24hr,null,2))
.then((data) => {
  console.log("File succesfully created @ app.js, line 357")
  requestsNdOutput.makeReqWriteOutput()
}).catch((error) =>
console.log(error)
)

//**** */
fs.writeFile("./output/request_data24hrTemp.json",JSON.stringify(request_data24hrTemp,null,2))
.then((data) => {
  console.log("Temporary/template requests data file succesfully created @ app.js, line 368")
}).catch((error) =>
console.log("Couldnt create temporrary/template requests data file @ app.js , line 368")
)

}

  );}































