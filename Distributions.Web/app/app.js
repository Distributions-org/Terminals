(function () {
    'use strict';

    var app = angular.module('app', [
        // Angular modules 
        'ngAnimate',        // animations
        'ngRoute',          // routing
        'ngSanitize',       // sanitizes html bindings (ex: sidebar.js)
        'ngMessages',

        //ui-grid
        'ui.grid',
        'ui.grid.edit',
        'ui.grid.resizeColumns',
        'ui.grid.selection',
        'ui.grid.exporter',

        // Custom modules 
        'common',           // common functions, logger, spinner
        'common.bootstrap', // bootstrap dialog wrapper functions
        'myfilter',         // my custom filters

        // 3rd Party Modules
        //'breeze.angular',    // configures breeze for an angular app
        //'breeze.directives', // contains the breeze validation directive (zValidate)
        'ui.bootstrap'       // ui-bootstrap (ex: carousel, pagination, dialog)
    ]);

    // Handle routing errors and success events.
    // Trigger breeze configuration
    app.run(['$route', '$rootScope', function ($route, $rootScope) {
        // Include $route to kick start the router.
        $rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
            $rootScope.title = current.$$route.title;
        });
    }]);
})();


