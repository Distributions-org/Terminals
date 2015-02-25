(function () {
    'use strict';

    var controllerId = 'worker';
    angular.module('app').controller(controllerId, ['$location', 'common', 'datacontext', 'managementDistributionsService', worker]);

   

    function worker($location, common, datacontext, managementDistributionsService) {
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);
        var logSuccess = common.logger.getLogFn(controllerId, 'success');
        var logError = common.logger.getLogFn(controllerId, 'error');
        var logWarning = common.logger.getLogFn(controllerId, 'warning');
        var vm = this;
        vm.title = 'worker';
        vm.isAdmin = false;
        vm.workerEmail = "";
        vm.rounds = {};
        vm.closeRounds = {};
        activate();

        function activate() {
            var promises = [isAdminRole()];
            common.activateController([promises], controllerId)
                .then(function () { log('מסך חלוקה פעיל'); });
        }

        function isAdminRole() {
            return datacontext.getUserNameAndRole().then(function (response) {
                vm.workerEmail = response.data.userEmail;
               return vm.isAdmin = response.data.isAdmin;
            }).then(filterRoundDate());
        }

        function filterRoundDate() {
            vm.roundFilter = {
                Today: true,
                StartDate: null,
                EndDate: null
            }
            getRounds();
        }

        function getRounds() {
            return managementDistributionsService.getRounds(vm.roundFilter).then(function (response) {
                //success
                    vm.rounds = _.filter(response.data, function(round) {
                        return round.RoundUser[0].Email === vm.workerEmail && round.roundStatus == 1;
                    });       
                    vm.closeRounds = _.filter(response.data, function (round) {
                        return round.RoundUser[0].Email === vm.workerEmail && round.roundStatus == 0;
                    });
            },
                function (response) {
                    //error
                    logError(response.status + " " + response.statusText);
                });
        }
    }
})();
