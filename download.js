
const fs = require('fs');
const https = require('https');

// URL of the image
const url = './archivehistory/zip2.zip';

https.get(url,(res) => {
	// Image will be stored at this path
	
	const filePath = fs.createWriteStream(url);
	res.pipe(filePath);
	filePath.on('finish',() => {
		filePath.close();
		console.log('Download Completed');
	})
})
