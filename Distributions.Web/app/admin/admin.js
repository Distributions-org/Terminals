(function () {
    'use strict';
    var controllerId = 'admin';
    angular.module('app').controller(controllerId, ['$location', 'common', 'datacontext', 'adminService', admin]);

    function admin($location, common, datacontext, adminService) {
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);
        var logSuccess = common.logger.getLogFn(controllerId, 'success');
        var logError = common.logger.getLogFn(controllerId, 'error');
        var vm = this;
        vm.isAdmin=false;
        vm.title = 'תפריט ניהול - למנהל האתר';
        vm.users = {};
        vm.roles = {};
        vm.selectedRole = {};
        vm.user = {};
        vm.product = {};
        vm.submitForm = addusersform;
        vm.products = {};
        vm.searchText = "";
        vm.editUser = editUser;
        vm.cancelUpdate = cancelUpdate;
        vm.submitProductsForm = addProduct;
        //vm.deletUser = deleteUser;
        activate();

        function activate() {
            var promises = [getAllUsers(), getRoles(), isAdminRole(), getProducts()];
            common.activateController([promises], controllerId)
                .then(function () { log('Activated Admin View'); });
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
                    });
                }
                return adminService.addUser(params).then(function (data) {
                    logSuccess('המשתמש נקלט בהצלחה!');
                    getAllUsers();
                    resetUserForm();
                }, function (data) {
                    logError(data.status + " " + data.statusText);
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
            angular.element('form').find('#updatedUserId').remove();
            angular.element('form button').removeAttr('data-action');
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
            vm.products = adminService.getAllProducts();
        };

        function addProduct(isValid) {
            if(isValid){
            var params= {
                ProductName: vm.product.productName,
                Status: vm.product.status
            }
            var productIdToUpdate = "";
            if (angular.element('form[name=productsForm] #updatedProductId') && angular.element('form[name=productsForm] button').data('action') == "update") {
                productIdToUpdate = angular.element('form[name=productsForm] #updatedProductId').val();
                params.ProductId = parseInt(productIdToUpdate);
                return adminService.updateProduct(params).then(function (data) {
                    logSuccess('העדכון בוצע בהצלחה!');
                    getProducts();
                }, function (data) {
                    logError(data.status + " " + data.statusText);
                });
            }
            return adminService.addUser(params).then(function (data) {
                logSuccess('המוצר נקלט בהצלחה!');
                getProducts();
            }, function (data) {
                logError(data.status + " " + data.statusText);
            });
            } else {
                logError('שגיאה בהזנת הנתונים!');
            }
        }

        function editProduct(productId) {
            var product = _.findWhere(vm.products, { ProductId: productId });
            if (product != null) {
                vm.product.productName = product.ProductName;
                vm.product.status = product.Status;
                angular.element('form[name=productsForm] button').text("עדכן");
                angular.element('form[name=productsForm] button').attr('data-action', 'update');
                angular.element('form[name=productsForm]').find('#updatedProductId').remove();
                angular.element('form[name=productsForm]').append("<input type=\"hidden\" id=\"updatedProductId\" value=\"" + product.ProductId + "\"/>");
                angular.element('#cancelProductUpdate').removeClass('hidden');
            }
        }
    }


}
)();