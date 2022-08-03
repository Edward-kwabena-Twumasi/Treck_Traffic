
'use strict'
const JSZip = require("jszip");
const fs=require("fs")
const zip = new JSZip();

exports.createZip=
async function zipFolder(downloadZip) {
    
 fs.readdir("./archives",(err,files)=>{

 //if error reading directory
 if(err){
 //create this directory

 console.log("Creating new archives folder")

 fs.mkdir("./archives",(err,path)=>{
 if(err){
 console.log("Error creating folder")
 
 }
 else
   console.log(path +"folder created")
 
 })
 
 }
//folder read
 else
 {
  files.length<1? console.log("No archives found in arcives folder"): files.forEach(file =>{

  
 fs.readFile("./archives/"+file, (err, data) => {
        if (err) throw err;
        zip.folder("archives").file(file,data)
     
 if (file==files[files.length-1]) {

    fs.readdir("./archivehistory",(err,files)=>{
      let  zip_filename="./archivehistory/"+"zip"+files.length+".zip";

       
    
 
zip
.generateNodeStream ({type:'nodebuffer',streamFiles:true})
.pipe(fs.createWriteStream(zip_filename))
.on('finish', function () {
    
    // JSZip generates a readable stream with a "end" event,
    // but is piped here in a writable stream which emits a "finish" event.
    console.log("zip file created.");
    downloadZip()
   
    
});

}) 
}  
})
})
 }
//forearch ends here
})

}

//zipFolder(()=>{console.log("Done zipping")})