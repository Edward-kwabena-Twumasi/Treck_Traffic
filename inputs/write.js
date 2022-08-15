'use strict'
const myxlsx=require("xlsx");
let outputJson=[
    {
      "trip_id": "155",
      "destinations": "MCVV+VCP, Kumasi, Ghana",
      "origins": "MCRG+2V7, Kumasi, Ghana",
      "departure_date": "Wed, 27 Jul 2022 22:00:00 GMT",
      "distance_km": "2.9 km",
      "duration_trafic_m": "9 mins"
    },
    {
      "trip_id": "198",
      "destinations": "MCQF+9MH, Kumasi, Ghana",
      "origins": "Ayigya, MCQF+HMV, Kumasi, Ghana",
      "departure_date": "Wed, 27 Jul 2022 22:00:00 GMT",
      "distance_km": "54 m",
      "duration_trafic_m": "1 min"
    },
    {
      "trip_id": "110",
      "destinations": "Ayigya, MCWH+M5M, Kumasi, Ghana",
      "origins": "MCQJ+73J, Kumasi, Ghana",
      "departure_date": "Wed, 27 Jul 2022 22:00:00 GMT",
      "distance_km": "2.1 km",
      "duration_trafic_m": "6 mins"
    },
    {
      "trip_id": "179",
      "destinations": "N21 Otumfo Osei Tutu II Blvd, Kumasi, Ghana",
      "origins": "MCQH+MXJ, Kumasi, Ghana",
      "departure_date": "Wed, 27 Jul 2022 22:00:00 GMT",
      "distance_km": "0.5 km",
      "duration_trafic_m": "3 mins"
    },
    {
      "trip_id": "323",
      "destinations": "MCRG+2V7, Kumasi, Ghana",
      "origins": "MCRH+578, Kumasi, Ghana",
      "departure_date": "Wed, 27 Jul 2022 22:00:00 GMT",
      "distance_km": "0.2 km",
      "duration_trafic_m": "1 min"
    },
    {
      "trip_id": "141",
      "destinations": "KNUST-AYIGYA EFFIGUASE-ASOKORE KOKOFU, Kumasi, Ghana",
      "origins": "Unnamed Road, Kumasi, Ghana",
      "departure_date": "Wed, 27 Jul 2022 22:00:00 GMT",
      "distance_km": "10.7 km",
      "duration_trafic_m": "25 mins"
    },
    {
      "trip_id": "207",
      "destinations": "Ayigya, MCQF+HMV, Kumasi, Ghana",
      "origins": "MCRG+2V7, Kumasi, Ghana",
      "departure_date": "Wed, 27 Jul 2022 22:00:00 GMT",
      "distance_km": "1.0 km",
      "duration_trafic_m": "4 mins"
    },
    {
      "trip_id": "105",
      "destinations": "MCRG+2V7, Kumasi, Ghana",
      "origins": "MCRG+2V7, Kumasi, Ghana",
      "departure_date": "Wed, 27 Jul 2022 22:00:00 GMT",
      "distance_km": "1 m",
      "duration_trafic_m": "1 min"
    },
    {
      "trip_id": "153",
      "destinations": "PF89+JJ4, Ejisu, Ghana",
      "origins": "MCRG+2V7, Kumasi, Ghana",
      "departure_date": "Wed, 27 Jul 2022 22:00:00 GMT",
      "distance_km": "8.5 km",
      "duration_trafic_m": "15 mins"
    }
    ,
    {
      "trip_id": "105",
      "destinations": "MCRG+2V7, Kumasi, Ghana",
      "origins": "MCRG+2V7, Kumasi, Ghana",
      "departure_date": "Wed, 27 Jul 2022 22:00:00 GMT",
      "distance_km": "1 m",
      "duration_trafic_m": "1 min"
    },
    {
      "trip_id": "153",
      "destinations": "PF89+JJ4, Ejisu, Ghana",
      "origins": "MCRG+2V7, Kumasi, Ghana",
      "departure_date": "Wed, 27 Jul 2022 22:00:00 GMT",
      "distance_km": "8.5 km",
      "duration_trafic_m": "15 mins"
    },
    {
        "trip_id": "141",
        "destinations": "KNUST-AYIGYA EFFIGUASE-ASOKORE KOKOFU, Kumasi, Ghana",
        "origins": "Unnamed Road, Kumasi, Ghana",
        "departure_date": "Wed, 27 Jul 2022 22:00:00 GMT",
        "distance_km": "10.7 km",
        "duration_trafic_m": "25 mins"
      },
      {
        "trip_id": "207",
        "destinations": "Ayigya, MCQF+HMV, Kumasi, Ghana",
        "origins": "MCRG+2V7, Kumasi, Ghana",
        "departure_date": "Wed, 27 Jul 2022 22:00:00 GMT",
        "distance_km": "1.0 km",
        "duration_trafic_m": "4 mins"
      },
      {
        "trip_id": "105",
        "destinations": "MCRG+2V7, Kumasi, Ghana",
        "origins": "MCRG+2V7, Kumasi, Ghana",
        "departure_date": "Wed, 27 Jul 2022 22:00:00 GMT",
        "distance_km": "1 m",
        "duration_trafic_m": "1 min"
      },
      {
        "trip_id": "153",
        "destinations": "PF89+JJ4, Ejisu, Ghana",
        "origins": "MCRG+2V7, Kumasi, Ghana",
        "departure_date": "Wed, 27 Jul 2022 22:00:00 GMT",
        "distance_km": "8.5 km",
        "duration_trafic_m": "15 mins"
      }
      ,
      {
        "trip_id": "105",
        "destinations": "MCRG+2V7, Kumasi, Ghana",
        "origins": "MCRG+2V7, Kumasi, Ghana",
        "departure_date": "Wed, 27 Jul 2022 22:00:00 GMT",
        "distance_km": "1 m",
        "duration_trafic_m": "1 min"
      },
      {
        "trip_id": "153",
        "destinations": "PF89+JJ4, Ejisu, Ghana",
        "origins": "MCRG+2V7, Kumasi, Ghana",
        "departure_date": "Wed, 27 Jul 2022 22:00:00 GMT",
        "distance_km": "8.5 km",
        "duration_trafic_m": "15 mins"
      },
      {
        "trip_id": "141",
        "destinations": "KNUST-AYIGYA EFFIGUASE-ASOKORE KOKOFU, Kumasi, Ghana",
        "origins": "Unnamed Road, Kumasi, Ghana",
        "departure_date": "Wed, 27 Jul 2022 22:00:00 GMT",
        "distance_km": "10.7 km",
        "duration_trafic_m": "25 mins"
      },
      {
        "trip_id": "207",
        "destinations": "Ayigya, MCQF+HMV, Kumasi, Ghana",
        "origins": "MCRG+2V7, Kumasi, Ghana",
        "departure_date": "Wed, 27 Jul 2022 22:00:00 GMT",
        "distance_km": "1.0 km",
        "duration_trafic_m": "4 mins"
      },
      {
        "trip_id": "105",
        "destinations": "MCRG+2V7, Kumasi, Ghana",
        "origins": "MCRG+2V7, Kumasi, Ghana",
        "departure_date": "Wed, 27 Jul 2022 22:00:00 GMT",
        "distance_km": "1 m",
        "duration_trafic_m": "1 min"
      },
      {
        "trip_id": "153",
        "destinations": "PF89+JJ4, Ejisu, Ghana",
        "origins": "MCRG+2V7, Kumasi, Ghana",
        "departure_date": "Wed, 27 Jul 2022 22:00:00 GMT",
        "distance_km": "8.5 km",
        "duration_trafic_m": "15 mins"
      }
      ,
      {
        "trip_id": "105",
        "destinations": "MCRG+2V7, Kumasi, Ghana",
        "origins": "MCRG+2V7, Kumasi, Ghana",
        "departure_date": "Wed, 27 Jul 2022 22:00:00 GMT",
        "distance_km": "1 m",
        "duration_trafic_m": "1 min"
      },
      {
        "trip_id": "153",
        "destinations": "PF89+JJ4, Ejisu, Ghana",
        "origins": "MCRG+2V7, Kumasi, Ghana",
        "departure_date": "Wed, 27 Jul 2022 22:00:00 GMT",
        "distance_km": "8.5 km",
        "duration_trafic_m": "15 mins"
      },
      {
        "trip_id": "141",
        "destinations": "KNUST-AYIGYA EFFIGUASE-ASOKORE KOKOFU, Kumasi, Ghana",
        "origins": "Unnamed Road, Kumasi, Ghana",
        "departure_date": "Wed, 27 Jul 2022 22:00:00 GMT",
        "distance_km": "10.7 km",
        "duration_trafic_m": "25 mins"
      },
      {
        "trip_id": "207",
        "destinations": "Ayigya, MCQF+HMV, Kumasi, Ghana",
        "origins": "MCRG+2V7, Kumasi, Ghana",
        "departure_date": "Wed, 27 Jul 2022 22:00:00 GMT",
        "distance_km": "1.0 km",
        "duration_trafic_m": "4 mins"
      },
      {
        "trip_id": "105",
        "destinations": "MCRG+2V7, Kumasi, Ghana",
        "origins": "MCRG+2V7, Kumasi, Ghana",
        "departure_date": "Wed, 27 Jul 2022 22:00:00 GMT",
        "distance_km": "1 m",
        "duration_trafic_m": "1 min"
      },
      {
        "trip_id": "153",
        "destinations": "PF89+JJ4, Ejisu, Ghana",
        "origins": "MCRG+2V7, Kumasi, Ghana",
        "departure_date": "Wed, 27 Jul 2022 22:00:00 GMT",
        "distance_km": "8.5 km",
        "duration_trafic_m": "15 mins"
      }
      ,
      {
        "trip_id": "105",
        "destinations": "MCRG+2V7, Kumasi, Ghana",
        "origins": "MCRG+2V7, Kumasi, Ghana",
        "departure_date": "Wed, 27 Jul 2022 22:00:00 GMT",
        "distance_km": "1 m",
        "duration_trafic_m": "1 min"
      },
      {
        "trip_id": "153",
        "destinations": "PF89+JJ4, Ejisu, Ghana",
        "origins": "MCRG+2V7, Kumasi, Ghana",
        "departure_date": "Wed, 27 Jul 2022 22:00:00 GMT",
        "distance_km": "8.5 km",
        "duration_trafic_m": "15 mins"
      },{
        "trip_id": "141",
        "destinations": "KNUST-AYIGYA EFFIGUASE-ASOKORE KOKOFU, Kumasi, Ghana",
        "origins": "Unnamed Road, Kumasi, Ghana",
        "departure_date": "Wed, 27 Jul 2022 22:00:00 GMT",
        "distance_km": "10.7 km",
        "duration_trafic_m": "25 mins"
      },
      {
        "trip_id": "207",
        "destinations": "Ayigya, MCQF+HMV, Kumasi, Ghana",
        "origins": "MCRG+2V7, Kumasi, Ghana",
        "departure_date": "Wed, 27 Jul 2022 22:00:00 GMT",
        "distance_km": "1.0 km",
        "duration_trafic_m": "4 mins"
      },
      {
        "trip_id": "105",
        "destinations": "MCRG+2V7, Kumasi, Ghana",
        "origins": "MCRG+2V7, Kumasi, Ghana",
        "departure_date": "Wed, 27 Jul 2022 22:00:00 GMT",
        "distance_km": "1 m",
        "duration_trafic_m": "1 min"
      },
      {
        "trip_id": "153",
        "destinations": "PF89+JJ4, Ejisu, Ghana",
        "origins": "MCRG+2V7, Kumasi, Ghana",
        "departure_date": "Wed, 27 Jul 2022 22:00:00 GMT",
        "distance_km": "8.5 km",
        "duration_trafic_m": "15 mins"
      }
      ,
      {
        "trip_id": "105",
        "destinations": "MCRG+2V7, Kumasi, Ghana",
        "origins": "MCRG+2V7, Kumasi, Ghana",
        "departure_date": "Wed, 27 Jul 2022 22:00:00 GMT",
        "distance_km": "1 m",
        "duration_trafic_m": "1 min"
      },
      {
        "trip_id": "153",
        "destinations": "PF89+JJ4, Ejisu, Ghana",
        "origins": "MCRG+2V7, Kumasi, Ghana",
        "departure_date": "Wed, 27 Jul 2022 22:00:00 GMT",
        "distance_km": "8.5 km",
        "duration_trafic_m": "15 mins"
      },
      {
        "trip_id": "141",
        "destinations": "KNUST-AYIGYA EFFIGUASE-ASOKORE KOKOFU, Kumasi, Ghana",
        "origins": "Unnamed Road, Kumasi, Ghana",
        "departure_date": "Wed, 27 Jul 2022 22:00:00 GMT",
        "distance_km": "10.7 km",
        "duration_trafic_m": "25 mins"
      },
      {
        "trip_id": "207",
        "destinations": "Ayigya, MCQF+HMV, Kumasi, Ghana",
        "origins": "MCRG+2V7, Kumasi, Ghana",
        "departure_date": "Wed, 27 Jul 2022 22:00:00 GMT",
        "distance_km": "1.0 km",
        "duration_trafic_m": "4 mins"
      },
      {
        "trip_id": "105",
        "destinations": "MCRG+2V7, Kumasi, Ghana",
        "origins": "MCRG+2V7, Kumasi, Ghana",
        "departure_date": "Wed, 27 Jul 2022 22:00:00 GMT",
        "distance_km": "1 m",
        "duration_trafic_m": "1 min"
      },
      {
        "trip_id": "153",
        "destinations": "PF89+JJ4, Ejisu, Ghana",
        "origins": "MCRG+2V7, Kumasi, Ghana",
        "departure_date": "Wed, 27 Jul 2022 22:00:00 GMT",
        "distance_km": "8.5 km",
        "duration_trafic_m": "15 mins"
      }
      ,
      {
        "trip_id": "105",
        "destinations": "MCRG+2V7, Kumasi, Ghana",
        "origins": "MCRG+2V7, Kumasi, Ghana",
        "departure_date": "Wed, 27 Jul 2022 22:00:00 GMT",
        "distance_km": "1 m",
        "duration_trafic_m": "1 min"
      },
      {
        "trip_id": "153",
        "destinations": "PF89+JJ4, Ejisu, Ghana",
        "origins": "MCRG+2V7, Kumasi, Ghana",
        "departure_date": "Wed, 27 Jul 2022 22:00:00 GMT",
        "distance_km": "8.5 km",
        "duration_trafic_m": "15 mins"
      }
  ];

var output_sheet=myxlsx.utils.json_to_sheet(outputJson,{});
console.log("Creating the output file..............")
var new_book=myxlsx.utils.book_new();
myxlsx.utils.book_append_sheet(new_book,output_sheet,"request_output")
    try {  
    myxlsx.writeFile(new_book,"./output_data.xlsx",{})
    console.log("Output file added @ request.js line 88")

  } 
  catch (error) {
    console.log(error);
      console.log("Couldnt add output file @ request.js line 88")
  }