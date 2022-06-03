console.log("----------------------------------------------")
 console.log("Program execution has began")
 console.log("----------------------------------------------")
const schedule = require('node-schedule');
const express=require('express');
const path=require('path')
const server=express();
const port=process.env.PORT|| 5000;
const myxlsx=require("xlsx");
const dirName="output"
const fs =require("fs")
const archiveOutput =require("./archive")
const OutputFolder=require('./filesys')
const mainApp=require('./app')
const createZip=require('./zipper')
const backup=require('./backuptofolder')
var initJob;
var cancelinitjob=false;
var wb=myxlsx.readFile("input_data.xlsx",{});
var mysheets=wb.SheetNames;
var currentHours; 
var currentMinutes;
var archives=[]

var ws=wb.Sheets[mysheets[2]];
var calender=myxlsx.utils.sheet_to_json(ws);
//assign start date to start variable
const start=calender[0].start_date.split(".");
//assign stop date to stop variable
const stop=calender[0].stop_date.split("/");

//get day,month and year from start date and 
//construct datetime called startTime
var day=start[0]*1,month=start[1]*1,year=start[2]*1;
const startTime = new Date(Date.UTC(year,month-1,day));
console.log(`${startTime}`);
//get day,month and year from stop date and 
//construct dateTime from it
var sday=stop[0]*1,smonth=stop[1]*1,syear=stop[2]*1;
const endTime = new Date(Date.UTC(syear,smonth-1,sday));
console.log(endTime.toUTCString());


//const rule = new schedule.RecurrenceRule();

// OutputFolder.createOutputDir(fs,dirName,wb,myxlsx,()=>{})
// function checkValidDay(day) {
//   return calender[0][day]
// }

//make a backup of zipped archvive files

backup.backupFiles()
//Function to prepare and make requests ready 
function prepareRequests() {
  mainApp.parse_tripTimes
mainApp.sort_ttseries
mainApp.createDayRequests
//mainApp.genRequestString
  mainApp.readRequestFile(mainApp.parse_tripTimes,mainApp.sort_ttseries,mainApp.createDayRequests)

}

//Funtion to calculate start and end runtimes
function cal_runtime(start,end) {
  var run_time=0
  
      if (end-start==24) {
          console.log("There should be at least an hour for program to prepare @ app_calender ,line 51")
      } else {   
      
      var remaining=start+24-end;
  
      var avg=remaining/2
  
     
  if ( (start-avg)>0) {
      run_time=start-avg
  } else {
      run_time=end+avg
  }
  
   
      console.log("Idle hours "+ remaining)
      console.log(".......")
      console.log("Average idle time "+ avg)
      console.log(".......")
     
  }
      return run_time;
  }
//Functions from app.js to run before calc_runtime
// can execute successfully
mainApp.parse_tripTimes()
mainApp.get_runTime()
var runTime= cal_runtime(mainApp.startTime,mainApp.endTime)

//Check the run times against current time and do scheduling bases 
//on outcome
if(runTime>mainApp.endTime){
  console.log("Pre run at "+ runTime+" hours.Create request inputs for the next day.")
}
else if (runTime<mainApp.startTime){
   currentHours=new Date().getUTCHours(); 
   currentMinutes=new Date().getUTCMinutes();
  if(currentHours>runTime && currentHours< mainApp.endTime){
    console.log(currentHours+"......")
    console.log("Current time is past start time.So shedule requests anyway @ app_calender, line 90")
   
    console.log(currentHours)
    console.log(currentMinutes)
    console.log(new Date().toUTCString())
     initJob=schedule.scheduleJob({ start: startTime, end: endTime, hour:(currentHours),minute:(currentMinutes+1)

    }, function(){
      const departure = new Date();

      if (checkValidDay(days[departure.getDay()])) {
        console.log(`On ${days[departure.getDay()]} we will run the application`)
      console.log('Scheduling done.Waiting for execution');
      console.log(`${departure}`);
      console.log(' Today is');
      console.log(days[departure.getDay()]);
    
    OutputFolder.createOutputDir(fs,path,dirName,wb,myxlsx,prepareRequests)
     
    cancelinitjob=true;
    //check valid days for execution
    console.log("----------------------------------")
    console.log("Checking valid days for execution")

    
    } else {
      console.log(`On ${days[departure.getDay()]}  the application rests according to calender !`)

    }
    console.log("----------------------------------")
     
    
    });
  }
  console.log("Pre run time is at "+ runTime+" hours on each valid day")
}

//shdeule archiving of output file to after the last request

schedule.scheduleJob('30 7 * * *',function(){
  console.log(new Date().toUTCString())
  console.log("Cron job executed now")
  console.log(new Date().toUTCString())
  archiveOutput.archive("./output.json","./archives","./output/output_data.xlsx","./archives")
})


//Declare the days of the week in an array
var days=["sunday","monday","tuesday","wednesday","thursday","friday","saturday"]

function checkValidDay(day) {
  return calender[0][day]
}

const job = schedule.scheduleJob({ start: startTime, end: endTime, hour:runTime,minute:0

}, function(){

  console.log('Scheduling done.Waiting for execution');
  const departure = new Date();
  console.log(`${departure}`);
  console.log(' Today is');
  console.log(days[departure.getDay()]);

OutputFolder.createOutputDir(fs,path,dirName,wb,myxlsx,prepareRequests)
  console.log(process.env.run_time)

if (cancelinitjob) {
  initJob.cancel();
}

  for (const day in days) {
    if (checkValidDay(days[day])) {
      console.log(`On ${days[day]} we will run the application`)
    } else {
      console.log(`On ${days[day]}  the application will rest`)
    }
  }

});

//During process termination

process.on('SIGTERM',shutdown('SIGTERM'))
.on('SIGINT',shutdown('SIGINT'))

function shutdown(signal) {
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

//Occasional console loggin to tell server is alive

setInterval(() => {
  console.log("Server is alive")
}, 50000);

//Set the pug view engine using express

server.set("views", path.join(__dirname, "views"));
server.set("view engine", "pug");
//render home page on navigation to root
server.get('/',(req,res)=>{
  // fs.readdir("./archives",(err, files) => {
  //   console.log(files);
  // archives=files
  
  // })
  console.log("Home route loaded or refreshed")
  res.render("index", { title: "Home" });

})
//download json backup file
server.get('/backup',(req,res)=>{
    res.download("./output/output.json",(err) =>
    { 
  if (err) {
    res.send({
      msg:"Output backup file not available for download"
    })
  }
     });


})

//download output,excel file
server.get('/output',(req,res)=>{
  res.download("./output/output_data.xlsx",(err) =>
  { 
if (err) {
  res.send({
    msg:"Output file not available for download"
  })
}
   });


})

//The archives path for downloads

server.get('/archives',(req,res)=>{

  createZip.createZip(downloadFile(res))
  
})

//Function to downaload file after zipping it
function downloadFile(res) {
  console.log("Download zip file")
  const getMostRecentFile = (dir) => {
    const files = orderReccentFiles(dir);
    return files.length ? files[0] : undefined;
  };
  
  const orderReccentFiles = (dir) => {
    return fs.readdirSync(dir)
      .filter((file) => fs.lstatSync(path.join(dir, file)).isFile())
      .map((file) => ({ file, mtime: fs.lstatSync(path.join(dir, file)).mtime }))
      .sort((a, b) => b.mtime.getTime() - a.mtime.getTime());
  };
zipfile="./archivehistory/"+getMostRecentFile("./archivehistory").file
  res.download(zipfile,(err) =>
  { 
if (err) {
  res.send({
    error:err,
    msg:"problem downloading file-"
  })
}
   });
}
//Set static files for express serve them
server.use(express.static(path.join(__dirname, "public")));
server.use(express.static(path.join(__dirname, "output")));
server.use(express.static(path.join(__dirname, "archives")));

//Let server listen on the specified port
server.listen(port,()=>{
  console.log("server listening on "+port +`at ${(new Date().toUTCString())}`)
})