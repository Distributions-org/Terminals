(function () {
    'use strict';

    angular
        .module('customerApp')
        .service('dashboardService', dashboardService);

    dashboardService.$inject = ['$http'];

    function dashboardService($http) {

        var service = {
            getRoundsByDate:getRoundsByDate
        };

        return service;

        function getRoundsByDate(date) {
            return $http.get("Customer/GetRoundsByDate?date="+ date).then(function(response) {
                return response;
            }, function (response) {
                return response;
            });
        }
    }

})();