var map;
var activityType;
var app = angular.module('activityHunt', ['ngRoute']);
app.config(function($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'views/home.html',
            controller: 'mainController'
        })

        .when('/weather', {
            templateUrl: 'views/weather.html',
            controller: 'weatherController'
        })

        .when('/activity', {
            templateUrl: 'views/activity.html',
            controller: 'activityController'
        })

        .when('/games', {
            templateUrl: 'views/games.html',
            controller: 'gamesController'
        })

        .when('/location', {
            templateUrl: 'views/location.html',
            controller: 'locationController'
        });
});

app.service('weatherCondition', function() {
    var condition;
    return {
        getCondition: function() {
            return condition;
        },
        setCondition: function(value) {
            condition = value;
        },
        setLatitude: function(value) {
            lat = value;
        },
        setLongitude: function(value) {
            long = value;
        }
    };
});

app.service('gettingLocation', function() {
    var lat;
    var long;
    var type;
    return {
        getLatitude: function() {
            return lat;
        },
        getLongitude: function() {
            return long;
        },
        getActivityType: function() {
            return type;
        },
        setLatitude: function(value) {
            lat = value;
        },
        setLongitude: function(value) {
            long = value;
        },
        setActivityType: function(value) {
            type = value;
        }
    }
});

app.service('choosenActivity', function() {
    var activity;
    return {
        getActivity: function() {
            return activity;
        },
        setActivity: function(value) {
            activity = value;
        }
    };
});

app.controller('mainController', function($scope) { 
    $scope.title = "Welcome to *Insert name here*";
});

app.controller('weatherController', function($scope, $http, weatherCondition, gettingLocation) {
    var lat;
    var long;
    $scope.title = "Weather";
    $scope.days = ["Today", "Tomorrow", "Third Day", "Fourth Day", "Fifth Day"];
    var months = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];
    $scope.getData = function() {
        var date = new Date();
        var day = $scope.selectedDay;
        var dayIndex;
        $scope.selectedDay;
        if (day === "Today") {
            dayIndex = 0;
            var currDay = date.getDate();
            $scope.selectedDay = months[date.getMonth()] + " " + currDay + ", " + date.getFullYear();
        }
        else if (day === "Tomorrow") {
            dayIndex = 1;
            var currDay = date.getDate() + 1;
            $scope.selectedDay = months[date.getMonth()] + " " + currDay + ", " + date.getFullYear();
        }
        else if (day === "Third Day") {
            dayIndex = 2;
            var currDay = date.getDate() + 2;
            $scope.selectedDay = months[date.getMonth()] + " " + currDay + ", " + date.getFullYear();
        }
        else if (day === "Fourth Day") {
            dayIndex = 3;
            var currDay = date.getDate() + 3;
            $scope.selectedDay = months[date.getMonth()] + " " + currDay + ", " + date.getFullYear();
        }
        else if (day === "Fifth Day") {
            dayIndex = 4;
            var currDay = date.getDate() + 4;
            $scope.selectedDay = months[date.getMonth()] + " " + currDay + ", " + date.getFullYear();
        }
        else {
            dayIndex = 0;
            var currDay = date.getDate();
            $scope.selectedDay = months[date.getMonth()] + " " + currDay + ", " + date.getFullYear();
        }
        
        const API_KEY = "d9fdddf4ac40863d10700c8f1791325c";
        const URL_FIRST = "http://api.openweathermap.org/data/2.5/forecast/daily?q=";
        const URL_SECOND = ",us&units=imperial&cnt=5&appid=";
        const FULL_PATH = URL_FIRST + "" + $scope.city + "" + URL_SECOND + "" + API_KEY;
        $http.get(FULL_PATH)
        .then(function(response) {
            var weatherData = response.data;
            $scope.description;
            $scope.min = weatherData.list[dayIndex].temp.min;
            $scope.max = weatherData.list[dayIndex].temp.max;
            $scope.cond = weatherData.list[dayIndex].weather[0].main;
            lat = weatherData.city.coord.lat;
            long = weatherData.city.coord.lon;
            if (response.data.list[dayIndex].weather[0].main.toLowerCase().includes("clear")) {
                $scope.image = "images/sunny.png";
                $scope.description = "Clear clear like a mirror!";
            }
            else if (response.data.list[dayIndex].weather[0].main.toLowerCase().includes("rain")) {
                $scope.image = "images/rainy.png";
                $scope.description = "Rain rain go away!";
            }
            else if (response.data.list[dayIndex].weather[0].main.toLowerCase().includes("cloud")) {
                $scope.image = "images/cloudy.png";
                $scope.description = "Cloud cloud makes me pout!";
            }
            else if (response.data.list[dayIndex].weather[0].main.toLowerCase().includes("snow")) {
                $scope.image = "images/snowy.png";
                $scope.description = "Snow snow say oh!";
            }
        });
        document.getElementsByClassName('goActivity')[0].style.visibility = 'visible';
        $scope.getCondition = function(condition) {
            weatherCondition.setCondition(condition);
            gettingLocation.setLatitude(lat);
            gettingLocation.setLongitude(long);
            window.location.href = "#!activity";
        };
    }
});

app.controller('activityController', function($scope, $http, weatherCondition, choosenActivity) {
    $scope.title = "Activity";
    var weather = weatherCondition.getCondition();
    $http.get('activities.json')
    .then(function(response) {
        var activityData = response.data.activity[0];
        $scope.allData = activityData.all;
        if (weather.toLowerCase().includes("rain")) {
            $scope.weatherData = activityData.rain;
        }
        else if (weather.toLowerCase().includes("cloud")) {
            $scope.weatherData = activityData.cloud;
        }
        else if (weather.toLowerCase().includes("clear")) {
            $scope.weatherData = activityData.sun;
        }
        else if (weather.toLowerCase().includes("snow")) {
            $scope.weatherData = activityData.snow;
        }
    });
    $scope.selectedActivity = function(activity) {
        choosenActivity.setActivity(activity);
        window.location.href = "#!games";
    };
});

app.controller('gamesController', function($scope, $http, choosenActivity, gettingLocation) {
    $scope.title = "Games";
    var activity = choosenActivity.getActivity();
    $scope.activityName = activity.name;
    gettingLocation.setActivityType(activity.type);
    $scope.activityGame = activity.miniGames;
});

app.controller('locationController', function($scope, weatherCondition, gettingLocation) {
    $scope.title = "Location";
    var lat = gettingLocation.getLatitude();
    var long = gettingLocation.getLongitude();
    var type = gettingLocation.getActivityType();
    var pyrmont = {lat: lat, lng: long};
    
    var map = new google.maps.Map(document.getElementById('map'), {
        center: pyrmont,
        zoom: 17
    });
    
    var service = new google.maps.places.PlacesService(map);
    service.nearbySearch({
        location: pyrmont,
        radius: 500,
        type: [type]
    }, processResults);
    
    
    function processResults(results, status, pagination) {
      if (status !== google.maps.places.PlacesServiceStatus.OK) {
        return;
      } else {
        createMarkers(results);
    
        if (pagination.hasNextPage) {
          var moreButton = document.getElementById('more');
    
          moreButton.disabled = false;
    
          moreButton.addEventListener('click', function() {
            moreButton.disabled = true;
            pagination.nextPage();
          });
        }
      }
    }
    
    function createMarkers(places) {
      var bounds = new google.maps.LatLngBounds();
      var placesList = document.getElementById('places');
    
      for (var i = 0, place; place = places[i]; i++) {
        var image = {
          url: place.icon,
          size: new google.maps.Size(71, 71),
          origin: new google.maps.Point(0, 0),
          anchor: new google.maps.Point(17, 34),
          scaledSize: new google.maps.Size(25, 25)
        };
    
        var marker = new google.maps.Marker({
          map: map,
          icon: image,
          title: place.name,
          position: place.geometry.location
        });
    
        placesList.innerHTML += '<li id="placeName">' + place.name + '</li>';
    
        bounds.extend(place.geometry.location);
      }
      map.fitBounds(bounds);
    }
});