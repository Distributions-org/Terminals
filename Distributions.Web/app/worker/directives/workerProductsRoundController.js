(function () {
    'use strict';

    angular
        .module('app')
        .controller('workerProductsRoundController', workerProductsRoundController);

    workerProductsRoundController.$inject = ['$scope'];

    return { workerProductsRoundController: workerProductsRoundController }
    

    function workerProductsRoundController($scope) {
        /* jshint validthis:true */
        var vm = this;
        vm.title = 'workerProductsRoundController';

        activate();

        function activate() { }
        
    }

   
})();
