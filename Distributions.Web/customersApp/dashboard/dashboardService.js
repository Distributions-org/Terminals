(function () {
    'use strict';

    angular
        .module('customerApp')
        .service('dashboardService', dashboardService);

    dashboardService.$inject = ['$http'];

    function dashboardService($http) {

        var service = {
            getRoundsByDate: getRoundsByDate,
            getProductsCustomer: getProductsCustomer
        };

        return service;

        function getRoundsByDate(date) {
            return $http.get("Customer/GetRoundsByDate?date="+ date).then(function(response) {
                return response;
            }, function (response) {
                return response;
            });
        }

        function getProductsCustomer(customerId) {
            return $http.get("Customer/GetProductsCustomer?customerId=" + customerId).then(function (response) {
                return response;
            }, function (response) {
                return response;
            });
        }
    }

})();