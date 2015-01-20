(function () {
    'use strict';

    var serviceId = 'managementDistributionsService';
    angular.module('app').service(serviceId, ['common', '$http', managementDistributionsService]);

    function managementDistributionsService(common, $http) {
        var $q = common.$q;

        var service = {
            getCustomers: getCustomers,
            getProductsCustomer: getProductsCustomer,
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

        function getProductsCustomer(customerId) {
            return $http.get("/GetProductsCustomer?customerId="+customerId).success(function (data) {
                return data;
            })
               .error(function (data, status) {
                   return status;
               });
        }
    }
})();
