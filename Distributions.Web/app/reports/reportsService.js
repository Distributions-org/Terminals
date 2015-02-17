(function () {
    'use strict';

    var serviceId = 'reportsService';
    angular.module('app').service(serviceId, ['common', '$http', reportsService]);

    //reportsService.$inject = [];

    function reportsService(common, $http) {
        //this.getData = getData;

        //function getData() { }
        var service = {
            reports: reports,
            checkProductAmountPerRound: checkProductAmountPerRound
        }

        return service;

        function reports(model) {
            return $http.post("/ManageReport", model).success(function (data) {
                return data;
            })
                .error(function (data, status) {
                    return status;
                });
        }

        function checkProductAmountPerRound(model) {
            return $http.post("/CheckProductAmountPerRound", model).success(function (data) {
                return data;
            })
                .error(function (data, status) {
                    return status;
                });
        }
        
    }
})();