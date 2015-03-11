﻿(function () {
    'use strict';
    var controllerId = 'dashboard';
    angular.module('app').controller(controllerId, ['$filter', '$modal', 'common', 'datacontext', 'managementDistributionsService', dashboard]);

    function dashboard($filter, $modal, common, datacontext, managementDistributionsService) {
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);

        var vm = this;
        vm.title = 'Dashboard';
        vm.roundFilter = {};
        vm.rounds = {};
        vm.closeRounds = {};
        vm.showRound = showRound;
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
                vm.closeRounds = _.where(response.data, { roundStatus: 2 });
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
        function showRound(round) {
            common.modalDialog.roundDialog(round);

            //var modalInstance = $modal.open({
            //    templateUrl: 'myModalContent.html',
            //    controller: 'ModalInstanceCtrl as vm',
            //    size: 'lg',
            //    resolve: {
            //        round: function () {
            //            return round;
            //        }
            //    }
            //});
        }
       
    }
})();

//(function() {
//    'use strict';
//    var controllerId = 'ModalInstanceCtrl';
//    angular.module('app').controller(controllerId, ['$modalInstance', 'round', ModalInstanceCtrl]);

//    function ModalInstanceCtrl($modalInstance, round) {
//        var vm = this;

//        vm.round = round;
//        vm.ok = ok;
//        vm.cancel = cancel;

//        function ok() {
//            $modalInstance.close(vm.round);
//        };

//        function cancel () {
//            $modalInstance.dismiss('cancel');
//        };
//    }
//})();