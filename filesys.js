//Handles filesystem actions related to creating and recreating output folder and its contents

exports.createOutputDir=function createDir(fs,path,dirName,workBook,myxlsx,prepareRequests) {
  var copyFile = (file, dir)=>{
    
    var f = path.basename(file);
    var source = fs.createReadStream(file);
    var dest = fs.createWriteStream(path.resolve(dir, f));
  
    source.pipe(dest);
    source.on('end', function() { console.log(`${file} coppied from backup folder`); });
    source.on('error', function(err) { 
      
      console.log(`${file} not yet available`); });

  };


 fs.mkdir(dirName,  (err,path) => {
  
    if (err && err.code=='EEXIST')
    {
      
        console.log("Making new ouput directory... @ filesys.js, line 19")
        fs.rm(dirName, { recursive: true },  () => {
          console.log("Output folder deleted")
          fs.mkdir(dirName,  () => {
        
            console.log("Output Folder recreated succesfullly @ filesys.js ,line 14")
            
            myxlsx.writeFile(workBook,"./output/input_data.xlsx")
            copyFile("./archivehistorybackup/output.json","./output")
            console.log("input file created @ filesys, line 18")
    prepareRequests()
      });

      });
        
         
    }
    
    else
      {
      
      myxlsx.writeFile(workBook,"./output/input_data.xlsx")

      }

  });}
