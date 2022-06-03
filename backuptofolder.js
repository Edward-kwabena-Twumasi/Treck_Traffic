
 var fs = require('fs');
 var path = require('path');
//copy the $file to $dir2

exports.backupFiles= function backupFiles(params) {

var copyFile = (file, dir2)=>{
    //include the fs, path modules
   
  try {
  
    //gets file name and adds it to dir2
    var f = path.basename(file);
    var source = fs.createReadStream(file);
    var dest = fs.createWriteStream(path.resolve(dir2, f));
  
    source.pipe(dest);
    source.on('end', function() { console.log(`${file} coppied to backup folder`); });
    source.on('error', function(err) { 
      
      console.log(`${file} not yet available`); });
  } catch (error) {
    //console.log(err)
  }

  };
  
  //copy files from archivehistory folder into backup folder
  fs.readdir("./archivehistory",(err,files)=>{
      if (err) {
        console.log("Problem reading folder")  
      } else {
        console.log("----------------------------------------------")
        console.log("Creating a backup of  archivehistory")
        console.log("----------------------------------------------")
          files.forEach(file=>{
             var filename="./archivehistory/"+file;
              copyFile(filename, './archivehistorybackup');
          })
         
          copyFile("./output/output.json", './archivehistorybackup');
          copyFile("./output/output_data.xlsx", './archivehistorybackup');


          console.log(`Done copying ${files.length} files to backup folder`)
      }
  })
  //copy files from archivehistory folder into backup folder
  // try {
  //   fs.readFile("./output/output.json").then((data)=>{
  //     copyFile("./output/output.json", './archivehistorybackup');

  //   })
  // } catch (error) {
  //   console.log("No backup file yet")
  // }
}