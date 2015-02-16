(function () {
    'use strict';

    var controllerId = "reports";
    angular.module('app').controller(controllerId, ['$location', '$filter', 'common', 'datacontext', 'reportsService', 'managementDistributionsService', reports]);


    function reports($location, $filter, common, datacontext, reportsService, managementDistributionsService) {
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
        vm.roundSelectedChange = roundSelectedChange;
        vm.customersRound = {};

        vm.dateFilter = new Date();
        // Disable weekend selection
        vm.disabled = function (date, mode) {
            return (mode === 'day' && (date.getDay() === 5 || date.getDay() === 6));
        };

        vm.roundFilter = {
            Today: false,
            StartDate: $filter('date')(vm.dateFilter.setDate(1), 'MM-dd-yyyy'),
            EndDate: $filter('date')(new Date(vm.dateFilter.getFullYear(), vm.dateFilter.getMonth() + 1, 0), 'MM-dd-yyyy')
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
                    $location.url('/');
                }
            });
        }

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
            if(round!=null) {
                vm.customersRound = round.custRound;
            } else {
                vm.customersRound = {};
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
})();
