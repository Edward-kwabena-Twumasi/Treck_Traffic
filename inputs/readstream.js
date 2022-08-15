const fs=require("fs")
const Stream = require('stream');
const path=require("path")
var chunks="";
  
const mybuff=Buffer.alloc(200)

//exports.readFileStream= 
let readFile=(file)=>{
  try {
    
    let data=[]
    let newdata=[]
   
    let f = path.basename(file);

    let source = fs.createReadStream(f);
    //source.push(JSON.stringify(chunk))

    const source1 = new Stream.Readable({
      read() {},
    });

    const dest = new Stream.Writable();

        dest._write = (chunk, encoding, next) => {
       // console.log(chunk.toString());
         data.push(chunk);
         chunks+=chunk;
        
        // source1.push(chunk);
        next();
        };

        

      const dest1=fs.createWriteStream("./newstream.json")  
  
    source.pipe(dest1)
    source.pipe(dest);
    

    source.on('end', function() { 
      chunks=JSON.parse(chunks.toString());  
           //data=JSON.parse(data.toString());
        console.log(chunks[chunks.length-1]);
        console.log(data.length);

    });
    

    source.on('error', function(err) {    
      throw err; 
    
    });
    dest1.on('error', function(err) {    
      throw err; 
    
    });
    // console.log("My buffer"); 
    // console.log(mybuff.toString()); 

  } catch (error) {
    console.log("Error here")
    console.log(error)
  }
    

  };


  readFile("./request_data24hr.json")