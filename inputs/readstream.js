const fs=require("fs")
const Stream = require('stream');
const path=require("path")
var chunk=
  [{
    "trip_id": "153",
    "destinations": "PF89+JJ4, Ejisu, Ghana",
    "origins": "MCRG+2V7, Kumasi, Ghana",
    "departure_date": "Wed, 27 Jul 2022 22:00:00 GMT",
    "distance_km": "8.5 km",
    "duration_trafic_m": "15 mins"
  }]
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
        
        // source1.push(chunk);
        next();
        };

        

      const dest1=fs.createWriteStream("./newstream.json")  
  
    source.pipe(dest1)
    source.pipe(dest);
    source.on('data', function(chunk) { 
      console.log("new data in")
      //console.log(chunk.toString()); 
      newdata.push(chunk);
      mybuff.write(chunk.toString())
  });

    source.on('end', function() { 
           
        console.log(JSON.parse(data.toString())[0]); 
    });
    

    source.on('error', function(err) {    
      throw err; 
    
    });
    dest1.on('error', function(err) {    
      throw err; 
    
    });
    console.log("My buffer"); 
    console.log(mybuff.toString()); 

  } catch (error) {
    console.log("Error here")
    console.log(error)
  }
    

  };


  readFile("./stream.json")