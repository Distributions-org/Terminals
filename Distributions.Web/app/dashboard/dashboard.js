(function () {
    'use strict';
    var controllerId = 'dashboard';
    angular.module('app').controller(controllerId, ['$filter', 'common', 'datacontext', 'managementDistributionsService', dashboard]);

    function dashboard($filter, common, datacontext, managementDistributionsService) {
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);

        var vm = this;
        vm.title = 'Dashboard';
        vm.roundFilter = {};
        vm.rounds = {};
        vm.closeRounds = {};
        activate();

        function activate() {
            var promises = [isAdminRole(), filterRoundDate()];
            common.activateController(promises, controllerId)
                .then(function () { log('מידע כללי פעיל'); });
        }

        function isAdminRole() {
            return datacontext.getUserNameAndRole().then(function (response) {
                return vm.isAdmin = response.data.isAdmin;
            }).then(function () {
                if (!vm.isAdmin && $location.path() === "/") {
                    logError('אינך מורשה לצפות בדף זה!!!');
                    $location.url('/worker');
                }
            });
        }

        function filterRoundDate() {
            var s = new Date();
            var e = new Date();
            vm.roundFilter = {
                Today: false,
                StartDate: $filter('date')(new Date(s.setDate(1)), 'MM-dd-yyyy'),
                EndDate: $filter('date')(new Date(e.getFullYear(), e.getMonth() + 1, 0), 'MM-dd-yyyy'),
                StartDateView: $filter('date')(new Date(s.setDate(1)), 'dd-MM-yyyy'),
                EndDateView: $filter('date')(new Date(e.getFullYear(), e.getMonth() + 1, 0), 'dd-MM-yyyy')
            }
            getRounds();
        }

        function getRounds() {
            return managementDistributionsService.getRounds(vm.roundFilter).then(function (response) {
                //success
                vm.rounds = _.where(response.data, { roundStatus: 1 });
                vm.closeRounds = _.where(response.data, { roundStatus: 0 });
            },
                function (response) {
                    //error
                    logError(response.status + " " + response.statusText);
                });
        }



        //function getMessageCount() {
        //    return datacontext.getMessageCount().then(function (data) {
        //        return vm.messageCount = data;
        //    });
        //}

        //function getPeople() {
        //    return datacontext.getPeople().then(function (data) {
        //        return vm.people = data;
        //    });
        //}
    }
})();