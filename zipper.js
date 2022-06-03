const JSZip = require("jszip");
const fs=require("fs")
const zip = new JSZip();

exports.createZip= function zipFolder( downloadZip) {
    
 fs.readdir("./archives",(err,files)=>{
    console.log(files)
    files.forEach(file =>{

  
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
})
}