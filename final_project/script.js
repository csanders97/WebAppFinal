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
        .when('/location', {
            templateUrl: 'views/location.html',
            controller: 'locationController'
        });
});

app.controller('mainController', function($scope) {
    // $scope.nav = {
    //     navbar: [
    //         {link: '/weather', name: 'Weather'},
    //         {link: '/activity', name: 'Activity'},
    //         {link: '/location', name: 'Location'}
    //     ]
    // }   
    $scope.message = "Welcome to *Insert name here*";
});

// app.service('weatherService', function() {

// });

app.controller('weatherController', function($scope, $http) {
    $scope.message = "Weather";
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
            var weatherData = response.data
            $scope.min = weatherData.list[dayIndex].temp.min;
            $scope.max = weatherData.list[dayIndex].temp.max;
            $scope.cond = weatherData.list[dayIndex].weather[0].main;
            if (response.data.list[dayIndex].weather[0].main.toLowerCase().includes("clear")) {
                $scope.image = "images/sunny.png";
            }
            else if (response.data.list[dayIndex].weather[0].main.toLowerCase().includes("rain")) {
                $scope.image = "images/rainy.png";
            }
            else if (response.data.list[dayIndex].weather[0].main.toLowerCase().includes("cloud")) {
                $scope.image = "images/cloudy.png";
            }
            else if (response.data.list[dayIndex].weather[0].main.toLowerCase().includes("snow")) {
                $scope.image = "images/snowy.png";
            }
        });
        document.getElementsByClassName('goActivity')[0].style.visibility = 'visible';
    }
});

app.controller('activityController', function($scope, $http) {
    $scope.message = "Activity";
    $http.get('activities.json')
    .then(function(response) {
        var activityData = response.data.activity[0];
        $scope.allData = activityData.all;
        $scope.sunData = activityData.sun;
    });
    $scope.selectedActivity = function(activity) {
        console.log(activity.name);
    };
});

app.controller('locationController', function($scope, $http) {
    $scope.message = "Location";
    $http.get('https://maps.googleapis.com/maps/api/places/nearbysearch/json?radius=500&type=food&key=AIzaSyAngLB6WyJIJndCznurj-Jd6Zmy9c-T5NE')
    .then(function(response) {

    });
});