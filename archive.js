//Archive file has funtions created to handle file archiving
//Based on a defined creiteria
'use strict'
const fs=require("fs")
const path=require('path')
const myxlsx=require("xlsx");

exports.archiver= 
function archive(filename,foldername,filename1,foldername1) { 
fs.stat(filename1, (err, stats) => {
  //if there is an error

  if (err) {
    console.log("No output file to archive")
  }
//if there was no error

  else
   {
  var workbook=myxlsx.readFile(filename1,{});
 var mysheets=workbook.SheetNames;

var sheet2=workbook.Sheets[mysheets[0]]
if(!sheet2 || !sheet2["!ref"]) 
     console.log('sheet error');
else{
    range = myxlsx.utils.decode_range(sheet2["!ref"]);
    }  
  var newdata=[]
  if (stats.size/1024>5120 || range.e.r>500000) {

    //read json output file
    fs.readFile(filename, (err, data) => {
      if (err) {
        console.log("Json output file not available")
      };
     
      newdata=JSON.parse(data)
    
    const archHeader="archive";
fs.readdir(foldername, (err, files) => {
  
var fileName=archHeader+(files.length/2).toString()
if (files.includes(fileName)) {
  fileName=archHeader+(files.length+1).toString()
}

const filePath=path.join(foldername, fileName)
const filePath1=path.join(foldername1, fileName+".xlsx")
  console.log(fileName);
  console.log(filePath);
  console.log(filePath1);

  fs.writeFile(filePath,JSON.stringify(JSON.parse(data)), (err) => {
    if (err) throw err;
    console.log('Current output has been archives on '+(new Date().toUTCString()));
  });
  //Excel archive file

  var new_book=myxlsx.utils.book_new();
  var output_sheet=myxlsx.utils.json_to_sheet(JSON.parse(data),{}); 
  myxlsx.utils.book_append_sheet(new_book,output_sheet,fileName)
  myxlsx.writeFile(new_book,filePath1,{})

})
})

  }
  else{
    console.log("File less than 5mb or rows less than 500000")
    console.log(range)
    console.log(range.e.r) 
  }
}

});

}

