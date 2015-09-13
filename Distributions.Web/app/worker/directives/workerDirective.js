(function () {
    'use strict';

    angular
       .module('app')
       .directive('workerProductsRound', workerProductsRound);

    workerProductsRound.$inject = ['$window'];

    function workerProductsRound($window) {
        // Usage:
        //     <workerDirective></workerDirective>
        // Creates:
        // 
        var directive = {
            link: link,
            restrict: 'EA',
            scope: {
                rounds:'=rounds'
            },
            templateUrl: '/app/worker/directives/worker-products-round.html',
            controller: workerProductsRoundController,
            controllerAs: 'vm',
            bindToController: true // because the scope is isolated
        };
        return directive;

        function link(scope, element, attrs) {
        }
    }

   

    function workerProductsRoundController() {
        /* jshint validthis:true */
        var vm = this;
       
        vm.productChange = productChange;
        vm.roundChange = roundChange;
        vm.productsInRound = [];
        vm.roundSelected = {};
        
        function gerProductsRound() {
            _.each(vm.roundSelected.custRound, function (custRound) {
                    _.each(custRound.roundcustomerProducts, function (product) {
                        vm.productsInRound.push({
                            id: product.CustomerRoundProduct.ProductID,
                            productName: product.CustomerRoundProduct.ProductName,
                            amount: product.Amount,
                            deliveredAmount: product.DeliveredAmount,
                            customerName: product.CustomerRoundProduct.CustomerName
                        });
                    });
                });
            
        }

        function roundChange(roundSelected) {
            if (roundSelected != undefined) {
                gerProductsRound();
            }
            else {
                vm.productsFiltterInRound = [];
                vm.productsInRound = [];
            }
        }

        function productChange(product) {
            if (product != undefined) {
                vm.productsFiltterInRound = _.filter(vm.productsInRound, function (pir) {
                    return pir.id == product.id;
                });
                getAmount();
                getDeliveredAmount();
            } else {
                vm.productsFiltterInRound = [];
            }
        }

        function getAmount() {
            vm.totalAmount = _.reduce(vm.productsFiltterInRound, function (memo, product) {
                return parseInt(memo) + parseInt(product.amount);
            }, 0);
        }

        function getDeliveredAmount() {
            vm.totalDeliveredAmount = _.reduce(vm.productsFiltterInRound, function (memo, product) {
                return parseInt(memo) + parseInt(product.deliveredAmount);
            }, 0);
        }
    }

})();