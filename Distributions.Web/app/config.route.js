﻿(function () {
    'use strict';

    var app = angular.module('app');

    // Collect the routes
    app.constant('routes', getRoutes());
    
    // Configure the routes and route resolvers
    app.config(['$routeProvider', 'routes', routeConfigurator]);
    function routeConfigurator($routeProvider, routes) {

        routes.forEach(function (r) {
            $routeProvider.when(r.url, r.config);
        });
        $routeProvider.otherwise({ redirectTo: '/' });
    }

    // Define the routes 
    function getRoutes() {
        return [
            {
                url: '/',
                config: {
                    templateUrl: '../app/dashboard/dashboard.html',
                    title: 'dashboard - Terminal',
                    settings: {
                        nav: 1,
                        content: '<i class="fa fa-dashboard"></i> מידע כללי'
                    }
                }
            }, {
                url: '/admin',
                config: {
                    title: 'admin - Terminal',
                    templateUrl: '../app/admin/admin.html',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> ניהול'
                    }
                }
            }, {
                url: '/managementDistributions',
                config: {
                    title: 'management Distributions - Terminal',
                    templateUrl: '../app/managementDistributions/managementDistributions.html',
                    settings: {
                        nav: 3,
                        content: '<i class="fa fa-truck"></i> ניהול הפצות'
                    }
                }
            }, {
                url: '/reports',
                config: {
                    title: 'reports - Terminal',
                    templateUrl: '../app/reports/reports.html',
                    settings: {
                        nav: 4,
                        content: '<i class="fa fa-file-text-o"></i> דוחות'
                    }
                }
            }
        ];
    }
})();