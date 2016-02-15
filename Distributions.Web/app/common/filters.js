(function() {
    'use strict';

    var myFilter = angular.module("myfilter", []);

    myFilter.filter('range', range);

    function range() {
        return function (input, total) {
            total = parseInt(total);
            var arr = [];
            var loop = (input.length / total);
            for (var i = 0; i < loop; i++) {
                arr.push(i);
            }

            return arr;
        };
    }

    myFilter.filter('notzerofilter', notzerofilter);

    function notzerofilter() {
        return function(products) {
            if (products.length > 0) {
                return products.map(function(product) {
                    return (product.Amount > 0 || product.DeliveredAmount > 0);
                });
            }
            
        }
    
}
})();