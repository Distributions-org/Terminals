(function () { 
    'use strict';
    
    var controllerId = 'sidebar';
    angular.module('app').controller(controllerId,
        ['$route', 'config', 'routes', 'datacontext', sidebar]);

    function sidebar($route, config, routes, datacontext) {
        var vm = this;

        vm.isCurrent = isCurrent;
        vm.isAdmin = false;
        activate();

        function activate() { getNavRoutes(); }
        
        function getNavRoutes() {
            isAdminRole().then(function() {
                if (vm.isAdmin) {
                    vm.navRoutes =
                        routes.filter(function(r) {
                            return r.config.settings && r.config.settings.nav;
                        }).sort(function(r1, r2) {
                            return r1.config.settings.nav - r2.config.settings.nav;
                        });
                } else {
                    vm.navRoutes = [_.findWhere(routes, { url: "/worker" })];
                }
            });
        }


        function isAdminRole() {
            return datacontext.getUserNameAndRole().then(function (response) {
                return vm.isAdmin = response.data.isAdmin;
            });
        }

        function isCurrent(route) {
            if (!route.config.title || !$route.current || !$route.current.title) {
                return '';
            }
            var menuName = route.config.title;
            return $route.current.title.substr(0, menuName.length) === menuName ? 'current' : '';
        }
    };
})();
