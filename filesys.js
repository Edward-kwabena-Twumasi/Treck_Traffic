//Handles filesystem actions related to creating and recreating output folder and its contents
'use strict'
//const Stream = require('stream');


exports.createOutputDir=function createDir(fs,path,dirName,workBook,myxlsx,prepareRequests) {
  //copy file to destination function
  let copyFile = (file, dir)=>{
    
    let f = path.basename(file);
    let source = fs.createReadStream(file);
    let dest = fs.createWriteStream(path.resolve(dir, f));
  
    source.pipe(dest);
    source.on('end', function() {
       console.log(`${file} coppied from backup folder`);
       });
    source.on('error', function(err) { 
      
      console.log(`${file} not yet available`); 
    
    
    });

  };

  
 fs.mkdir(dirName,  (err,path) => {
  
    if (err && err.code=='EEXIST')
    {
     
        copyFile("./output/output.json","./archivehistorybackup")

      
        console.log("Making new ouput directory... @ filesys.js, line 19")
        console.log("Output Folder recreated succesfullly @ filesys.js ,line 14")
            
        myxlsx.writeFile(workBook,"./output/input_data.xlsx")

        // fs.readFile("./archivehistorybackup/output.json",(err, data)=>{
        //   if (err) {
        //    console.log("No starter output file backup found yet")
        //    fs.writeFile("./output/output.json",JSON.stringify([]),()=>{

        //    })
        //   }
        //   else{
        //     copyFile("./archivehistorybackup/output.json","./output")
   
        //   }
        //  })
        

        console.log("input file created @ filesys, line 18")

        setTimeout(() => {
          prepareRequests()
        }, 5000);

      //   fs.rm(dirName, { recursive: true },  () => {
      //     console.log("Output folder deleted")
      //     fs.mkdir(dirName,  () => {
        
      //       console.log("Output Folder recreated succesfullly @ filesys.js ,line 14")
            
      //       myxlsx.writeFile(workBook,"./output/input_data.xlsx")

      //       fs.readFile("./archivehistorybackup/output.json",(err, data)=>{
      //         if (err) {
      //          console.log("No starter output file backup found yet")
      //          fs.writeFile("./output/output.json",JSON.stringify([]),()=>{

      //          })
      //         }
      //         else{
      //           copyFile("./archivehistorybackup/output.json","./output")
       
      //         }
      //        })
            

      //       console.log("input file created @ filesys, line 18")

      //       setTimeout(() => {
      //         prepareRequests()
      //       }, 3000);
   
      // });

      // });
        
         
    }
    
    else
      {
      
      myxlsx.writeFile(workBook,"./output/input_data.xlsx")
      fs.writeFile("./output/output.json",JSON.stringify([],null,2))
      setTimeout(() => {
        prepareRequests()
      }, 5000);

      }

  });}
