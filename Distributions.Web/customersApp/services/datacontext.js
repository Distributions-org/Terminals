(function () {
    'use strict';

    var serviceId = 'datacontext';
    var customer = null;
    angular.module('customerApp').factory(serviceId, ['$http', '$window', 'common', datacontext]);

    function datacontext($http, $window, common) {
        var $q = common.$q;
        
        var service = {
            getPeople: getPeople,
            getMessageCount: getMessageCount,
            getCustomer: getCustomer,
            isAuthenticated: isAuthenticated,
            logout: logout,
           
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

        function getCustomer() {
            if(customer==null){
                return $http.get("/Customer/GetCustomer").then(function (response) {
                customer = response.data;
             }).then(function() {
                 return customer;
             });
            } else {
                return customer;
            }
        }

        function isAuthenticated() {
            return $http.get("/CustomerAccount/IsAuthenticated").then(function (response) {
                return response;
            });
        }
        
        function logout() {
            return $http.post("/CustomerAccount/LogOff", {}).success(function (data, status, headers, config) {
                window.location = '/customer';
                })
                .error(function(data, status, headers, config) {
                return status;
            });

        }

      
    }
}
)();