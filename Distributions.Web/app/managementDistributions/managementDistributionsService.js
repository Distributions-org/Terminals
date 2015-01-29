(function () {
    'use strict';

    var serviceId = 'managementDistributionsService';
    angular.module('app').service(serviceId, ['common', '$http', managementDistributionsService]);

    function managementDistributionsService(common, $http) {
        var $q = common.$q;

        var service = {
            getCustomers: getCustomers,
            getProductsCustomer: getProductsCustomer,
            addProductToCustomer: addProductToCustomer,
            saveProductToCustomer: saveProductToCustomer,
            getWorkers: getWorkers,
            newRound: newRound,
            addUserToRound: addUserToRound
        };

        return service;

        function getCustomers() {
            return $http.get("/GetActiveCustomers").success(function (data) {
                return data;
            })
                .error(function(data, status) {
                return status;
            });
        }

        function getWorkers() {
            return $http.get("/GetWorkers").success(function (data) {
                return data;
            })
                .error(function (data, status) {
                    return status;
                });
        }

        function getProductsCustomer(customerId) {
            return $http.get("/GetProductsCustomer?customerId="+customerId).success(function (data) {
                return data;
            })
               .error(function (data, status) {
                   return status;
               });
        }

        function addProductToCustomer(parameters) {
            return $http.post("/AddProductsCustomer", parameters).success(function(data) {
                    return data;
                })
                .error(function(data, status) {
                return status;
            });
        }

        function saveProductToCustomer(parameters) {
            return $http.post("/UpdateProductsCustomer", parameters).success(function (data) {
                return data;
            })
                .error(function (data, status) {
                    return status;
                });
        }

        function newRound(round) {
            return $http.post("/NewRound", round).success(function(data) {
                    return data;
                })
                .error(function(data, status) {
                return status;
            });
        }

        function addUserToRound(roundModel) {
            return $http.post("/AddUserToRound", roundModel).success(function (data) {
                return data;
            })
              .error(function (data, status) {
                  return status;
              });
        }
    }
})();
