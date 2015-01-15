(function () {
    'use strict';

    var serviceId = 'adminService';
    angular.module('app').service(serviceId, ['common','$http', adminService]);

    function adminService(common, $http) {
        var $q = common.$q;

        var service = {
            getUsers: getUsers,
            getRoles: getRoles,
            addUser: addUser,
            getAllProducts: getAllProducts,
        };

        return service;

        function getUsers() {
           return  $http.get("/Admin").then(function (response) {
                return $q.when(response.data);
            });
        }

        function getRoles() {
            return $http.get("/GetRoles").then(function (response) {
                return response.data;
            });
        }

        function addUser(params) {
            return $http.post("/Register",params).success(function(data) {
                return data.d;
            })
            .error(function(data, status, headers, config) {
                return status;
            });
        }

        function getAllProducts() {
            return [{
                    "Name": "פיתות",
                    "Quantity": "10",
                    "Price": "25",
                    "WeekendPrice":"30"
                },
                 {
                    "Name": "פיתות קמח מלא",
                    "Quantity": "10",
                    "Price": "35",
                    "WeekendPrice":"40"
                },
                 {
                    "Name": "ג'בטה",
                    "Quantity": "10",
                    "Price": "45",
                    "WeekendPrice":"50"
                },
                 {
                    "Name": "ג'בטה קמח מלא",
                    "Quantity": "10",
                    "Price": "55",
                    "WeekendPrice":"60"
                }
            ];
        }
    }
})();
