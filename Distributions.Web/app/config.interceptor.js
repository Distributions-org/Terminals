(function () {
    'use strict';

    var app = angular.module('app');

    app.config(['$httpProvider', function ($httpProvider) {

        //================================================
        // Add an interceptor for AJAX errors
        //================================================
        $httpProvider.interceptors.push(function ($q, $location) {
            var timestampMarker = {
                request: function (config) {
                    config.requestTimestamp = new Date().getTime();
                    return config;
                },
                response: function (response) {
                    response.config.responseTimestamp = new Date().getTime();
                    if (response.status === 401)
                        $location.url('/');
                    return response;
                    
                }
            };
            return timestampMarker;
        }
            );
    }
    ]);
})();