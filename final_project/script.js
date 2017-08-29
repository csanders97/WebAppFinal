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

app.service('weatherCondition', function() {
    var condition;
    return {
        getCondition: function() {
            return condition;
        },
        setCondition: function(value) {
            condition = value;
        }
    };
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
    // $scope.nav = {
    //     navbar: [
    //         {link: '/weather', name: 'Weather'},
    //         {link: '/activity', name: 'Activity'},
    //         {link: '/location', name: 'Location'}
    //     ]
    // }   
    $scope.message = "Welcome to *Insert name here*";
});

app.controller('weatherController', function($scope, $http, weatherCondition) {
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
        $scope.getCondition = function(condition) {
            console.log(condition);
            weatherCondition.setCondition(condition);
            window.location.href = "#!activity";
        };
    }
});

app.controller('activityController', function($scope, $http, weatherCondition, choosenActivity) {
    $scope.message = "Activity";
    var weather = weatherCondition.getCondition();
    console.log(weather);
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
        window.location.href = "#!location";
    };
});

app.controller('locationController', function($scope, choosenActivity) {
    $scope.message = "Location";
    var active = choosenActivity.getActivity();
    // $scope.activeName = active.name;
    // $scope.activeType = active.type;
    
    var map;

    function initMap() {
        var pyrmont = {lat: -33.866, lng: 151.196};

        map = new google.maps.Map(document.getElementById('map'), {
            center: pyrmont,
            zoom: 17
        });

        var service = new google.maps.places.PlacesService(map);
        service.nearbySearch({
            location: pyrmont,
            radius: 500,
            type: ['store']
        }, processResults);
    }

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

            placesList.innerHTML += '<li>' + place.name + '</li>';

            bounds.extend(place.geometry.location);
        }
        map.fitBounds(bounds);
    }
});