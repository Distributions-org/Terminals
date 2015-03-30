(function () {
    'use strict';

    var controllerId = 'worker';
    angular.module('app').controller(controllerId, ['$location','$q', 'common', 'datacontext', 'managementDistributionsService','print', worker]);

   

    function worker($location,$q, common, datacontext, managementDistributionsService, print) {
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);
        var logSuccess = common.logger.getLogFn(controllerId, 'success');
        var logError = common.logger.getLogFn(controllerId, 'error');
        var logWarning = common.logger.getLogFn(controllerId, 'warning');
        var vm = this;
        vm.isBusy = common.serviceCallPreloader;
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
        vm.productsPrint = [];
        vm.closeRound = closeRound;

        activate();

        function activate() {
            var promises = [isAdminRole()];
            common.activateController([promises], controllerId)
                .then(function () { log('מסך חלוקה פעיל'); }).then(function () { vm.isBusy(true); });
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
                getRounds().then(function () {
                    if (vm.rounds.length > 0) {
                        vm.roundSelected = vm.rounds[0];
                        roundChange(vm.rounds[0]);
                    }
                }).then(function() {
                    if (vm.customersInRound.length > 0) {
                        var custTmp = vm.customersInRound;
                        vm.customer = custTmp[0];
                        customerChange(custTmp[0]);
                    }
                }).finally(function() {
                    vm.isBusy(false);
                });
            });
        }

        function filterRoundDate() {
            vm.roundFilter = {
                Today: true,
                StartDate: null,
                EndDate: null,
                Email: vm.workerEmail
            };
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
            vm.customerRoundProducts = {};
            vm.isSaved = false;
            if (round != null) {
                vm.customersInRound = _.without(round.custRound, _.find(round.custRound, function (r) { return r.roundcustomerProducts.length == 0; }));
                if (vm.customersInRound.length > 0) {
                    vm.customer = vm.customersInRound[0];
                    customerChange(vm.customersInRound[0]);
                }
            }
        }
        function customerChange(customer) {
            vm.customerRoundProducts = {};
            vm.isSaved = false;
            if (customer != null) {
                vm.customerRoundProducts = customer;
            }
        }

        function closeRound() {
            if (vm.isSaved) {
                common.modalDialog.confirmationDialog("סגירת סבב", "האם לסגור את הסבב?", "מאשר", "בטל").then(function(result) {
                    if (result == "ok") {
                        vm.roundSelected.roundStatus = 2;
                         managementDistributionsService.changeRoundStatus(vm.roundSelected).then(function (response) {
                            //success
                            if (response.data.roundStatus !== 1) {
                                logSuccess("הסבב נסגר בהצלחה");
                                vm.customerRoundProducts = {};
                                vm.customersInRound = {};
                                vm.isSaved = false;
                                vm.rounds = {};
                                getRounds();
                            } else {
                                logWarning("הסבב פעיל");
                            }
                        }, function (response) {
                            //error
                            logError(response.status + " " + response.statusText);
                        });
                    }

                }, function(result) {
                    
                });
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
            if (vm.customerRoundProducts != null) {
                vm.customerRoundProducts.customerRound.RoundCustomerStatus = true;
                var roundCustomers = {
                    RoundId: vm.roundSelected.RoundID,
                    RoundCustomers: [
                        {
                            customerRound: vm.customerRoundProducts.customerRound,
                            roundcustomerProducts: vm.customerRoundProducts.roundcustomerProducts
                        }
                    ]
                };
                return managementDistributionsService.updateCustomerRound([roundCustomers]).then(function (rsponse) {
                    //success
                    logSuccess("הלקוח בסבב עודכן בהצלחה.");
                    vm.isSaved = true;
                        angular.element("select[ng-model='vm.customer']").find(":selected").addClass('applay');
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
            createTblPrint();
            setTimeout(function () {
                print.printReport('worker-print');
            }, 1000);
                
            
        }

        function createTblPrint() {
            vm.productsPrint = [];
            _.filter(vm.customerRoundProducts.roundcustomerProducts, function(product) {
                if (product.Amount > 0  || product.DeliveredAmount > 0) {
                    vm.productsPrint.push(product);
                }
            });
        }
    }
})();
