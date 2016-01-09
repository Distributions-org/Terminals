(function () {
    'use strict';

    var controllerId = "invoices";
    angular
        .module('app')
        .controller(controllerId, invoices);

    invoices.$inject = ['common','print'];

    function invoices(common, print) {
        /* jshint validthis:true */
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);
        
        var vm = this;
        vm.results = [];
        vm.manager = {};
        vm.localDate = new Date();
        vm.printInvoices = printInvoices;
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

       
        function printInvoices() {
            setTimeout(function () {
                print.printReport('invoices');
            }, 1000);
        }
    }
})();
