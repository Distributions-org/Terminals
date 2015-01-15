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
        vm.title = 'Admin';
        vm.users = {};
        vm.roles = {};
        vm.selectedRole = {};
        vm.user = {};
        vm.submitForm = addusersform;
        vm.products = {};
        vm.searchText = "";
        vm.editUser = editUser;
        vm.cancelUpdate = cancelUpdate;
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
                var params = {
                    Email: vm.user.email,
                    Password: vm.user.password,
                    ConfirmPassword: vm.user.passwordConfirm,
                    Role: parseInt(vm.user.selectedRole),
                    FirstName: vm.user.fname,
                    LastName: vm.user.lname,
                }
                return adminService.addUser(params).then(function (data) {
                    logSuccess('המשתמש נקלט בהצלחה!');
                    getAllUsers();
                    vm.user.email = '';
                    vm.user.password = '';
                    vm.user.passwordConfirm = '';
                    vm.user.fname = '';
                    vm.user.lname = '';
                }, function (data) {
                    logError(data.status + " " + data.statusText);
                });
            } else {
                logError('שגיאה בהזנת הנתונים!');
            }
        }

        function getProducts() {
            vm.products = adminService.getAllProducts();
        };

        function editUser(userId) {
            var user = _.findWhere(vm.users, { UserId: userId });
            if (user != null) {
                vm.user.email = user.Email;
                vm.user.fname = user.FName;
                vm.user.lname = user.LName;
                angular.element('.row.ng-hide').removeClass("ng-hide");
                angular.element('form button').text("עדכן");
                angular.element('form button').attr('data-action', 'update');
                angular.element('form').find('#userId').remove();
                angular.element('form').append("<input type=\"hidden\" id=\"userId\" value=\"" + user.UserId + "\"/>");
                angular.element('#cancelUpdate').removeClass('hidden');
                angular.element('#addAcount').addClass('disabled'); 
            }
        }

        function cancelUpdate() {
            vm.user.email = '';
            vm.user.password = '';
            vm.user.passwordConfirm = '';
            vm.user.fname = '';
            vm.user.lname = '';
            angular.element('form button').text("הוסף");
            angular.element('form').find('#userId').remove();
            angular.element('form button').removeAttr('data-action');
            angular.element('#cancelUpdate').addClass('hidden');
            angular.element('#addAcount').removeClass('disabled');
        }
    }


}
)();