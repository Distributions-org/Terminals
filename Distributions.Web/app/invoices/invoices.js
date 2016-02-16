(function () {
    'use strict';

    var controllerId = "invoices";
    angular
        .module('app')
        .controller(controllerId, invoices);

    invoices.$inject = ['common', 'print', '$filter'];

    function invoices(common, print, $filter) {
        /* jshint validthis:true */
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);

        var vm = this;
        vm.results = [];
        vm.manager = {};
        vm.localDate = new Date();
        vm.printInvoices = printInvoices;
        vm.checkAmount = checkAmount;
        vm.showInvoicenumbers = invoiceNumbers;
        vm.productsPrint = [];
        vm.invoicesNum = [];
        vm.hide = false;
        vm.logSuccess = common.logger.getLogFn(controllerId, 'success');
        vm.logError = common.logger.getLogFn(controllerId, 'error');
        vm.logWarning = common.logger.getLogFn(controllerId, 'warning');
        vm.isBusy = common.serviceCallPreloader;
        vm.title = 'invoices';

        activate();

        function activate() {
            var promises = [];
            common.activateController([promises], controllerId)
                .then(function () { log('מסך חשבוניות פעיל'); }).then(function () { vm.isBusy(false); });
        }

        function checkAmount(customerRoundProducts) {
            var result = false;
            _.each(customerRoundProducts.roundcustomerProducts,function (item,index) {
                if (item.Amount > 0 || item.DeliveredAmount > 0) {
                    result = true;
                }
            });
            return result;
        }

        function invoiceNumbers() {
            if (vm.results.length > 0) {
                vm.invoicesNum = [];
             _.map(vm.results, function(item) {
                 vm.invoicesNum.push(
                 {
                     num: item.RoundId + item.customerRound.CustomerID,
                     customerName: item.customerRound.CustomerName + ' ח.פ. - ' + item.customerRound.CustomerHP,
                     date: $filter('date')(item.RoundDate, 'dd-MM-yyyy')
                 });
             });

                vm.details.startDate = $filter('date')(new Date(vm.details.startDate), 'dd-MM-yyyy');
                vm.details.endDate = $filter('date')(new Date(vm.details.endDate), 'dd-MM-yyyy');

             setTimeout(function () {
                 print.printReport('invoicesNumbers');
             }, 1000);

            }
        }

        function printInvoices() {
            _.each(vm.results, function (item) {
                var tmp = angular.copy(item);
                tmp.roundcustomerProducts = [];
                _.filter(item.roundcustomerProducts, function (product) {
                    if (product.Amount > 0 || product.DeliveredAmount > 0) {
                        tmp.roundcustomerProducts.push(product);
                    }
                });
                vm.productsPrint.push(tmp);
            });

            setTimeout(function () {
                print.printReport('invoices');
            }, 1000);
        }


    }
})();
