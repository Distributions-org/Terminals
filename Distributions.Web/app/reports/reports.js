(function () {
    'use strict';

    var controllerId = "reports";
    angular.module('app').controller(controllerId, ['$location', '$filter', 'common', 'datacontext', 'reportsService', 'managementDistributionsService', 'adminService', reports]);


    function reports($location, $filter, common, datacontext, reportsService, managementDistributionsService, adminService) {
        /* jshint validthis:true */
        //reportsService.$inject = [];

        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);
        var logSuccess = common.logger.getLogFn(controllerId, 'success');
        var logError = common.logger.getLogFn(controllerId, 'error');
        var logWarning = common.logger.getLogFn(controllerId, 'warning');
        var vm = this;
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
        vm.format = vm.formats[3];
        vm.rounds = {};
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

        vm.dateFilter = new Date();
        // Disable weekend selection
        vm.disabled = function (date, mode) {
            return (mode === 'day' && (date.getDay() === 5 || date.getDay() === 6));
        };

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
            //vm.dt = $filter('date')(date, 'MM.dd.yyyy'); // date.toLocaleDateString("he-IL"); //((date.getDate()) + '/' + (date.getMonth() + 1) + '/' + date.getFullYear());
            return $filter('date')(date, 'MM.dd.yyyy');
        };


        activate();

        function activate() {
            var promises = [isAdminRole(), getValidCustomers(), toggleMin(), getRounds()];
            common.activateController([promises], controllerId)
                .then(function () { log('מסך ' + vm.title + ' פעיל'); });
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
                vm.products = response.data;
            }
                , function (response) {
                    logError(response.status + " " + response.statusText);
                });

        };

        function getRounds() {
            return managementDistributionsService.getRounds(vm.roundFilter).then(function (response) {
                //success
                vm.rounds = response.data;
            },
                function (response) {
                    //error
                    logError(response.status + " " + response.statusText);
                });
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
            var sdate = new Date(vm.stratDate);
            var edate = new Date(vm.endDate);
            //var productsIDs = _.pluck(vm.productsCustomer, 'ProductCustomerID');
            //var cutomerId = vm.customerSelected.CustomerID;
            //var year = $filter('date')(sdate, "yyyy");
            //var month = $filter('date')(sdate, "MM");
            //var endYear = $filter('date')(edate, "yyyy");
            //var endMonth = $filter('date')(edate, "MM");

            var model = {
                ProductIDs: _.pluck(vm.productsCustomer, 'ProductCustomerID'),
                CustomerId: vm.customerSelected.CustomerID,
                Year: parseInt($filter('date')(sdate, "yyyy")),
                Month: parseInt($filter('date')(sdate, "MM")),
                EndYear: parseInt($filter('date')(edate, "yyyy")),
                EndMonth: parseInt($filter('date')(edate, "MM")),
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
                    vm.dateRange = getRangeDtes(lastDayOfMonth, new Date(sdate.setDate(1)));
                    vm.report = response.data;
                    //vm.reportGroup = _.groupBy(vm.report, 'ProductName');
                    logSuccess('הדוח נטען בהצלחה');
                    vm.tblShow = true;
                }, function (response) {
                    //error
                    logError(response.status + " " + response.statusText);
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
            console.log(between);
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
                return managementDistributionsService.updateCustomerRound(roundCustomers).then(function (responsedata) {
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
            var printContents = document.getElementById(divName).innerHTML;
            var originalContents = document.body.innerHTML;
            var params = [
        'height=' + screen.height,
        'width=' + screen.width,
        'fullscreen=yes' // only works in IE, but here for completeness
            ].join(',');
            var popupWin;
            if (navigator.userAgent.toLowerCase().indexOf('chrome') > -1) {
                popupWin = window.open('', '_blank', params + ',scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no');
                popupWin.window.focus();
                popupWin.document.write('<!DOCTYPE html><html><head>' +
                    '<link href="/content/bootstrap.min.css" rel="stylesheet">' + '<link href="/Content/bootstrap-rtl.css" rel="stylesheet"> <link href="/content/customtheme.css" rel="stylesheet">' +
                    '<link href="/content/styles.css" rel="stylesheet"> <link href="/Content/StyleSheet.min.css" rel="stylesheet">' +
                    '</head><body onload="window.print()"><div class="reward-body">' + printContents + '</div></html>');
                popupWin.onbeforeunload = function (event) {
                    popupWin.close();
                    return '.\n';
                };
                popupWin.onabort = function (event) {
                    popupWin.document.close();
                    popupWin.close();
                }
            } else {
                popupWin = window.open('', '_blank', params);
                popupWin.document.open();
                popupWin.document.write('<html><head><link href="/content/bootstrap.min.css" rel="stylesheet">' + '<link href="/Content/bootstrap-rtl.css" rel="stylesheet"> <link href="/content/customtheme.css" rel="stylesheet">' +
                    '<link href="/content/styles.css" rel="stylesheet"> <link href="/Content/StyleSheet.min.css" rel="stylesheet">' +
                    '</head><body onload="window.print()">' + printContents + '</html>');
                popupWin.document.close();
            }
            popupWin.document.close();

            return true;
        }

    }
})();
