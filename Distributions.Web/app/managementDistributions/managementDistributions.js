(function () {
    'use strict';
    var controllerId = 'managementDistributions';
    angular.module('app').controller(controllerId, ['$location', 'common', 'datacontext', 'managementDistributionsService', 'adminService', managementDistributions]);

    function managementDistributions($location, common, datacontext, managementDistributionsService, adminService) {
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);
        var logSuccess = common.logger.getLogFn(controllerId, 'success');
        var logError = common.logger.getLogFn(controllerId, 'error');
        var vm = this;
        vm.isAdmin = false;
        vm.title = 'ניהול מוצרים ללקוח';
        vm.customers = {};
        vm.customerSelected = {};
        vm.customerSelectedChange = customerSelected;
        vm.update = false;
        vm.products = {};
        vm.productsCustomer = {};
        vm.addProductToCustomer = addProductToCustomer;
        vm.saveProductToCustomer = saveProductToCustomer;
        vm.workers = {};
        vm.customerRoundSelectedChange = customerRoundSelected;

        ////date picker

        //vm.today=today();

        //// Disable weekend selection
        //vm.disabled = function (date, mode) {
        //    return (mode === 'day' && (date.getDay() === 0 || date.getDay() === 6));
        //};

        //vm.open = function ($event) {
        //    $event.preventDefault();
        //    $event.stopPropagation();

        //    vm.opened = true;
        //};

        //vm.dateOptions = {
        //    formatYear: 'yyyy',
        //    startingDay: 1,
        //};

        //vm.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'dd/MM/yyyy', 'shortDate'];
        //vm.format = vm.formats[3];

        //vm.gridOptions = {
        //    columnDefs: [
        //     { name: 'id', enableCellEdit: false, width: '10%' },
        //     { name: 'firstname', displayName: 'Name (editable)', width: '20%' },
        //     { name: 'company', enableCellEdit: true },
        //    { name: 'project' }
        //    ],
        //    //exporterLinkLabel: 'get your csv here',
        //    exporterPdfDefaultStyle: { fontSize: 9 },
        //    exporterPdfTableStyle: { margin: [30, 30, 30, 30] },
        //    exporterPdfTableHeaderStyle: { fontSize: 12, bold: true, italics: true, color: 'red' },
        //    exporterPdfHeader: { text: "My Header", style: 'headerStyle' },
        //    //exporterPdfFooter: function (currentPage, pageCount) {
        //    //   return { text: currentPage.toString() + ' of ' + pageCount.toString(), style: 'footerStyle' };
        //    //},
        //    exporterPdfCustomFormatter: function (docDefinition) {
        //        docDefinition.styles.headerStyle = { fontSize: 22, bold: true };
        //        docDefinition.styles.footerStyle = { fontSize: 10, bold: true };
        //        return docDefinition;
        //    },
        //    //exporterPdfOrientation: 'portrait',
        //    //exporterPdfPageSize: 'LETTER',
        //    //exporterPdfMaxGridWidth: 500,
        //    exporterCsvLinkElement: angular.element(document.querySelectorAll(".custom-csv-link-location")),
        //    enableFiltering: true,
        //    showFooter: true,
        //    exporterMenuCsv: false,
        //    enableGridMenu: true,
        //    data:[
        //    {
        //        "id": "1",
        //        "firstname": "Misko",
        //        "lastname": "Havery",
        //        "company": "Google",
        //        "project": "AngularJS"
        //    }, {
        //        "id": "2",
        //        "firstname": "Srini",
        //        "lastname": "Kusunam",
        //        "company": "LibertyLeap",
        //        "project": "Backbone.Paginator"
        //    }, {
        //        "id": "3",
        //        "firstname": "Derick",
        //        "lastname": "Bailey",
        //        "company": "Muted Solutions",
        //        "project": "Backbone.Marionette"
        //    }
        //    ]
        //};


        activate();

        function activate() {
            var promises = [isAdminRole(), getValidCustomers(), getProducts(), getWorkers(), init()];
            common.activateController([promises], controllerId)
                .then(function () { log('Activated Management Distributions View'); });
        }

        function init() {
            $('#timepicker').timepicker({
                minuteStep: 5,
                showInputs: true,
                disableFocus: false
            });
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

        function getWorkers() {
            return managementDistributionsService.getWorkers().then(function (response) {
                //success
                    vm.workers = response.data;
                },
                function (response) {
                    //error
                    logError(response.status + " " + response.statusText);
                });
        }

        function getValidCustomers() {
            return managementDistributionsService.getCustomers().then(function (result) {
                return vm.customers = result.data;
            }, function (status) {
                logError(status);
            });
        }

        function getProducts() {
            return adminService.getAllProducts().then(function (response) {
                vm.products = _.where(response.data, { productStatus: 1 });
            }
                , function (response) {
                    logError(response.status + " " + response.statusText);
                });

        };

        function customerSelected(selected) {
            if (selected != null) {
                return managementDistributionsService.getProductsCustomer(selected.CustomerID).then(function (response) {
                    //success

                    vm.productsCustomer = response.data;
                    vm.update = true;

                },
                 function (response) {
                     //error
                     logError(response.status + " " + response.statusText);
                 });

            }
            else {
                vm.update = false;
                return null;
            }
        }

        function customerRoundSelected(selected) {
            
        }

        function addProductToCustomer(productId) {
            var product = _.findWhere(vm.products, { ProductID: productId });
            if (_.findWhere(vm.productsCustomer, { ProductID: productId }) !== undefined) {
                logError("המוצר קיים!!!");
                return false;
            }
            if (product != null) {
                var productTocustomer = {
                    ProductCustomerID: 0,
                    CustomerID: vm.customerSelected.CustomerID,
                    ProductID: product.ProductID,
                    dayType: 1,
                    Cost: 0,
                    ProductName: product.ProductName,
                    CustomerName: vm.customerSelected.CustomerName
                }
                return managementDistributionsService.addProductToCustomer(productTocustomer).then(
                    function (response) {
                        //success
                        logSuccess("המוצר התווסף בהצלחה!");
                        customerSelected(vm.customerSelected);
                    },
                    function (response) {
                        //error
                        logError(response.status + " " + response.statusText);
                    });
            }
            logError("שגיאה בלתי צפוייה!");
            return null;

        }

        function saveProductToCustomer(product) {
            if (product !== undefined) {
                return managementDistributionsService.saveProductToCustomer(product).then(function (response) {
                    //success
                    logSuccess("המוצר נשמר בהצלחה!");
                },
                    function (response) {
                        //error
                        logError(response.status + " " + response.statusText);
                    });
            } else {
                logError("חלה שגיאה במהלך הפעולה!");
                return false;
            }
        }
        //function today() {
        //    var date = new Date();
        //    vm.dt = ((date.getDate()) + '/' + (date.getMonth() + 1) + '/' + date.getFullYear());
        //};
        //function generateRandomItem(id) {

        //    var firstname = firstnames[Math.floor(Math.random() * 3)];
        //    var lastname = lastnames[Math.floor(Math.random() * 3)];
        //    var birthdate = dates[Math.floor(Math.random() * 3)];
        //    var balance = Math.floor(Math.random() * 2000);

        //    return {
        //        id: id,
        //        firstName: firstname,
        //        lastName: lastname,
        //        birthDate: new Date(birthdate),
        //        balance: balance
        //    }
        //}

        //vm.rowCollection = [];
        //vm.itemsByPage = 15;

        //for (id; id < 100; id++) {
        //    vm.rowCollection.push(generateRandomItem(id));

        //}

        ////copy the references (you could clone ie angular.copy but then have to go through a dirty checking for the matches)
        //vm.displayedCollection = [].concat(vm.rowCollection);

        ////add to the real data holder
        //vm.addRandomItem = function addRandomItem() {
        //    vm.rowCollection.push(generateRandomItem(id));
        //    id++;
        //};

        ////remove to the real data holder
        //vm.removeItem = function removeItem(row) {
        //    var index = vm.rowCollection.indexOf(row);
        //    if (index !== -1) {
        //        vm.rowCollection.splice(index, 1);
        //    }
        //}
    }

}
)();