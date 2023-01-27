//Program main entry point
//Takes functions exported from various modules or files
//and combines them logically to enable program run smoothly
'use strict'

const schedule = require('node-schedule');
const express=require('express');
const path=require('path');
const server=express();
const port=process.env.PORT || 5000;
const myxlsx=require("xlsx");
const dirName="output";
const fs =require("fs");
const archiveOutput =require("./archive");
const manageFiles=require('./filesys');
const preProcess=require('./preprocessInput');
const createZip=require('./zipper');
const backup=require('./backuptofolder');
var initJob;
var cancelinitjob=false;
var inputFile;

try {
   inputFile = myxlsx.readFile("input_data.xlsx",{});

 let inputFileSheets = inputFile.SheetNames;

 if (inputFileSheets.length<4) {
  console.log("Expected to find 4 sheets('optional_inputs', 'od_pairs', 'calendar', 'trip_times')")
  console.log(inputFileSheets.length +" sheets were found")
  return;

} 
   if (!inputFileSheets.includes("optional_inputs") && !inputFileSheets.includes("od_pairs") && !inputFileSheets.includes("calender") && !inputFileSheets.includes("trip_times")) {
    console.log("Expected to find 4 sheets('optional_inputs', 'od_pairs', 'calendar', 'trip_times')")
    return;
  }

//inputFileSheets : [ 'optional_inputs', 'od_pairs', 'calendar', 'trip_times' ]

let calenderSheet = inputFile.Sheets[inputFileSheets[2]];

let calenderJson=myxlsx.utils.sheet_to_json(calenderSheet);

let currentHours; 
let currentMinutes;

//Start date eg: 01.01.2023
const calenderStartDate = calenderJson[0].start_date.split(".");

//assign stop date to stop variable
const calenderStopDate = calenderJson[0].stop_date.split(".");


let startDay = calenderStartDate[0]*1,
startMonth = calenderStartDate[1]*1, 
startYear = calenderStartDate[2]*1;

const programStartDate = new Date(Date.UTC(startYear,startMonth-1,startDay));
console.log(`Program start date : ${programStartDate}`);


let stopDay = calenderStopDate[0]*1,
stopMonth = calenderStopDate[1]*1,
stopYear = calenderStopDate[2]*1;

const programStopDate = new Date(Date.UTC(stopYear,stopMonth-1,stopDay));

const compEndTime=new Date(Date.UTC(stopYear,stopMonth-1,stopDay+1));

console.log("Calender stop date : "+ programStopDate.toUTCString());

//Make backup of files
backup.backupFiles()

//Function to prepare and make requests ready 
function prepareRequests() {

  preProcess.readRequestFile(preProcess.parse_tripTimes,preProcess.sort_ttseries,preProcess.createDayRequests)

}

//Funtion to calculate start and end runtimes
function cal_runtime(startHour,endHour) {
  let run_time=0
      if (endHour-startHour==24) {
       console.log("There should be at least an hour for program to prepare @ app_calender ,line 51")
      } 
      else {      
      let remaining=startHour+24-endHour;
  
      let averageHour=remaining/2
  
     
    if ( (startHour-averageHour)>0) {
      run_time=startHour-averageHour
      } 
    else 
    {
      run_time=endHour+averageHour
     }
  
   
      console.log("Idle hours per day"+ remaining)
      console.log(".......")
      console.log("Average idle time per day"+ averageHour)
      console.log(".......")
     
  }
      return run_time;
  }

//Calculate run time 

preProcess.parse_tripTimes()
preProcess.get_runTime()

let runTime= cal_runtime(preProcess.startTime, preProcess.endTime)

//Declare the days of the week in an array
let days=["sunday","monday","tuesday","wednesday","thursday","friday","saturday"]

function checkValidDay(day) {
  return calenderJson[0][day]
}

//shdeule archiving of output file to after the last request

schedule.scheduleJob('00 '+preProcess.endTime+' * * *',function(){

  console.log("Creating archives at ");
  console.log(new Date().toUTCString());

  archiveOutput.archiver("./output/output.json","./archives","./output/output_data.xlsx","./archives");

})


//Check the run times against current time and do scheduling based
//on outcome
if( runTime > preProcess.endTime){
  console.log("Pre run at " + runTime + " hours.Create request inputs for the next day.")
}

else if (runTime<preProcess.programStartDate){

   currentHours=new Date().getUTCHours(); 
   currentMinutes=new Date().getUTCMinutes();

   //correct code// if(currentHours>runTime && currentHours< preProcess.endTime){
  if(currentHours>runTime && currentHours< preProcess.endTime){

    console.log(currentHours+"......")
    console.log("Sheduling requests now @ app_calender, line 90")

//First job .Will be executed immediately if program starts during hours inbetween start and end hours
    initJob=schedule.scheduleJob({ start: programStartDate, end: programStopDate, hour:(currentHours),minute:(currentMinutes+1)

    }, function(){

    const currentDateTime = new Date();

    if (checkValidDay(days[currentDateTime.getDay()]) && currentDateTime >= programStartDate && currentDateTime < compEndTime) {

      console.log(`On ${days[currentDateTime.getDay()]} requests can be made per calender`)
      console.log(' Today is');
      console.log(days[currentDateTime.getDay()]);
      
      manageFiles.createOutputDir(fs,path,dirName,inputFile,myxlsx,prepareRequests)
      
      cancelinitjob=true;
      console.log("----------------------------------");
    
    }

    else {
      console.log(`Cannot make requests on this date.Start date: ${programStartDate} | end date ${endTime}`)

    }
    console.log("----------------------------------");
      
    });
  }

  console.log("Pre run time is at "+ runTime+" hours on each  day");

} 



//Second job.Will start executing during 

const job = schedule.scheduleJob({ start: programStartDate, end: programStopDate, hour:runTime,minute:0

}, function(){
   if (cancelinitjob) {
      initJob.cancel();
      console.log("Cancelling temporary job")
    }
      const currentDateTime = new Date();

      if (checkValidDay(days[currentDateTime.getDay()]) && currentDateTime>=programStartDate && currentDateTime<=compEndTime) {

      console.log(`On ${days[currentDateTime.getDay()]} requests can be made per caldender`)
      console.log(' Today is');
      console.log(days[currentDateTime.getDay()]);
    
      manageFiles.createOutputDir(fs,path,dirName,inputFile,myxlsx,prepareRequests)
      
      console.log("----------------------------------")
    
    } else {
      console.log(`Cant make requests on this date`)

    }
    console.log("----------------------------------")


});


//During process termination

process.on('SIGTERM',shutdown('SIGTERM'))
.on('SIGINT',shutdown('SIGINT'))

function shutdown(signal) {
  //backup.backupFiles()

  return (err)=>{
    console.log(`${signal}...`);
    console.log("Shutting dounn at "+ (new Date().toUTCString()));
    if (err) {
      console.error(err.stack ||err);
      console.log("Shutting down at "+  (new Date().toUTCString()));
    }
    setTimeout(() => {
      console.log("...waited 5s ,exiting");
      process.exit(err?1:0)
    }, 5000).unref();
  }
  
}



//Set the pug view engine using express
const dynamicData={"title":"Treck traffic"}
server.set("views", path.join(__dirname, "views"));
server.set("view engine", "pug");

//render home page on navigation to root
server.get('/',(req,res)=>{
  
  console.log("Home route loaded or refreshed")
  res.render("index", dynamicData);

})

//download json backup file
server.get('/backup',(req,res)=>{
  dynamicData.message="Get backup"
    res.download("./output/output.json",(err) =>
    { 
  if (err) {
    res.send("<h1>Output backup file not available for download</h1>"
    )
  }
     });


})

//download output,excel file
server.get('/output',(req,res)=>{
  res.download("./output/output_data.xlsx",(err) =>
  { 
if (err) {
  res.send("<h1>Output file not available for download</h1>"
  )
}
   });


})

//The archives path for downloads

server.get('/archives',(req,res)=>{

  createZip.createZip(()=> downloadFile(res))
  
})

//Function to downaload file after zipping it
function downloadFile(res) {
console.log("Heloo");
  //get most recent file
  const getMostRecentFile = (dir) => {
    const files = orderReccentFiles(dir);
   // console.log(files);
    return files.length ? files[0] : undefined;
  };

  //order recent files in folder
  const orderReccentFiles = (dir) => {
    return fs.readdirSync(dir)
      .filter((file) => fs.lstatSync(path.join(dir, file)).isFile())
      .map((file) => ({ file, mtime: fs.lstatSync(path.join(dir, file)).mtime }))
      .sort((a, b) => b.mtime.getTime() - a.mtime.getTime());
  };

  if(
    getMostRecentFile("./archivehistory")==undefined)
{
   res.render("404page", { title: "Not found" })
console.log("No files archived yet");
}
else
 {
  let recent=getMostRecentFile("./archivehistory");
  console.log(recent);
  var zipfile="./archivehistory/"+recent.file;
  console.log(zipfile +" is the file")
  res.download(zipfile,(err) =>
  { 
if (err) {
  console.log(err +"...error" )
 console.log("Error occured")
 

}
   });
  }
}


//Set static files for express serve them
server.use(express.static(path.join(__dirname, "public")));
server.use(express.static(path.join(__dirname, "archivehistory")));
server.use(express.static(path.join(__dirname, "output")));
server.use(express.static(path.join(__dirname, "archives")));

//Let server listen on the specified port
server.listen(port,"0.0.0.0",()=>{
  console.log("server listening on "+port +` at ${(new Date().toUTCString())}`);
})

} catch (error) {
  console.log(error);
  console.log("Please provide the correct input file. Expected to find input_data.xlsx")
  console.log("Or some sheets may not contain the right format")

}