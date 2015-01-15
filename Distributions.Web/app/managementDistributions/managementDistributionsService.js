(function () {
    'use strict';

    var serviceId = 'managementDistributionsService';
    angular.module('app').service(serviceId, ['common', '$http', managementDistributionsService]);

    function managementDistributionsService(common, $http) {
        var $q = common.$q;

        var service = {
            getDistributors: getDistributors,
        };

        return service;

        function getDistributors() {
            return $http.get("/Distributors").success(function(data) {
                return data;
            })
                .error(function(data, status) {
                return status;
            });
        }
    }
})();
