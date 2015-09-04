(function () {
    'use strict';

    var controllerId = 'worker';
    angular.module('app').controller(controllerId, ['$location', '$q', '$window', '$filter', 'common', 'datacontext', 'managementDistributionsService', 'print','cache', worker]);



    function worker($location, $q, $window, $filter, common, datacontext, managementDistributionsService, print,cache) {
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
        vm.productsInRound = [];
        vm.closeRound = closeRound;
        vm.calcTotal = calcTotal;
        vm.manager = {};
        vm.managerDetails = {};
        vm.productChange = productChange;
        activate();

        function activate() {
            var promises = [isAdminRole().then(function() {
                getManagerDetails();
            })];
            common.activateController([promises], controllerId)
                .then(function () { log('מסך חלוקה פעיל'); }).then(function () { vm.isBusy(true); });
        }

        function getManagerDetails() {
            common.getManagerDetails(cache.get('managerId')).then(function (data) {
                vm.managerDetails = data;
            }).then(function() {
                vm.manager = getManager();
            });
        }

        function getManager() {
            return {
                SoleProprietorship: vm.managerDetails.ManagerHP,
                tel:  vm.managerDetails.ManagerPhone,
                phone: vm.managerDetails.ManagerPhone2,
                address: vm.managerDetails.ManagerAddress,
                name: vm.managerDetails.ManagerName
            }
        }


        function hideSideNavIpad() {
            var userAgent = $window.navigator.userAgent;
            if (userAgent.match(/Android/i) || userAgent.match(/webOS/i) || userAgent.match(/iPhone/i) || userAgent.match(/iPad/i)
                    || userAgent.match(/iPod/i) || userAgent.match(/BlackBerry/i) || userAgent.match(/Windows Phone/i)) {
                //angular.element(".mainbar").css("margin-right", "0");
                //angular.element(".side-bar").css("display", "none");
                document.querySelector('style').textContent +=
                    "@media (max-width: 1024px) and (min-width: 768px) {.sidebar {display: none !important;} .mainbar {margin-right: 0 !important;}}";
            }
        }


        function isAdminRole() {
            return datacontext.getUserNameAndRole().then(function (response) {
                var cacheTemp = cache.get('managerId');
                if (!cacheTemp) {
                    cache.clear('managerId');
                    cache.put('managerId', response.data.managerId);
                }
                return { workerEmail: response.data.userEmail, isAdmin: response.data.isAdmin };
            }).then(function (result) {
                vm.isAdmin = result.isAdmin;
                vm.workerEmail = result.workerEmail;
            }).then(function () {
                filterRoundDate();
            }).then(function () {
                getRounds().then(function () {
                    if (vm.rounds.length > 0) {
                        vm.roundSelected = vm.rounds[0];
                        roundChange(vm.rounds[0]);
                        gerProductsRound();
                    }
                }).then(function () {
                    if (vm.customersInRound.length > 0) {
                        var custTmp = vm.customersInRound;
                        vm.customer = custTmp[0];
                        customerChange(custTmp[0]);
                    }
                }).finally(function () {
                    vm.isBusy(false);
                });
            });
        }

        function filterRoundDate() {
            var today = new Date();
            var tomorrow = new Date();
            tomorrow.setDate(today.getDate() + 1);
            vm.roundFilter = {
                Today: false,
                StartDate: $filter('date')(today, 'MM-dd-yyyy'),
                EndDate: $filter('date')(tomorrow, 'MM-dd-yyyy'),
                Email: vm.workerEmail,
                ManagerId: cache.get('managerId')
            };
        }

        function getRounds() {
            return managementDistributionsService.getRounds(vm.roundFilter).then(function (response) {
                //success
                vm.rounds = _.filter(response.data, function (round) {
                    return round.RoundUser[0].Email === vm.workerEmail && round.roundStatus == 1;
                });
                vm.closeRounds = _.filter(response.data, function (round) {
                    return round.RoundUser[0].Email === vm.workerEmail && round.roundStatus == 0;
                });
            },
                function (response) {
                    //error
                    logError(response.status + " " + response.statusText);
                }).then(function () {
                    hideSideNavIpad();
                });
        }

        function gerProductsRound() {
            var counter = 0;
            _.each(vm.rounds, function (round, index) {
                counter = index;
                _.each(round.custRound, function (custRound) {
                    _.each(custRound.roundcustomerProducts, function(product) {
                        vm.productsInRound.push({
                            id: product.CustomerRoundProduct.ProductID,
                            productName: product.CustomerRoundProduct.ProductName,
                            amount:product.Amount,
                            deliveredAmount: product.DeliveredAmount,
                            customerName: product.CustomerRoundProduct.CustomerName,
                            roundName: vm.rounds[counter].RoundName + ' ' + vm.rounds[counter].RoundDate.substring(0, 10)
                        });
                    });
                });
            });
        }

        function productChange(product) {
            if (product != undefined) {
            vm.productsFiltterInRound = _.filter(vm.productsInRound, function(pir) {
                return pir.id == product.id;
            });
            } else {
                vm.productsFiltterInRound = [];
            }
        }

        function roundChange(round) {
            vm.customersInRound = {};
            vm.customerRoundProducts = {};
            vm.isSaved = false;
            if (round != null) {
                vm.date = new Date(round.RoundDate);
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
                var tmp = $filter('orderBy')(vm.customerRoundProducts.roundcustomerProducts, 'CustomerRoundProduct.ProductName');
                vm.customerRoundProducts.roundcustomerProducts =[];
                vm.customerRoundProducts.roundcustomerProducts = tmp;
            }
        }

        function closeRound() {
            if (vm.isSaved) {
                common.modalDialog.confirmationDialog("סגירת סבב", "האם לסגור את הסבב?", "מאשר", "בטל").then(function (result) {
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

                }, function (result) {

                });
            }
        }

        function editRow(index, deliveredAmount,amount) {
            if (index > 0) {
                if (deliveredAmount === 0) {
                    vm.customerRoundProducts.roundcustomerProducts[index - 1].DeliveredAmount = '';
                }
                else if (parseInt(deliveredAmount) === 0 || parseInt(deliveredAmount).toString() === 'NaN') {
                    vm.customerRoundProducts.roundcustomerProducts[index - 1].DeliveredAmount = 0;
                }
                if (amount === 0) {
                    vm.customerRoundProducts.roundcustomerProducts[index - 1].Amount = '';
                }
                else if (parseInt(amount) === 0 || parseInt(amount).toString() === 'NaN') {
                    vm.customerRoundProducts.roundcustomerProducts[index - 1].Amount = 0;
                }
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
            common.modalDialog.workerPrintDialog().then(function (result) {
                if (result != undefined && result !== '') {
                    createTblPrint(result);
                    setTimeout(function () {
                        if (result == 'workerPrintPay') {
                            print.printReport('worker-print-pay');
                            return;
                        } else {
                            print.printReport('worker-print');
                            return;
                        }

                    }, 1000);
                }
            });
            //createTblPrint();
            //setTimeout(function () {
            //    print.printReport('worker-print');
            //}, 1000);


        }

        function createTblPrint(action) {
            angular.element(".billForPay").css({ 'display': "none" });
            var products = [];
            vm.productsPrint = [];
            switch (action) {
                case 'workerPrint':
                    _.filter(vm.customerRoundProducts.roundcustomerProducts, function (product) {
                        if (product.Amount > 0 || product.DeliveredAmount > 0) {
                            product.CustomerHP = vm.customerRoundProducts.customerRound.CustomerHP;
                            products.push(product);
                        }
                    });
                    if (products.length > 0) {
                        vm.productsPrint.push(products);
                    }
                    break;
                case 'workerPrintPay':
                    _.filter(vm.customerRoundProducts.roundcustomerProducts, function (product) {
                        if (product.Amount > 0 || product.DeliveredAmount > 0) {
                            product.CustomerHP = vm.customerRoundProducts.customerRound.CustomerHP;
                            products.push(product);
                        }
                    });
                    if (products.length > 0) {
                        vm.productsPrint.push(products);
                    }
                    break;
                case 'workerPrintAll':
                    _.each(vm.roundSelected.custRound, function (custRound) {
                        products = [];
                        _.filter(custRound.roundcustomerProducts, function (product) {
                            if (product.Amount > 0 || product.DeliveredAmount > 0) {
                                product.CustomerHP = custRound.customerRound.CustomerHP;
                                products.push(product);
                            }
                        });
                        if (products.length > 0) {
                            vm.productsPrint.push(products);
                        }
                    });
                    break;
            }
        }

        function calcTotal(products) {
            return _.reduce(products, function (total, product) { return total + ((product.Amount - product.DeliveredAmount) * product.CustomerRoundProduct.Cost); }, 0);
        }


    }
})();
