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
            updateUser: updateUser,
            addProduct: addProduct,
            updateProduct: updateProduct
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

        function updateUser(params) {
            return $http.post("/UpdateUser", params).success(function (data) {
                return data.d;
            })
            .error(function (data, status, headers, config) {
                return status;
            });
        }

        function addProduct(params) {
            return $http.post("/AddProduct", params).success(function(data) {
                    return data.d;
                })
                .error(function(data, status, headers, config) {
                    return status;
                });
        }

        function updateProduct(params) {
            return $http.post("/UpdateProduct", params).success(function (data) {
                return data.d;
            })
          .error(function (data, status, headers, config) {
              return status;
          });
        }

        function getAllProducts() {
            return $http.get("/GetProducts").success(function (data) {
                return data;
            })
            .error(function (data, status, headers, config) {
                return status;
            });
            //return [{
            //    "ProductId":"1",
            //    "ProductName": "פיתות",
            //        "Quantity": "10",
            //        "Price": "25",
            //        "WeekendPrice": "30",
            //    "ProductStatus":1
            //    },
            //     {
            //         "ProductId": "2",
            //         "ProductName": "פיתות קמח מלא",
            //        "Quantity": "10",
            //        "Price": "35",
            //        "WeekendPrice": "40",
            //        "ProductStatus": 1
            //    },
            //     {
            //         "ProductId": "3",
            //         "ProductName": "ג'בטה",
            //        "Quantity": "10",
            //        "Price": "45",
            //        "WeekendPrice": "50",
            //        "ProductStatus": 2
            //    },
            //     {
            //         "ProductId": "4",
            //         "ProductName": "ג'בטה קמח מלא",
            //        "Quantity": "10",
            //        "Price": "55",
            //        "WeekendPrice": "60",
            //        "ProductStatus": 2
            //    }
            //];
        }
    }
})();
