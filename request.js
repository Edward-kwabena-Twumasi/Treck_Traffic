const axios = require('axios');
const fs = require('fs/promises');
const myxlsx=require("xlsx");

//var distmat="https://maps.googleapis.com/maps/api/distancematrix/json?destinations=6.686813%2c-1.573793&origins=6.703662%2c-1.528848&mode=driving&traffic_mode=best-guess&departure_time=1641960000000&key=AIzaSyCyCr5WebY0cl5VyeBiBxfZ7dOJr9mHnIg";

//currentdatase  is supplied as argument.It is the contents of output.json file

exports.getTrafficInfo= async function getTrafficInfo(requestString,currentDatabase,requestId,requestTime) {
  //set current database to empty string
  var currentDatabase=currentDatabase;
    try {

      //Try making a request to distance matrix api using axios
      const response = await axios.get(requestString);
      console.log(response.data)
      var distance_km , duration_traffic_m,destinations,origins;
      destinations=response.data.destination_addresses[0];
      origins=response.data.origin_addresses[0];

      //extract distance,duration and duration in traffic 
       for (const row in response.data.rows) {
      
       distance_km=response.data.rows[row]["elements"][0].distance;
       duration_traffic_m=response.data.rows[row]["elements"][0].duration_in_traffic;
        console.log( response.data.rows[row]["elements"][0].distance)
        console.log( response.data.rows[row]["elements"][0].duration)
        console.log( response.data.rows[row]["elements"][0].duration_in_traffic)
    } 
    

                currentDatabase.push({"trip_id":requestId,
                "destinations":destinations,
                "origins":origins,
                "departure_date":requestTime,"distance_km":distance_km.text,"duration_trafic_m":duration_traffic_m.text});
                
                //Write new output json file
                fs.writeFile("./output/output.json",JSON.stringify(currentDatabase,null,2))
                  .then((data) => {
                  
                  storeExcelDb(currentDatabase);

                  })
                  //catch error if wrire failed
                .catch((error) =>

                 {
                  console.log("Couldnt store output @ request.js")
                          
                });
          
          
    //Catch errors if requests couldnt be made 
    } catch (error) {
      if (error.response) {
        console.log(error.response.data)
        console.log(error.response.status)
      } else if (error.request) {
        console.log("Request error.......")
        console.log("Request for | "+requestString)
        console.log("Has failed @ request.js line 53")
      }
      else
      console.log("Error occured making request")
    }
  }

  // Store data in excel database
function storeExcelDb(outputJson) {
  var output_sheet=myxlsx.utils.json_to_sheet(outputJson,{});
  
  fs.readFile("./output/output_data.xlsx")
    .then((data)=>{
        var output_book= myxlsx.readFile("./output/output_data.xlsx");
        if (output_book.SheetNames.indexOf("request_output")>=0) {
          console.log("Update output database")
          output_book.Sheets["request_output"]=output_sheet;
            fs.rm("./output/output_data.xlsx")
            .then(()=>{
              myxlsx.writeFile(output_book,"./output/output_data.xlsx")
              
            })
            .catch((eror)=>console.log("Error writing to output excel file@request.js"));
        } 
        else {
        
          myxlsx.utils.book_append_sheet(output_book,output_sheet,"request_output")
        }
    })
  .catch((error)=>{
      console.log("Creating the output file..............")
      var new_book=myxlsx.utils.book_new();
      myxlsx.utils.book_append_sheet(new_book,output_sheet,"request_output")
          try {  
          myxlsx.writeFile(new_book,"./output/output_data.xlsx",{})
          console.log("Output file added @ request.js line 88")

        } 
        catch (error) {
            console.log("Couldnt add output file @ request.js line 88")
        }
 
  })

}