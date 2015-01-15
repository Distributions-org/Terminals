(function () {
    'use strict';

    var serviceId = 'datacontext';
    angular.module('app').factory(serviceId, ['$http', '$window', 'common', datacontext]);

    function datacontext($http, $window, common) {
        var $q = common.$q;

        var service = {
            getPeople: getPeople,
            getMessageCount: getMessageCount,
            getUserNameAndRole: getUserNameAndRole,
            isAuthenticated: isAuthenticated,
            logout: logout,
            getAntiForgeryToken: getAntiForgeryToken
        };

        return service;

        function getMessageCount() { return $q.when(72); }

        function getPeople() {
            var people = [
                { firstName: 'John', lastName: 'Papa', age: 25, location: 'Florida' },
                { firstName: 'Ward', lastName: 'Bell', age: 31, location: 'California' },
                { firstName: 'Colleen', lastName: 'Jones', age: 21, location: 'New York' },
                { firstName: 'Madelyn', lastName: 'Green', age: 18, location: 'North Dakota' },
                { firstName: 'Ella', lastName: 'Jobs', age: 18, location: 'South Dakota' },
                { firstName: 'Landon', lastName: 'Gates', age: 11, location: 'South Carolina' },
                { firstName: 'Haley', lastName: 'Guthrie', age: 35, location: 'Wyoming' }
            ];
            return $q.when(people);
        }

        function getUserNameAndRole() {
           return  $http.get("/SignIn").then(function (response) {
                return response;
            });
        }

        function isAuthenticated() {
            return $http.get("/Account/IsAuthenticated").then(function (response) {
                return response;
            });
        }
        
        function logout() {
            return $http.post("/Account/LogOff", {}).success(function(data, status, headers, config) {
                window.location = '/';
                })
                .error(function(data, status, headers, config) {
                return status;
            });

        }

        function getAntiForgeryToken() {
            return $http.get("/Account/GetAntiForgeryToken").then(function (response) {
                return response;
            });
        }
    }
})();