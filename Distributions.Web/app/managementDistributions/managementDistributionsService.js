(function() {
    'use strict';

    var serviceId = 'managementDistributionsService';
    angular.module('app').service(serviceId, ['common', '$http', managementDistributionsService]);

    function managementDistributionsService(common, $http) {
        var $q = common.$q;

        var service = {
            getCustomers: getCustomers,
            getProductsCustomer: getProductsCustomer,
            addProductToCustomer: addProductToCustomer,
            saveProductToCustomer: saveProductToCustomer,
            getWorkers: getWorkers,
            newRound: newRound,
            addUserToRound: addUserToRound,
            addCustomerRound: addCustomerRound,
            getRounds: getRounds,
            getCustomerRounds:getCustomerRounds,
            changeRoundStatus: changeRoundStatus,
            updateRound: updateRound,
            updateCustomerRound: updateCustomerRound,
            removeProductToCustomer: removeProductToCustomer,
            deleteProductFromRound: deleteProductFromRound
        };

        return service;

        function getCustomers(id) {
            return $http.get("/GetActiveCustomers?id="+id).success(function(data) {
                    return data;
                })
                .error(function(data, status) {
                    return status;
                });
        }

        function getRounds(model) {
            return $http.post("/GetRounds", model).success(function(data) {
                    return data;
                })
                .error(function(data, status) {
                    return status;
                });
        }
        function getCustomerRounds(model) {
            return $http.post("/GetCustomerRounds", model).success(function (data) {
                    return data;
                })
                .error(function(data, status) {
                    return status;
                });
        }
        function getWorkers(id) {
            return $http.get("/GetWorkers?id="+id).success(function(data) {
                    return data;
                })
                .error(function(data, status) {
                    return status;
                });
        }

        function getProductsCustomer(customerId) {
            return $http.get("/GetProductsCustomer?customerId=" + customerId).success(function(data) {
                    return data;
                })
                .error(function(data, status) {
                    return status;
                });
        }

        function addProductToCustomer(parameters) {
            return $http.post("/AddProductsCustomer", parameters).success(function(data) {
                    return data;
                })
                .error(function(data, status) {
                    return status;
                });
        }

        function saveProductToCustomer(parameters) {
            return $http.post("/UpdateProductsCustomer", parameters).success(function(data) {
                    return data;
                })
                .error(function(data, status) {
                    return status;
                });
        }

        function newRound(round) {
            return $http.post("/NewRound", round).success(function(data) {
                    return data;
                })
                .error(function(data, status) {
                    return status;
                });
        }

        function addUserToRound(roundModel) {
            return $http.post("/AddUserToRound", roundModel).success(function(data) {
                    return data;
                })
                .error(function(data, status) {
                    return status;
                });
        }

        function addCustomerRound(roundCustomersModel) {
            return $http.post("/AddCustomerRound", roundCustomersModel).success(function(data) {
                    return data;
                })
                .error(function(data, status) {
                    return status;
                });
        }

        function changeRoundStatus(round) {
            return $http.post("/ChangeRoundStatus", round).success(function(data) {
                    return data;
                })
                .error(function(data, status) {
                    return status;
                });
        }

        function updateRound(round) {
            return $http.post("/UpdateRound", round).success(function(data) {
                    return data;
                })
                .error(function(data, status) {
                    return status;
                });
        }

        function updateCustomerRound(roundCustomersModel) {
            return $http.post("/UpdateCustomerRound", roundCustomersModel).success(function(data) {
                    return data;
                })
                .error(function(data, status) {
                    return status;
                });
        }

        function removeProductToCustomer(productCustomerId) {
            return $http.post("/RemoveProductToCustomer?productCustomerId=" + productCustomerId).success(function(data) {
                    return data;
                })
                .error(function(data, status) {
                    return status;
                });
        }

        function deleteProductFromRound(productModel) {
            return $http.post("/DeleteProductFromRound?roundId=" + productModel.roundId, productModel.product).success(function (data) {
                    return data;
                })
                .error(function(data, status) {
                    return status;
                });
        }
        
       } 
    
})();
