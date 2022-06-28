const JSZip = require("jszip");
const fs=require("fs")
const zip = new JSZip();

exports.createZip= function zipFolder( downloadZip) {
    
 fs.readdir("./archives",(err,files)=>{
 //if error reading folder
 if(err){
 //creae this directory
 console.log("archives folder missing.Create new one")

 fs.mkdir("./archives",(err,path)=>{
 if(err){
 console.log("Couldnt create archives folder")
 
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
        console.log(data);
     
 if (file==files[files.length-1]) {

    fs.readdir("./archivehistory",(err,files)=>{
        filename="./archivehistory/"+"zip"+files.length+".zip";

        console.log(files)
    
 
zip
.generateNodeStream ({type:'nodebuffer',streamFiles:true})
.pipe(fs.createWriteStream(filename))
.on('finish', function () {
    // JSZip generates a readable stream with a "end" event,
    // but is piped here in a writable stream which emits a "finish" event.
    console.log("zip file created.");
   
    

});
setTimeout(() => {
    downloadZip
}, 10000);
}) 
}  
})
})
 }
//forearch ends here
})
}