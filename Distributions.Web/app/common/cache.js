(function () {
    'use strict';
    
    angular.module('common')
        .factory('cache', ['$cacheFactory', cache]);

    function cache($cacheFactory) {
        var $scopeManager = {};
        $scopeManager.keys = [];
        $scopeManager.cache = $cacheFactory('cacheId');

        var service = {
            get: get,
            put: put,
            clear: clear
        };

        return service;

        function get(key) {
            if ($scopeManager.cache.get(key) !== undefined) {
                return $scopeManager.cache.get(key);
            }
            return null;
        }

        function put(key, value) {
            if ($scopeManager.cache.get(key) === undefined) {
                $scopeManager.keys.push(key);
            }
            $scopeManager.cache.put(key, value === undefined ? null : value);
        }

        function clear(key) {
            $scopeManager.cache.remove(key);
        }
    }
})();