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

        vm.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'MM.dd.yyyy', 'dd/MM/yyyy', 'shortDate'];
        vm.format = vm.formats[3];

        // Disable weekend selection
        vm.disabled = function (date, mode) {
            return (mode === 'day' && (date.getDay() === 5 || date.getDay() === 6));
        };

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
            var promises = [isAdminRole(), getValidCustomers(), toggleMin()];
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
                    vm.report = response.data;
                    logSuccess('הדוח נטען בהצלחה');
                }, function (response) {
                    //error
                    logError(response.status + " " + response.statusText);
                });
        }
    }
})();
