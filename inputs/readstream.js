const fs=require("fs")
const Stream = require('stream');
const path=require("path")

let readFile = (file)=>{
    let data=[]
    let f = path.basename(file);
    let source = fs.createReadStream(f);

    const dest = new Stream.Writable();

        dest._write = (chunk, encoding, next) => {
       // console.log(chunk.toString());
        data.push(chunk);
        next();
        };
  
    source.pipe(dest);
    source.on('end', function() { 
        console.log(`${file} streaming`); 

        console.log(data.toString());
        console.log(`${file} coppied from backup folder`); 
    });
    source.on('error', function(err) { 
      
      console.log(err); 
    
    
    });

  };

  readFile("./stream.json")