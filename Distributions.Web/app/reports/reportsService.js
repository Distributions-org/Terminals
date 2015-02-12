(function () {
    'use strict';

    var serviceId = 'reportsService';
    angular.module('app').service(serviceId, ['common', '$http', reportsService]);

    //reportsService.$inject = [];

    function reportsService(common, $http) {
        //this.getData = getData;

        //function getData() { }
        var service = {
            getReports: getReports,
        }

        return service;

        function getReports() {
            return $http.post("/GetRoles").then(function (response) {
                return response.data;
            });
        }
    }
})();