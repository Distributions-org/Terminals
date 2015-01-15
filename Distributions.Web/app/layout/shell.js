(function () { 
    'use strict';
    
    var controllerId = 'shell';
    angular.module('app').controller(controllerId,
        ['$rootScope', '$location', 'common', 'config', 'datacontext', shell]);

    function shell($rootScope, $location, common, config, datacontext) {
        var vm = this;
        var logSuccess = common.logger.getLogFn(controllerId, 'success');
        vm.userName;
        vm.isAuthenticated = false;
        vm.logout = logout;
        var events = config.events;
        vm.antiForgeryToken ="";
        vm.busyMessage = 'Please wait ...';
        vm.isBusy = true;
        vm.spinnerOptions = {
            radius: 40,
            lines: 7,
            length: 0,
            width: 30,
            speed: 1.7,
            corners: 1.0,
            trail: 100,
            color: '#F58A00'
        };

        activate();

        function activate() {
            logSuccess('Distributions loaded!', null, true);
            var promises = [getuserNameAndRole(), isAuthenticated(), getAntiForgeryToken()];
            common.activateController([promises], controllerId);
        }

        function toggleSpinner(on) { vm.isBusy = on; }

        function getuserNameAndRole() {
            return datacontext.getUserNameAndRole().then(function (response) {
                return  vm.userName = response.data.userName;
            });
        }

        function getAntiForgeryToken() {
            return datacontext.getAntiForgeryToken().then(function (response) {
                return vm.antiForgeryToken = response.data.antiForgeryToken;
            });
        }

        function isAuthenticated() {
            return datacontext.isAuthenticated().then(function (response) {
                return vm.isAuthenticated = (response.data == "True");
            });
        }

        function logout() {
            return datacontext.logout();
        }

        $rootScope.$on('$routeChangeStart',
            function (event, next, current) { toggleSpinner(true); }
        );
        
        $rootScope.$on(events.controllerActivateSuccess,
            function (data) { toggleSpinner(false); }
        );

        $rootScope.$on(events.spinnerToggle,
            function (data) { toggleSpinner(data.show); }
        );
    };
})();