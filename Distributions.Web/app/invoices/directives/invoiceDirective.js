(function () {
    'use strict';

    angular
        .module('app')
        .directive('invoice', invoiceDirective);

    invoiceDirective.$inject = ['$filter', 'managementDistributionsService', 'cache', 'datacontext', 'common'];

    function invoiceDirective($filter, managementDistributionsService, cache, datacontext, common) {

        var directive = {
            restrict: 'EA',
            templateUrl: "/app/invoices/directives/invoice.html",
            controller: ['$scope',invoiceCtrl],
            controllerAs: 'vm',
            scope: {
                results: '=',
                manager: '=',
                details:'='
            },
            bindToController: true

        };
        return directive;

        function invoiceCtrl($scope) {
            var vm = this;
            vm.startDate = Date.now();
            vm.endDate = Date.now();
            vm.customers = {};
            vm.customerSelected = {};
            vm.customerSelectedChange = customerSelected;
            vm.filterRoundDate = filterRoundDate;

            active();

            function active() {
                isAdminRole().then(function () {
                    getManagerDetails();
                }).then(function () {
                    getValidCustomers();
                });

            }

            function getValidCustomers() {
                return managementDistributionsService.getCustomers(cache.get('managerId')).then(function (response) {
                    return vm.customers = response.data;
                }, function (response) {
                    $scope.$parent.vm.logError(response.status + " " + response.statusText);
                });
            }

            function customerSelected(selected) {
                if (selected != null) {

                }
            }

            function filterRoundDate() {
                //var today = new Date();
                //var tomorrow = new Date();
                //tomorrow.setDate(today.getDate() + 1);
                $scope.$parent.vm.isBusy(true);
                vm.roundFilter = {
                    Today: false,
                    StartDate: $filter('date')(vm.startDate, 'MM-dd-yyyy'),
                    EndDate: $filter('date')(vm.endDate, 'MM-dd-yyyy'),
                    ManagerId: cache.get('managerId'),
                    CustomerId: (vm.customerSelected != null && vm.customerSelected.CustomerID) ? vm.customerSelected.CustomerID : 0
                };
                getRounds();
            }

            function getRounds() {
               
                vm.results = [];
                return managementDistributionsService.getCustomerRounds(vm.roundFilter).then(function (response) {
                    //success
                    vm.results = response.data;
                    vm.details= {
                        startDate: vm.roundFilter.StartDate,
                        endDate: vm.roundFilter.EndDate,
                        customerSelected: (vm.customerSelected != null && vm.customerSelected.CustomerID)
                    }
                },
                    function (response) {
                        //error
                        $scope.$parent.vm.logError(response.status + " " + response.statusText);
                    }).finally(function () {
                        $scope.$parent.vm.isBusy(false);
                    });
            }

            function getManagerDetails() {
                common.getManagerDetails(cache.get('managerId')).then(function (data) {
                    vm.managerDetails = data;
                }).then(function () {
                    vm.manager = getManager();
                });
            }

            function getManager() {
                return {
                    SoleProprietorship: vm.managerDetails.ManagerHP,
                    tel: vm.managerDetails.ManagerPhone,
                    phone: vm.managerDetails.ManagerPhone2,
                    address: vm.managerDetails.ManagerAddress,
                    name: vm.managerDetails.ManagerName
                }
            }

            function isAdminRole() {
                return datacontext.getUserNameAndRole().then(function (response) {
                    var cacheTemp = cache.get('managerId');
                    if (!cacheTemp) {
                        cache.clear('managerId');
                        cache.put('managerId', response.data.managerId);
                    }
                    return vm.isAdmin = response.data.isAdmin;
                }).then(function () {
                    if (!vm.isAdmin && $location.path() === "/invoices") {
                        logError('אינך מורשה לצפות בדף זה!!!');
                        $location.url('/worker');
                    }
                });
            }
        }
    }

})();