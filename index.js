'use strict';

//Global Variable to how response outputs
let activityStorage= {
  activities : [
    {
    isDaytime: "both",  
    activity:"Sailing",
    temperature:0,
    probabilityOfPrecipitation:100,
    windSpeed:13,
    image:"img/sailing.jpg"
    }
    ,
    {
    isDaytime: true,
    activity:"Hiking",
    temperature:0,
    probabilityOfPrecipitation:100,
    windSpeed:100,
    image:"img/hiking.jpg"
    }
    ,
    {
    isDaytime: true,
    activity:"Fishing",
    temperature:0,
    probabilityOfPrecipitation:60,
    windSpeed:10,
    image:"img/fishing.jpg"
    }
    ,
    {
    isDaytime: true,
    activity:"Drone Flying",
    temperature:100,
    probabilityOfPrecipitation:10,
    windSpeed:10,
    image:"img/drone.jpg"
    }
    ,
    {
    isDaytime: false,
    activity:"Star Gazing",
    temperature:32,
    probabilityOfPrecipitation:75,
    windSpeed:100,
    image:"img/stars.jpg"
    }
    ,
    {
    isDaytime: true,
    activity:"Baseball",
    temperature:45,
    probabilityOfPrecipitation:30,
    windSpeed:100,
    image:"img/baseball.jpg"
    }
    ,
    {
    isDaytime: true,
    activity:"Rock Climbing",
    temperature:40,
    probabilityOfPrecipitation:75,
    windSpeed:100,
    image:"img/rock.jpg"
    }
    ,
    {
    isDaytime: "both",
    activity:"Cycling",
    temperature:50,
    probabilityOfPrecipitation:80,
    windSpeed:5,
    image:"img/bike.jpg"
    }
    ,
    {
    isDaytime: true,   
    activity:"Motorcycling",
    temperature:60,
    probabilityOfPrecipitation:60,
    windSpeed:10,
    image:"img/moto.jpg"
    }
    ,
    {
    isDaytime: true, 
    activity:"Skateboarding",
    temperature:40,
    probabilityOfPrecipitation:30,
    windSpeed:5,
    image:"img/skate.jpg"
    }
    ,
    {
    isDaytime: "both",
    activity:"Jogging",
    temperature:20,
    probabilityOfPrecipitation:80,
    windSpeed:10,
    image:"img/run.jpg"
    }
    ,
    {
    isDaytime: "both",
    activity:"Basketball",
    temperature:40,
    probabilityOfPrecipitation:60,
    windSpeed:30,
    image:"img/bball.jpg"
    }
    ,
    {
    isDaytime: true, 
    activity:"Golf",
    temperature:50,
    probabilityOfPrecipitation:20,
    windSpeed:30,
    image:"img/golf.jpg"
    }
    ,
    {
    isDaytime: true,
    activity:"American Football",
    temperature:10,
    probabilityOfPrecipitation:80,
    windSpeed:10,
    image:"img/fball.jpg"
    }
    ,
    {
    isDaytime: "both",
    activity:"Tennis",
    temperature:55,
    probabilityOfPrecipitation:20,
    windSpeed:30,
    image:"img/tennis.jpg"
    }
    ,
    {
    isDaytime: true,
    activity:"Soccer",
    temperature:55,
    probabilityOfPrecipitation:20,
    windSpeed:10,
    image:"img/soccer.jpg"
    }
    ]
    , 
  ableActivities: []
    ,
  windRain: []
  ,
  locationGlobal: "place"
  

  }


let doableActivities=[];
let locationGlobal;
let forecastOverview;

//Test against weather properties
function canIDoIt(tempNum,windNum,timeOfDay,precipNum){
  
  
  
  activityStorage.ableActivities = [];
    
  activityStorage.ableActivities.length = 0;
  for(let i = 0 ; i < activityStorage.activities.length; i++)
  {
    if(tempNum >= activityStorage.activities[i].temperature && precipNum <= activityStorage.activities[i].probabilityOfPrecipitation && 
      windNum <= activityStorage.activities[i].windSpeed && timeOfDay == activityStorage.activities[i].isDaytime)
    {
      activityStorage.ableActivities.push(activityStorage.activities[i]);
      
    }
    if(tempNum >= activityStorage.activities[i].temperature && precipNum <= activityStorage.activities[i].probabilityOfPrecipitation && 
      windNum <= activityStorage.activities[i].windSpeed && activityStorage.activities[i].isDaytime == "both")
    {
      activityStorage.ableActivities.push(activityStorage.activities[i]);
      
    }
  
  }
   

   populateActivityDetails(activityStorage.ableActivities);
}

//Updates Dom with confirmation of being able to do something
function compareWeather(responseJson) {
  
  $(responseJson).ready(function () 
  {  
    let temp = Math.round((responseJson.properties.periods[0].temperature * 1.8) + 32);
    let wind = responseJson.properties.periods[0].windSpeed;
    let convertedWind = wind.substring(0, wind.length-4);
    let timeOfDay = responseJson.properties.periods[0].isDaytime;
    
       
  
  canIDoIt(temp,convertedWind,timeOfDay,activityStorage.windRain[0]);
  })
}

// pushes probabilityOfPrecipitation to a separate array as its the only qualifer pulled from a different fetch
function precip(precip){
     activityStorage.windRain.push(precip);
     
}

//First initial fetch that pulls National Weather Service main response object holding both hourly forecast and other weather grid data

function getWeather(coords) {
  const url = `https://api.weather.gov/points/${coords}/`
  fetch(url)
      .then(response => 
        {
          if (response.ok) 
          {
           return response.json();
          }
          throw new Error(response.statusText);
        })
      .then(
        responseJson => getPrecipOdds(responseJson.properties.forecastGridData)
       )
      .catch(err => {
          displayError(err.message);
       });
  fetch(url)
      .then(response => 
        {
          if (response.ok) 
          {
           return response.json();
          }
          throw new Error(response.statusText);
        })
      .then(
        responseJson => getforecastOverview(responseJson.properties.forecastHourly)
       )
      .catch(err => {
          displayError(err.message);
       });        
       
} 

//Gets actual weather properties to examine
function getPrecipOdds(newUrl)  {
fetch(newUrl)
  .then(response => 
    {
      if (response.ok) 
        {
          return response.json();
        }
      throw new Error(response.statusText);
    })
  .then(responseJson => 
    precip(responseJson.properties.probabilityOfPrecipitation.values[0].value)
    )
  .catch(err => {
    displayError(err.message);
  });
}

//API call to National Weather Service for hourly forecast object and other weather grid data to compare

function getforecastOverview(newUrl2)  {       
fetch(newUrl2)
  .then(response => 
    {
      if (response.ok) 
        {
          return response.json();
        }
      throw new Error(response.statusText);
    })
  .then(responseJson => 
    compareWeather(responseJson)
    )
  .catch(err => {
    displayError(err.message);
  });
  fetch(newUrl2)
  .then(response => 
    {
      if (response.ok)
        {
          return response.json();
        }
      throw new Error(response.statusText);
    })
  .then(responseJson => 
    populateForecast(responseJson)
  )
  .catch(err => {
    displayError(err.message);
  });        
}

//Creates forecast HTML from the National Weather Service API for hourly forecast

function populateForecast(forecastResponse){

 
 
  $('#section3').html(`<br><div class='forecastImage'><img class='imageForecast' alt ='forecastThumbnail' src=${forecastResponse.properties.periods[0].icon}></div>
  <p class='forecastList'><span class='forcastListTitle'> Forecast for current hour</span>
  <br>Temperature: ${forecastResponse.properties.periods[0].temperature}F°
  <br>Wind Speed: ${forecastResponse.properties.periods[0].windSpeed}
  <br>Wind Direction: ${forecastResponse.properties.periods[0].windDirection}
  <br>Looks like: ${forecastResponse.properties.periods[0].shortForecast}
 </p>`)
  
}

//Populates list for activities

function populateActivityDetails(array){
  $('#listStuff').empty("");


  for(let i = 0; i < array.length; i++){
  
  $('#listStuff').append(
  `
  <li class="doableActivity" tabindex="0">${array[i].activity}
  <img class='hidden' src=${array[i].image} alt= "image of ${array[i].activity}" >
  <div class="hidden duckDetails"><a href='https://duckduckgo.com/?t=ffab&q=${array[i].activity}+${activityStorage.locationGlobal}&ia=places' target="_blank" > ${array[i].activity.replace("_", " ")} in the area </div>
  </li>
  `
    )
 
  } 
}



//Creates card for individual activity chosen from list.

function handleItemCheckClicked() {
  $('#listStuff').on('click', e => {
    
    $(e.target).find('img').toggleClass('hidden');
    $(e.target).find('div').toggleClass('hidden');
    
  })
}

function hitEnterButton(){
  $('#listStuff').keypress(function (e) {
  var key = e.which;
  if(key == 13) 
    {
    $(e.target).find('img').toggleClass('hidden');
    $(e.target).find('div').toggleClass('hidden');
    }
  });  
}


//takes value from user query to convert to coords for weather API

function locationQuery() {
  $('#js-form').submit(function(event) {
     event.preventDefault();
     
    let query = $('.location-query').val();
    activityStorage.locationGlobal=query;
    $('.location-query').val('');
    

    queryBasedCoords(query);

  });
}

//BING API fetch call to serach location entered by user.
function queryBasedCoords(query) {
   
  const url = `https://dev.virtualearth.net/REST/v1/Locations/${query}?maxResults=1&key=AonXLGNhvKvknSiJ_NL7Mi9R0_I2uy-wUaFmSeR7AdvlMVZ1fe3rRiFDqNcL1spi`
 
  fetch(url)
  .then(function(response){return response.json();})
  .then(function(response) {
        coordsFormat(response.resourceSets[0].resources[0].point.coordinates);
    })
  .catch(function(error){alert("Did you enter anything? Or maybe a fiction place?  No results found!");});

}

//converts coordinate Array from Bing API into usable string for National Weather Service API

function coordsFormat(bingArray){
  let newstring= []
  let decimals1 = bingArray[0].toFixed(3);
  let decimals2 = bingArray[1].toFixed(3);
  newstring.push(decimals1,decimals2);
  getWeather(newstring);
  
}

//Error condition

function displayError(error) {
  console.log('displayError ran: '+ error);
}



//Calls everything not invoked within other functions
function allfunctions(){
  
  locationQuery();
  handleItemCheckClicked();
  hitEnterButton();
}
$(allfunctions);
