(function () {
    'use strict';
    var controllerId = 'admin';
    angular.module('app').controller(controllerId, ['$location', 'common', 'datacontext', 'adminService', admin]);

    function admin($location, common, datacontext, adminService) {
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);
        var logSuccess = common.logger.getLogFn(controllerId, 'success');
        var logError = common.logger.getLogFn(controllerId, 'error');
        var logWarning = common.logger.getLogFn(controllerId, 'warning')
        var vm = this;
        vm.isBusy = common.serviceCallPreloader;
        vm.isAdmin=false;
        vm.title = 'תפריט ניהול - למנהל האתר';
        vm.users = {};
        vm.roles = {};
        vm.selectedRole = {};
        vm.user = {};
        vm.products = {};
        vm.product = {};
        vm.customers = {};
        vm.customer = {};
        vm.submitForm = addusersform;
        vm.submitProductsForm = addProduct;
        vm.submitCustomersForm = addCustomer;
        vm.editUser = editUser;
        vm.editProduct = editProduct;
        vm.editCustomer = editCustomer;
        vm.cancelUpdate = cancelUpdate;
        vm.cancelProductUpdate = cancelProductUpdate;
        vm.cancelCustomerUpdate = cancelCustomerUpdate;
        vm.customer.status = vm.product.status = "סטטוס לא פעיל";
        vm.product.statusChange = productStatusChange;
        vm.customer.statusChange = customerStatusChange;
       
        //vm.deletUser = deleteUser;
        activate();

        function activate() {
            var promises = [getAllUsers(), getRoles(), isAdminRole(), getProducts(),getCustomers()];
            common.activateController([promises], controllerId)
                .then(function () { log('מסך ניהול פעיל'); });
        }

        function isAdminRole() {
            return datacontext.getUserNameAndRole().then(function (response) {
                return vm.isAdmin = response.data.isAdmin;
            }).then(function () {
                if (!vm.isAdmin && $location.path() === "/admin") {
                    logError('אינך מורשה לצפות בדף זה!!!');
                    $location.url('/');
                }
            });
        }

        function getAllUsers() {
            return adminService.getUsers().then(function (data) {
                return vm.users = data;
            });

        };

        function getRoles() {
            return adminService.getRoles().then(function (data) {
                return vm.roles = data.Roles;
            });
        }

        function addusersform(isValid) {
            if (isValid) {
                vm.isBusy(true);
                var userIdToUpdate = "";
                var params = {
                    UserId: 0,
                    Email: vm.user.email,
                    Password: vm.user.password,
                    ConfirmPassword: vm.user.passwordConfirm,
                    Role: parseInt(vm.user.selectedRole),
                    FirstName: vm.user.fname,
                    LastName: vm.user.lname,
                }
                if (angular.element('form[name=userForm] #updatedUserId') && angular.element('form[name=userForm] button').data('action') == "update") {
                    userIdToUpdate = angular.element('form[name=userForm] #updatedUserId').val();
                    params.UserId = parseInt(userIdToUpdate);
                    return adminService.updateUser(params).then(function (data) {
                        logSuccess('העדכון בוצע בהצלחה!');
                        getAllUsers();
                        cancelUpdate();
                    }, function (data) {
                        logError(data.status + " " + data.statusText);
                    }).finally(function () {
                        vm.isBusy(false);
                    });
                }
                return adminService.addUser(params).then(function (data) {
                    logSuccess('המשתמש נקלט בהצלחה!');
                    getAllUsers();
                    resetUserForm();
                }, function (data) {
                    logError(data.status + " " + data.statusText);
                }).finally(function () {
                    vm.isBusy(false);
                });
            } else {
                logError('שגיאה בהזנת הנתונים!');
            }
        }

        //function deleteUser(userId) {
        //    var user = _.findWhere(vm.users, { UserId: userId });
        //    return adminService.deleteUser(user)
        //}

        function editUser(userId) {
            var user = _.findWhere(vm.users, { UserId: userId });
            if (user != null) {
                vm.user.email = user.Email;
                vm.user.fname = user.FName;
                vm.user.lname = user.LName;
                angular.element('.row.ng-hide').removeClass("ng-hide");
                angular.element('form[name=userForm] button').text("עדכן");
                angular.element('form[name=userForm] button').attr('data-action', 'update');
                angular.element('form').find('#updatedUserId').remove();
                angular.element('form[name=userForm]').append("<input type=\"hidden\" id=\"updatedUserId\" value=\"" + user.UserId + "\"/>");
                angular.element('#cancelUpdate').removeClass('hidden');
                angular.element('#addAcount').addClass('disabled');
            }
        }

        function cancelUpdate() {
            resetUserForm();
            angular.element('form[name=userForm] button').text("הוסף");
            angular.element('form[name=userForm]').find('#updatedUserId').remove();
            angular.element('form[name=userForm] button').removeAttr('data-action');
            angular.element('#cancelUpdate').addClass('hidden');
            angular.element('#addAcount').removeClass('disabled');
        }

        function resetUserForm() {
            vm.user.email = '';
            vm.user.password = '';
            vm.user.passwordConfirm = '';
            vm.user.fname = '';
            vm.user.lname = '';
        }

        function getProducts() {
            vm.isBusy(true);
            return adminService.getAllProducts().then(function(response) {
                vm.products = response.data;
                }
                , function (response) {
                    logError(response.status + " "+response.statusText);
                }).finally(function () {
                    vm.isBusy(false);
                });
            
        };

        function addProduct(isValid) {
            if(isValid){
                var params = {
                    ProductID:0,
                    ProductName: vm.product.productName,
                    ProductStatus: angular.element('#productStatus').is(':checked')?1:2
            }
            var productIdToUpdate = "";
            if (angular.element('form[name=productsForm] #updatedProductId') && angular.element('form[name=productsForm] button').data('action') == "update") {
                productIdToUpdate = angular.element('form[name=productsForm] #updatedProductId').val();
                params.ProductID = parseInt(productIdToUpdate);
                return adminService.updateProduct(params).then(function (data) {
                    logSuccess('העדכון בוצע בהצלחה!');
                    cancelProductUpdate();
                    getProducts();
                }, function (data) {
                    logError(data.status + " " + data.statusText);
                });
            }
            return adminService.addProduct(params).then(function (data) {
                logSuccess('המוצר נקלט בהצלחה!');
                resetProductForm();
                getProducts();
            }, function (data) {
                logError(data.status + " " + data.statusText);
            });
            } else {
                logError('שגיאה בהזנת הנתונים!');
            }
        }

        function editProduct(productId) {
            var product = _.findWhere(vm.products, { ProductID: productId });
            if (product != null) {
                vm.product.productName = product.ProductName;
                vm.product.status = product.productStatus == 1 ? "סטטוס פעיל" : "סטטוס לא פעיל";
                angular.element('#productStatus').attr('checked', product.productStatus == 1 ? true : false);
                angular.element('form[name=productsForm] button').text("עדכן");
                angular.element('form[name=productsForm] button').attr('data-action', 'update');
                angular.element('form[name=productsForm]').find('#updatedProductId').remove();
                angular.element('form[name=productsForm]').append("<input type=\"hidden\" id=\"updatedProductId\" value=\"" + product.ProductID + "\"/>");
                angular.element('#cancelProductUpdate').removeClass('hidden');
            }
        }

        function cancelProductUpdate() {
            resetProductForm();
            angular.element('form[name=productsForm] button').text("הוסף");
            angular.element('form[name=productsForm]').find('#updatedProductId').remove();
            angular.element('form[name=productsForm] button').removeAttr('data-action');
            angular.element('#cancelProductUpdate').addClass('hidden');
        }

        function resetProductForm() {
            vm.product.productName = '';
            vm.product.status = "סטטוס לא פעיל";
            angular.element('#productStatus').attr('checked',false);
        }

        function productStatusChange() {
            var checked = angular.element('#productStatus').is(':checked');
            if (!checked&& vm.product.productName!==undefined) {
                logWarning('המוצר לא פעיל!!!')
            }
        }


        function getCustomers() {
            vm.isBusy(true);
            return adminService.getAllCustomers().then(function (response) {
                vm.customers = response.data;
            }
                , function (response) {
                    logError(response.status + " " + response.statusText);
                }).finally(function() {
                vm.isBusy(false);
            });

        };

        function addCustomer(isValid) {
            vm.isBusy(true);
            if (isValid) {
                var params = {
                    CustomerID: 0,
                    CustomerName: vm.customer.customerName,
                    CustomerHP: vm.customer.customerHP,
                    custStatus: angular.element('#customerStatus').is(':checked') ? 1 : 2
                }
                var customerIdToUpdate = "";
                if (angular.element('form[name=customersForm] #updatedCustomerId') && angular.element('form[name=customersForm] button').data('action') == "update") {
                    customerIdToUpdate = angular.element('form[name=customersForm] #updatedCustomerId').val();
                    params.CustomerID = parseInt(customerIdToUpdate);
                    return adminService.updateCustomer(params).then(function (data) {
                        logSuccess('העדכון בוצע בהצלחה!');
                        cancelCustomerUpdate();
                        getCustomers();
                    }, function (data) {
                        logError(data.status + " " + data.statusText);
                    }).finally(function () {
                        vm.isBusy(false);
                    });
                }
                return adminService.addCustomer(params).then(function (data) {
                    logSuccess('הלקוח נקלט בהצלחה!');
                    resetCustomerForm();
                    getCustomers();
                }, function (data) {
                    logError(data.status + " " + data.statusText);
                }).finally(function () {
                    vm.isBusy(false);
                });
            } else {
                logError('שגיאה בהזנת הנתונים!');
            }
        }

        function editCustomer(customerId) {
            var customer = _.findWhere(vm.customers, { CustomerID: customerId });
            if (customer != null) {
                vm.customer.customerName = customer.CustomerName;
                vm.customer.customerHP = customer.CustomerHP;
                vm.customer.status = customer.custStatus == 1 ? "סטטוס פעיל" : "סטטוס לא פעיל";
                angular.element('#customerStatus').attr('checked', customer.custStatus == 1 ? true : false);
                angular.element('form[name=customersForm] button').text("עדכן");
                angular.element('form[name=customersForm] button').attr('data-action', 'update');
                angular.element('form[name=customersForm]').find('#updatedCustomerId').remove();
                angular.element('form[name=customersForm]').append("<input type=\"hidden\" id=\"updatedCustomerId\" value=\"" + customer.CustomerID + "\"/>");
                angular.element('#cancelCustomerUpdate').removeClass('hidden');
            }
        }

        function cancelCustomerUpdate() {
            resetCustomerForm();
            angular.element('form[name=customersForm] button').text("הוסף");
            angular.element('form[name=customersForm]').find('#updatedCustomerId').remove();
            angular.element('form[name=customersForm] button').removeAttr('data-action');
            angular.element('#cancelCustomerUpdate').addClass('hidden');
        }

        function customerStatusChange() {
            var checked = angular.element('#customerStatus').is(':checked');
            if (!checked && vm.customer.customerName !== undefined) {
                logWarning('הלקוח לא פעיל!!!')
            }
        }

        function resetCustomerForm() {
            vm.customer.customerName = '';
            vm.customer.customerHP = '';
            vm.customer.status = "סטטוס לא פעיל";
            angular.element('#customerStatus').attr('checked', false);
        }
    }


}
)();