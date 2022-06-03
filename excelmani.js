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
//   workbook.SheetNames.every(function(sheetName) {
//     sheet = workbook.Sheets[sheetName];
//     console.log(range)
//     if(!sheet || !sheet["!ref"]) 
//       return res.send('sheet error');
//     range = myxlsx.utils.decode_range(sheet["!ref"]);
    
//     var startRow = range.s.r;
//     var startCol = range.s.c;
//     var endCol = range.e.c;
//    // var counter = config.offset;

//     // if(maxrow + startRow > 1000000){
//     // 	console.log('empty sheet');
//     // 	return false;
//     // }
//     // else{
//     //     console.log("max row"+maxrow +"start row"+ startRow)
//     // }

//     var sheetRange = {
//     	startRow: startRow,
//     	startCol: startCol,
//     	endCol: endCol
//     }
// console.log(sheetRange)
// console.log(range)
//     // var keyJSON = xlsxParser.getHeader(sheetRange, config.offset, sheet);
//     // sheetRange.startRow = sheetRange.startRow + 1;
//     // insertingData(sheetRange, config.offset, keyJSON, sheet, counter, maxrow, function(){
//     //   return res.send('insertion completed');
//     // });
//     // return true;
//   });