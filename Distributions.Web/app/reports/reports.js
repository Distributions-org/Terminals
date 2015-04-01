(function () {
    'use strict';

    var controllerId = "reports";
    angular.module('app').controller(controllerId, ['$location', '$filter', 'common', 'datacontext', 'reportsService', 'managementDistributionsService', 'adminService', 'print', reports]);


    function reports($location, $filter, common, datacontext, reportsService, managementDistributionsService, adminService, print) {
        /* jshint validthis:true */
        //reportsService.$inject = [];

        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);
        var logSuccess = common.logger.getLogFn(controllerId, 'success');
        var logError = common.logger.getLogFn(controllerId, 'error');
        var logWarning = common.logger.getLogFn(controllerId, 'warning');
        var vm = this;
        vm.isBusy = common.serviceCallPreloader;
        vm.title = 'דוחות';
        vm.isBusy = common.serviceCallPreloader;
        vm.isAdmin = false;
        vm.customers = {};
        vm.customerSelected = {};
        vm.customerSelectedChange = customerSelected;
        vm.productsCustomer = {};
        vm.showDate = false;
        ////date picker
        vm.stratDate = today();
        vm.endDate = today();
        vm.getReport = getReport;
        vm.report = {};
        vm.reportGroup = {};
        vm.tblShow = false;
        vm.printReport = printReport;
        vm.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'MM.dd.yyyy', 'dd/MM/yyyy', 'shortDate'];
        vm.format = vm.formats[4];
        vm.rounds = {};
        vm.allRounds = {};
        vm.roundSelected = {};
        vm.roundSelectedChange = roundSelectedChange;
        vm.customersRound = {};
        vm.roundProductCustomer = {};
        vm.products = {};
        vm.productSelected = null;
        vm.amount;
        vm.getCustomerRoundAmount = getCustomerRoundAmount;
        vm.editRpc = editRoundProductCustomer;
        vm.roundProductCustomerEdit = {};
        vm.totalAmount = 0;
        vm.totalDeliveredAmount = 0;
        vm.savePrc = savePrc;
        vm.tax = 18;
        vm.getTotlalSum = getTotlalSum;

        vm.dateFilter = new Date();
        // Disable weekend selection
        vm.disabled = function (date, mode) {
            return false;// (mode === 'day' && (date.getDay() === 5 || date.getDay() === 6));
        };

        function getTotlalSum() {
            var total = 0;
            if (vm.report.length>0) {
                _.each(vm.report, function (r) {
                    total = total + r.TotalSum;
                });
                return total;
            }
            return 0;
        }

        

        vm.roundFilter = {
            Today: false,
            StartDate: $filter('date')(new Date(vm.dateFilter.getFullYear(), vm.dateFilter.getMonth() -2, 0).setDate(1), 'MM-dd-yyyy'),
            EndDate: $filter('date')(new Date(vm.dateFilter.getFullYear(), vm.dateFilter.getMonth() + 2, 0), 'MM-dd-yyyy')
        }

        vm.openeStart = function ($event) {
            $event.preventDefault();
            $event.stopPropagation();

            vm.openedStart = true;
        };
        vm.openeEnd = function ($event) {
            $event.preventDefault();
            $event.stopPropagation();

            vm.openedEnd = true;
        };

        vm.dateOptions = {
            formatYear: 'yyyy',
            startingDay: 1,
        };

        function toggleMin() {
            vm.minDate = (vm.minDate) ? null : new Date();
        };

        function today() {
            var date = new Date();
            return date.toISOString().slice(0, 10);//.toLocaleDateString();
            //vm.dt = $filter('date')(date, 'MM.dd.yyyy'); // date.toLocaleDateString("he-IL"); //((date.getDate()) + '/' + (date.getMonth() + 1) + '/' + date.getFullYear());
            //return $filter('date')(date, 'MM.dd.yyyy');
        };


        activate();

        function activate() {
            var promises = [isAdminRole(), getValidCustomers(), toggleMin(), getRounds()];
            common.activateController([promises], controllerId)
                .then(function () {
                    log('מסך ' + vm.title + ' פעיל');
                }).then(function () {
                    if (common.cache.get('rounds') == null) {
                        vm.isBusy(true);
                    }
                });
        }

        function isAdminRole() {
            return datacontext.getUserNameAndRole().then(function (response) {
                return vm.isAdmin = response.data.isAdmin;
            }).then(function () {
                if (!vm.isAdmin && $location.path() === "/reports") {
                    logError('אינך מורשה לצפות בדף זה!!!');
                    $location.url('/worker');
                }
            });
        }

        function getProducts() {
            return adminService.getAllProducts().then(function (response) {
                vm.roundProductCustomer = {};
                    vm.roundProductCustomerEdit = {};
                    vm.products = response.data;
            }
                , function (response) {
                    logError(response.status + " " + response.statusText);
                });

        };

        function getRounds() {
            var roundscache = common.cache.get('rounds');
            if (roundscache != null) {
                vm.allRounds = roundscache;
                vm.rounds = _.where(roundscache, { roundStatus: 1 });
                vm.closeRounds = _.where(roundscache, { roundStatus: 2 });
            } else {
                return managementDistributionsService.getRounds(vm.roundFilter).then(function (response) {
                    //success
                        vm.allRounds = response.data;
                    vm.rounds = _.where(response.data, { roundStatus: 1 });
                    vm.closeRounds = _.where(response.data, { roundStatus: 2 });
                    common.cache.put('rounds', response.data);
                    vm.isBusy(false);
                },
                  function (response) {
                      //error
                      logError(response.status + " " + response.statusText);
                  });
            }

        }

        function roundSelectedChange(round) {
            if (round != null) {
                // vm.customersRound = round.custRound;
                getProducts();
            } else {
                //vm.customersRound = {};
                vm.products = {};
            }
        }

        function getValidCustomers() {
            return managementDistributionsService.getCustomers().then(function (response) {
                return vm.customers = response.data;
            }, function (response) {
                logError(response.status + " " + response.statusText);
            });
        }

        function customerSelected(selected) {
            if (selected != null) {
                return managementDistributionsService.getProductsCustomer(selected.CustomerID).then(function (response) {
                    //success
                    vm.productsCustomer = response.data;
                    vm.showDate = true;
                    vm.tblShow = false;
                },
                 function (response) {
                     //error
                     logError(response.status + " " + response.statusText);
                 });

            }
            else {
                vm.showDate = false;
                vm.tblShow = false;
                vm.report = {};
                return null;
            }
        }

        function getReport() {
            vm.isBusy(true);
            var sdate = new Date(vm.stratDate).toISOString().slice(0, 10);//.toLocaleDateString();
            var edate = new Date(vm.endDate).toISOString().slice(0, 10);//.toLocaleDateString();
          
            //var model = {
            //    ProductIDs: _.pluck(vm.productsCustomer, 'ProductCustomerID'),
            //    CustomerId: vm.customerSelected.CustomerID,
            //    Year: parseInt($filter('date')(sdate, "yyyy")),
            //    Month: parseInt($filter('date')(sdate, "MM")),
            //    EndYear: parseInt($filter('date')(edate, "yyyy")),
            //    EndMonth: parseInt($filter('date')(edate, "MM")),
            //}

            var model = {
                ProductIDs: _.pluck(vm.productsCustomer, 'ProductCustomerID'),
                CustomerId: vm.customerSelected.CustomerID,
                StartDate: sdate,
                EndDate: edate,
            }

            return reportsService.reports(model)
                .then(function (response) {
                    //success
                    var t = new Date();
                    var s = new Date(vm.stratDate);
                    var e = new Date(vm.endDate);
                    var lastDayOfMonth;
                    if (e.getMonth() == s.getMonth()) {
                        lastDayOfMonth = new Date(e.getFullYear(), e.getMonth() + 1, 0);
                    } else {
                        lastDayOfMonth = new Date(e.getFullYear(), e.getMonth(), 0);
                    }
                    vm.dateRange = getRangeDtes(e, s);
                    vm.report = response.data;
                    //vm.reportGroup = _.groupBy(vm.report, 'ProductName');
                    logSuccess('הדוח נטען בהצלחה');
                    vm.tblShow = true;
                vm.isBusy(false);
            }, function (response) {
                    //error
                logError(response.status + " " + response.statusText);
                vm.isBusy(false);
                });
        }

        function getRangeDtes(sdate, edate) {
            var day;
            var between = [];
            between.push(fillterDate(sdate));

            while (edate < sdate) {
                day = sdate.getDate();
                sdate = new Date(sdate.setDate(--day));
                between.push(fillterDate(sdate));
            }
            //console.log(between);
            return between.reverse();
        }

        function fillterDate(date) {
            return $filter('date')(date, "dd-MM-yyyy");
        }

        function getCustomerRoundAmount() {
            var model = {
                ProductID: vm.productSelected.ProductID,
                RoundID: vm.roundSelected.RoundID,
                TotalAmount: vm.amount
            }

            return reportsService.checkProductAmountPerRound(model).then(function (response) {
                vm.roundProductCustomer = response.data;
                vm.totalDeliveredAmount = _.reduce(vm.roundProductCustomer, function (memo, num) { return memo + num.DeliveredAmount; }, 0);
                vm.totalAmount = _.reduce(vm.roundProductCustomer, function (memo, num) { return memo + num.Amount; }, 0);
                logSuccess("סריקת המוצר בסבב עברה בהצלחה");
            }, function (response) {
                logError(response.status + " " + response.statusText);
            });
        }

        function editRoundProductCustomer(rpc) {
            if (rpc != null) {
                vm.roundProductCustomerEdit = rpc;
                angular.element('.edit-eport-tbl .btn-success').removeAttr('disabled');
                angular.element('.edit-eport-tbl .btn-success > i').removeClass('glyphicon-saved').addClass('glyphicon-save');
            }
            else {
                logWarning("שגיאה");
            }
        }

        function savePrc() {
            if (vm.roundProductCustomerEdit.hasOwnProperty('Amount')) {
                updateProductsRound();
            }
        }

        function updateProductsRound() {
            getCustomerById(vm.roundProductCustomerEdit.CustomerRoundProduct.CustomerID).then(function(response) {
                //success
                var customer = response;
                if (customer == false) {
                    logError("שגיאה בנתוני לקוח");
                    return false;
                }
                var roundCustomers = {
                    RoundId: vm.roundSelected.RoundID,
                    RoundCustomers: [
                        {
                            customerRound: customer,
                            roundcustomerProducts: [{
                                CustomerRoundProduct: {
                                    ProductCustomerID: vm.roundProductCustomerEdit.CustomerRoundProduct.ProductCustomerID,
                                    CustomerID: vm.roundProductCustomerEdit.CustomerRoundProduct.CustomerID,
                                    ProductID: vm.roundProductCustomerEdit.CustomerRoundProduct.ProductID,
                                    dayType: vm.roundProductCustomerEdit.CustomerRoundProduct.dayType,
                                    Cost: vm.roundProductCustomerEdit.CustomerRoundProduct.Cost,
                                    ProductName: vm.roundProductCustomerEdit.CustomerRoundProduct.ProductName,
                                    CustomerName: vm.roundProductCustomerEdit.CustomerRoundProduct.CustomerName
                                },
                                RoundsCustomerProductID: vm.roundProductCustomerEdit.RoundsCustomerProductID,
                                Amount: vm.roundProductCustomerEdit.Amount,
                                DeliveredAmount: vm.roundProductCustomerEdit.DeliveredAmount
                            }]
                        }
                    ]
                }
                return managementDistributionsService.updateCustomerRound([roundCustomers]).then(function (responsedata) {
                    //success
                    logSuccess("המוצר עודכן בסבב בהצלחה");
                    angular.element('.edit-eport-tbl .btn-success > i').removeClass('glyphicon-save').addClass('glyphicon-saved');
                    angular.element('.edit-eport-tbl .btn-success').attr('disabled', 'disabled');
                        vm.getCustomerRoundAmount();
                    },
                    function (responsedata) {
                        //error
                        logError(responsedata.status + " " + responsedata.statusText);
                    });
            }, function (response) {
                //error
                logError(response.status + " " + response.statusText);
            });
           
                     
        }

        function getCustomerById(id) {
            return  reportsService.getCustomerById(id).then(function(response) {
                //success
                return response.data;
            }, function(response) {
                //errror
                logError(response.status + " " + response.statusText);
                return false;
            });
        }

        function printReport(divName) {
            print.printReport(divName);
        }
        function createDateAsUTC(date) {
            return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds()));
        }

        function convertDateToUTC(date) {
            return new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());
        }
    }
})();
