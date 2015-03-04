(function () {
    'use strict';

    var controllerId = 'worker';
    angular.module('app').controller(controllerId, ['$location', 'common', 'datacontext', 'managementDistributionsService','print', worker]);

   

    function worker($location, common, datacontext, managementDistributionsService, print) {
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
        vm.date = new Date();
        vm.customersInRound = {};
        vm.roundSelected = {};
        vm.customer = {};
        vm.customerRoundProducts = {};
        vm.roundChange = roundChange;
        vm.customerChange = customerChange;
        vm.editRow = editRow;
        vm.isSaved = false;
        vm.saveProductsCustomer = saveProductsCustomer;
        vm.printBill = printBill;

        activate();

        function activate() {
            var promises = [isAdminRole()];
            common.activateController([promises], controllerId)
                .then(function () { log('מסך חלוקה פעיל'); });
        }

        function isAdminRole() {
            return datacontext.getUserNameAndRole().then(function(response) {
                return { workerEmail: response.data.userEmail, isAdmin: response.data.isAdmin };
            }).then(function(result) {
                vm.isAdmin = result.isAdmin;
                vm.workerEmail = result.workerEmail;
            }).then(function() {
                filterRoundDate();
            }).then(function() {
                getRounds();
            });
        }

        function filterRoundDate() {
            vm.roundFilter = {
                Today: true,
                StartDate: null,
                EndDate: null,
                Email: vm.workerEmail
            }
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

        function roundChange(round) {
            vm.customersInRound = {};
            if (round != null) {
                vm.customersInRound = round.custRound;
            }
        }
        function customerChange(customer) {
            vm.customerRoundProducts = {};
            if (customer != null) {
                vm.customerRoundProducts = customer;
            }
        }

        function editRow(index) {
            if (index > 0)
                {
                var row = angular.element('.productRow' + index);
                if (row.find('.productRowTd' + index).css('display') === 'table-cell') {
                    row.find('.productRowTd' + index).css('display', 'none');
                    row.find('.productRowInput' + index).css('display', 'table-cell');
                    row.find('i').removeClass('glyphicon-edit').addClass('glyphicon-lock'); 
                    row.find('button').removeClass('btn-info').addClass('btn-warning');
                } else {
                    row.find('.productRowTd' + index).css('display', 'table-cell');
                    row.find('.productRowInput' + index).css('display', 'none');
                    row.find('i').removeClass('glyphicon-lock').addClass('glyphicon-edit');
                    row.find('button').removeClass('btn-warning').addClass('btn-info');

                }
            }
        }

        function saveProductsCustomer() {
            if (vm.customerRoundProducts!=null) {
                return managementDistributionsService.updateCustomerRound(vm.customerRoundProducts).then(function (rsponse) {
                    //success
                    logSuccess("הלקוח בסבב עודכן בהצלחה.");
                    vm.isSaved = true;
                },
                        function (rsponse) {
                            //error
                            logError(rsponse.status + " " + rsponse.statusText);
                        }
                    );
            }
            return false;
        }

        function printBill() {
            print.printReport('worker-print');
        }

    }
})();
