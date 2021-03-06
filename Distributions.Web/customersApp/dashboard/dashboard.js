﻿(function () {
    'use strict';
    var controllerId = 'dashboard';
    angular.module('customerApp').controller(controllerId, ['$filter', 'common', 'datacontext', 'dashboardService', dashboard]);

    function dashboard($filter, common,datacontext, dashboardService) {
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);
        var logSuccess = common.logger.getLogFn(controllerId, 'success');
        var logError = common.logger.getLogFn(controllerId, 'error');
        var logWarning = common.logger.getLogFn(controllerId, 'warning');
        var vm = this;
        vm.isBusy = common.serviceCallPreloader;
        vm.title = 'Dashboard';

       
        ////date picker

        vm.stratDate = today();
        vm.today = today();

        vm.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'MM.dd.yyyy', 'dd/MM/yyyy', 'shortDate'];
        vm.format = vm.formats[3];

        // Disable weekend selection
        vm.disabled = function (date, mode) {
            return 0; // (mode === 'day' && (date.getDay() === 5 || date.getDay() === 6));
        };

       
        vm.open = function ($event) {
            $event.preventDefault();
            $event.stopPropagation();

            vm.opened = true;
        };

        vm.dateOptions = {
            formatYear: 'yyyy',
            startingDay: 0,
            showWeeks: false
        };

        vm.clearZero = clearZero;

        function clearZero(product) {
            if (product.Amount === 0) {
                product.Amount = "";
            } else if (product.Amount === "") {
                product.Amount = 0;
            }
        }

        function toggleMin() {
            //vm.minDate = (vm.minDate) ? null : new Date();
        };

        function today() {
            var date = new Date();
            vm.dt = $filter('date')(date, 'MM.dd.yyyy'); // date.toLocaleDateString("he-IL"); //((date.getDate()) + '/' + (date.getMonth() + 1) + '/' + date.getFullYear());
            return $filter('date')(date, 'MM.dd.yyyy');
        };

        //rounds
        vm.roundSelected = null;
        vm.getRounds = getRounds;
        vm.rounds = [];
        vm.roundChange = roundChange;
        vm.save = save;

        activate();

        function activate() {
            var promises = [];
            common.activateController(promises, controllerId)
                .then(function () { log('אזור אישי ללקוח פעיל'); }).then(function() {
                getProductsCustomer();
            });
            toggleMin();
        }

        function getRounds() {
            vm.rounds = [];
            dashboardService.getRoundsByDate($filter('date')(vm.stratDate, 'MM.dd.yyyy')).then(function (response) {
                if (response.data.length == 0) {
                    logWarning('לא קיימים סבבים בתאריך המבוקש');
                } else {
                    vm.rounds = response.data;
                    logSuccess('טעינת סבבים הסתיימה בהצלחה');
                }
                
            }, function(response) {
                logError(response.status);
            });
        }

        function getProductsCustomer() {
             datacontext.getCustomer().then(function (data) {
                var customer = data;

                if (customer != null) {
                    return dashboardService.getProductsCustomer(customer.CustomerID).then(function (response) {
                        //success
                        vm.productsCustomer = response.data;
                        _.each(vm.productsCustomer, function (product) {
                            if (product.Amount === undefined) {
                                product.Amount = 0;
                            }
                            product.inRound = false;
                        });
                    },
                     function (response) {
                         //error
                         logError(response.status + " " + response.statusText);
                     });
                }
                else {
                    logError("לקוח לא קיים");
                }
            });
           
        }

        function roundChange(round) {
            console.log(round);
            if (round) {
                
            }
        }

        function save() {
            var productsAccept = _.filter(vm.productsCustomer, function (product) {
                return product.inRound == true;
            });
            if (productsAccept.length > 0) {
                console.log({ productsAccept: productsAccept });
                dashboardService.addProductsToRound(createRoundcustomerProducts(productsAccept)).then(function(response) {
                    console.log(response);
                }, function(error) {

                });
            } else {
                logError("לא נבחר מוצר");
            }
        }


        function createRoundcustomerProducts(products) {
            var roundcustomerProducts = [];
            _.each(products, function (product) {
                roundcustomerProducts.push({
                    CustomerRoundProduct: {
                        ProductCustomerID: product.ProductCustomerID,
                        CustomerID: product.CustomerID,
                        ProductID: product.ProductID,
                        dayType: product.dayType,
                        Cost: product.Cost,
                        ProductName: product.ProductName,
                        CustomerName: product.CustomerName
                    },
                    RoundsCustomerProductID: product.RoundsCustomerProductID,
                    Amount: product.Amount,
                    DeliveredAmount: product.DeliveredAmount
                });
            });
            return roundcustomerProducts;
        }



        //vm.roundFilter = {};
        //vm.rounds = {};
        //vm.closeRounds = {};
        //vm.showRound = showRound;
        

        //function isAdminRole() {
        //    return datacontext.getUserNameAndRole().then(function (response) {
        //        return vm.isAdmin = response.data.isAdmin;
        //    }).then(function () {
        //        if (!vm.isAdmin && $location.path() === "/") {
        //            logError('אינך מורשה לצפות בדף זה!!!');
        //            $location.url('/worker');
        //        }
        //    });
        //}

        //function filterRoundDate() {
        //    var s = new Date();
        //    var e = new Date();
        //    vm.roundFilter = {
        //        Today: false,
        //        StartDate: $filter('date')(new Date(s.setDate(1)), 'MM-dd-yyyy'),
        //        EndDate: $filter('date')(new Date(e.getFullYear(), e.getMonth() + 1, 0), 'MM-dd-yyyy'),
        //        StartDateView: $filter('date')(new Date(s.setDate(1)), 'dd-MM-yyyy'),
        //        EndDateView: $filter('date')(new Date(e.getFullYear(), e.getMonth() + 1, 0), 'dd-MM-yyyy')
        //    }
        //    getRounds();
        //}

        //function getRounds() {
        //    var roundscache = common.cache.get('rounds');
        // if (roundscache != null) {
        //     vm.rounds = _.where(roundscache, { roundStatus: 1 });
        //     vm.closeRounds = _.where(roundscache, { roundStatus: 2 });
        // } else {
        //     return managementDistributionsService.getRounds(vm.roundFilter).then(function (response) {
        //         //success
        //         vm.rounds = _.where(response.data, { roundStatus: 1 });
        //         vm.closeRounds = _.where(response.data, { roundStatus: 2 });
        //         common.cache.put('rounds', response.data);
        //         vm.isBusy(false);
        //     },
        //       function (response) {
        //           //error
        //           if (response.status == 403) {
        //               logError("לא נמצאו סבבים");
        //               vm.isBusy(false);
        //           } else {
        //               logError(response.status + " " + response.statusText);
        //           }
        //           vm.isBusy(false);
        //       });
        // }
           
        //}



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
        //function showRound(round) {
        //    common.modalDialog.roundDialog(round);

        //    //var modalInstance = $modal.open({
        //    //    templateUrl: 'myModalContent.html',
        //    //    controller: 'ModalInstanceCtrl as vm',
        //    //    size: 'lg',
        //    //    resolve: {
        //    //        round: function () {
        //    //            return round;
        //    //        }
        //    //    }
        //    //});
        //}
       
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