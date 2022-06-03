//const backup=require('./backuptofolder')

exports.createOutputDir=function createDir(fs,path,dirName,workBook,myxlsx,prepareRequests) {
  var copyFile = (file, dir2)=>{
    //include the fs, path modules
   
  
    var f = path.basename(file);
    var source = fs.createReadStream(file);
    var dest = fs.createWriteStream(path.resolve(dir2, f));
  
    source.pipe(dest);
    source.on('end', function() { console.log(`${file} coppied from backup folder`); });
    source.on('error', function(err) { 
      
      console.log(`${file} not yet available`); });

  };
 fs.mkdir(dirName,  (err,path) => {
  
    if (err && err.code=='EEXIST')
    {
      //backup.backupFiles()

        console.log("Output folder already exists");
        console.log("Deleting to recreate it... @ filesys.js, line 11, 14")
        fs.rmdir(dirName, { recursive: true },  () => {
          console.log("Output folder successfully delected")

          fs.mkdir(dirName,  () => {
        
            console.log("Output Folder recreated succesfullly @ filesys.js ,line 14")
            
            myxlsx.writeFile(workBook,"./output/input_data.xlsx")
            copyFile("./archivehistorybackup/output.json","./output")
            console.log("input file created @ filesys, line 18")
    prepareRequests()
      });

      });
        
         
    }
    
    else {console.log(path)
      

      myxlsx.writeFile(workBook,"./output/input_data.xlsx")

    }
    myxlsx.writeFile(workBook,"./output/input_data.xlsx")


  });}
