
####To run this program on local machine
1.First ensure node js is installed on your pc
2.Navigate to folder root.
3.Ensure all packages exist by running npm install from terminal pointing to project root
4.Do npm install
5. Run npm start and and navigate to localhost:5000 on your local computer
6. Please check for the following line in the package.json file and update the node version that was installed appropriately
"engines": {
    "node": "16.14.2"
  }

###About this application
This is a node js application for automating google traffic data extraction .

Input in the form of an excel file with sheets containing query parameters to the api,
origin destination pairs, a calender and a 24 hour request timeline sheet containing times and ids.

At onstart, the calender sheet is read and handed to a cron schedule to determine validity of the day 
of execution. 
Program proceeds to schedule a date interval if calender allows, then timeline sheet is read and parsed into ids and request times.
Next, cordinates sheet is read and combined with the time and ids to create a 24 hour request file detailing all times in a day,
and all requests to be made in that day .

This preprocessed format is handed to a sheduler that does a one time scheduling for each 24 hours within the calender period.
For each new day, the request file is updated to use the particular days timestaps in the requests.


Developer contact:createdliving1000@gmail.com