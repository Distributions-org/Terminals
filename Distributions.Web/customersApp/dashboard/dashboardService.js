(function () {
    'use strict';

    angular
        .module('customerApp')
        .service('dashboardService', dashboardService);

    dashboardService.$inject = ['$http'];

    function dashboardService($http) {

        var service = {
            getRoundsByDate: getRoundsByDate,
            getProductsCustomer: getProductsCustomer,
            addProductsToRound: addProductsToRound,
            getRoundCustomerId: getRoundCustomerId
        };

        return service;

        function getRoundsByDate(date) {
            return $http.get("Customer/GetRoundsByDate?date=" + date).then(function (response) {
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

        function getRoundCustomerId(id) {
            return $http.get("Customer/GetRoundCustomerId?id=" + id).then(function (response) {
                return response;
            }, function (response) {
                return response;
            });
        }

        function addProductsToRound(productsAccept) {
            return $http.post("Customer/AddProductsToRound", productsAccept)
                .then(function (response) {
                    return response;
                },
            function (error) {
                return error;
            });
        }
    }

})();