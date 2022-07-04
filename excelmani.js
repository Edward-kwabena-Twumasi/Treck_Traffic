const myxlsx=require("xlsx");
var workbook=myxlsx.readFile("./output/input_data.xlsx",{});
var mysheets=workbook.SheetNames;

var sheet2=workbook.Sheets[mysheets[3]]

if(!sheet2 || !sheet2["!ref"]) 
     console.log('sheet error');
else{
    range = myxlsx.utils.decode_range(sheet2["!ref"]);
     console.log(range)
     console.log(range.e.r) 
    
    }   
