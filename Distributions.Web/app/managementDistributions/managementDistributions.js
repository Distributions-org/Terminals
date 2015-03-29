(function () {
    'use strict';
    var controllerId = 'managementDistributions';
    angular.module('app').controller(controllerId, ['$location', '$filter', 'common', 'datacontext', 'managementDistributionsService', 'adminService', managementDistributions]);

    function managementDistributions($location, $filter, common, datacontext, managementDistributionsService, adminService) {
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);
        var logSuccess = common.logger.getLogFn(controllerId, 'success');
        var logError = common.logger.getLogFn(controllerId, 'error');
        var logWarning = common.logger.getLogFn(controllerId, 'warning');
        var vm = this;
        vm.isBusy = common.serviceCallPreloader;
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
        vm.workerSelected = {};
        vm.customerRoundSelectedChange = customerRoundSelected;
        vm.customerRoundSelected = {};
        vm.productsRoundCustomer = {};
        vm.dt = new Date();
        vm.stratDate = today();
        vm.endDate = today();
        vm.filterRoundDate = filterRoundDate;
        vm.productsRoundCustomerSelected = [];
        vm.addProductToRound = addProductToRound;
        vm.time = "";
        vm.removeProductRoundCustomer = removeProductRoundCustomer;
        vm.saveRound = saveRound;
        vm.roundName = "";
        vm.rounds = {};
        vm.round = {};
        vm.createRound = createNewRound;
        vm.customersRoundShow = false;
        vm.resetRound = resetRound;
        vm.roundId = 0;
        vm.roundStatusChange = roundStatusChange;
        vm.editRound = editRound;
        vm.roundBtnUpdateShow = false;
        vm.updateProductsRound = updateProductsRound;
        vm.removeProductToCustomer = removeProductToCustomer;
        vm.copyRound = copyRound;
        vm.roundFilter = {
            Today: true,
            StartDate: null,
            EndDate: null
        }
        vm.productValueSelected = productValueSelected;
        vm.btnAddPruduct = true;
        vm.activeProductsNoAmount = false;
        vm.activeChecked = activeChecked;
        var tempproductsRoundCustomerSelected = [];

        ////date picker

        vm.today = today();

        vm.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'MM.dd.yyyy', 'dd/MM/yyyy', 'shortDate'];
        vm.format = vm.formats[3];

        // Disable weekend selection
        vm.disabled = function (date, mode) {
            return false; //(mode === 'day' && (date.getDay() === 5 || date.getDay() === 6));
        };

        vm.open = function ($event) {
            $event.preventDefault();
            $event.stopPropagation();

            vm.opened = true;
        };

        vm.dateOptions = {
            formatYear: 'yyyy',
            startingDay: 1,
        };

        function toggleMin() {
            vm.minDate = (vm.minDate) ? null : new Date();
        };

        function productValueSelected() {
            if (vm.productRoundSelected!=undefined) {
                vm.btnAddPruduct = false;
            } else {
                vm.btnAddPruduct = true;
            }
        }

        function activeChecked() {
            if (tempproductsRoundCustomerSelected.length == 0) {
                tempproductsRoundCustomerSelected = _.clone(vm.productsRoundCustomerSelected);
            }
            var tmp=[];
            if (vm.activeProductsNoAmount) {
                $filter('filter')(tempproductsRoundCustomerSelected, function (value, index) {
                    if (value.Amount > 0) {
                        tmp.push(value);
                    }
                    vm.productsRoundCustomerSelected = tmp;
                });
            }
            else {
                vm.productsRoundCustomerSelected = tempproductsRoundCustomerSelected;
            }
        }
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
            var promises = [isAdminRole(), getValidCustomers(), getProducts(), getWorkers(), getRounds(), toggleMin(), init()];
            common.activateController([promises], controllerId)
                .then(function () {
                    log('מסך ניהול הפצות פעיל');
                }).then(function () { vm.isBusy(true); });
        }

        function init() {
            $('#timepicker').timepicker({
                minuteStep: 5,
                showInputs: true,
                disableFocus: false,
                showMeridian: false
            });
            $('#timepicker').timepicker('setTime', new Date());
            vm.time = $('#timepicker').val();
        }

        function filterRoundDate() {
            vm.isBusy(true);
            vm.roundFilter = {
                Today: false,
                StartDate: $filter('date')(vm.stratDate, 'MM-dd-yyyy'),
                EndDate: $filter('date')(vm.endDate, 'MM-dd-yyyy')
            }
            getRounds();
        }

        function getRounds() {
            return managementDistributionsService.getRounds(vm.roundFilter).then(function (response) {
                //success
                vm.rounds = response.data;
                    vm.isBusy(false);
                },
                function (response) {
                    //error
                    if (response.status == 403) {
                        logError("לא נמצאו סבבים לתאריך המבוקש");
                        vm.isBusy(false);

                    } else {
                        logError(response.status + " " + response.statusText);
                    }
                }).then(function() {
                    vm.isBusy(false);
            });
        }

        function isAdminRole() {
            return datacontext.getUserNameAndRole().then(function (response) {
                return vm.isAdmin = response.data.isAdmin;
            }).then(function () {
                if (!vm.isAdmin && $location.path() === "/managementDistributions") {
                    logError('אינך מורשה לצפות בדף זה!!!');
                    $location.url('/worker');
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
            return managementDistributionsService.getCustomers().then(function (response) {
                return vm.customers = response.data;
            }, function (response) {
                logError(response.status + " " + response.statusText);
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

        function addProductToRound(product) {
            var p = _.findWhere(vm.productsRoundCustomerSelected, { ProductID: product.ProductID, CustomerID: product.CustomerID });
            if (p !== undefined) {
                logError("המוצר קיים!");
                return;
            }
            product.Amount = 0;
            vm.productsRoundCustomerSelected.unshift(product);
        }

        function removeProductRoundCustomer(product) {
            if (vm.roundId != 0 && vm.roundBtnUpdateShow) {
                managementDistributionsService.deleteProductFromRound({ product: product, roundId: vm.roundId }).then(function (response) {
                    //success  
                    logWarning("המוצר נמחק מהסבב בהצלחה");
                        getRounds();
                        vm.productsRoundCustomerSelected = _.without(vm.productsRoundCustomerSelected, product);
                        tempproductsRoundCustomerSelected = vm.productsRoundCustomerSelected;
                    },
                    function (response) {
                        vm.productsRoundCustomerSelected = _.without(vm.productsRoundCustomerSelected, product);
                        logWarning("המוצר נמחק מהסבב בהצלחה");
                        tempproductsRoundCustomerSelected = vm.productsRoundCustomerSelected;
                        //logError(response.status + " " + response.statusText);
                        return;
                    });
            } else {
                vm.productsRoundCustomerSelected = _.without(vm.productsRoundCustomerSelected, product);
                tempproductsRoundCustomerSelected = vm.productsRoundCustomerSelected;
            }
        }

        function customerRoundSelected(selected) {
            if (selected != null) {
                return managementDistributionsService.getProductsCustomer(selected.CustomerID).then(function (response) {
                    //success
                    //vm.productsRoundCustomerSelected = [];
                    vm.productRoundSelected = {};
                    tempproductsRoundCustomerSelected = [];
                    vm.productsRoundCustomer = response.data;
                    if (!vm.roundBtnUpdateShow) {
                    _.each(response.data, function (product) {
                        var productTmp = _.findWhere(vm.productsRoundCustomerSelected, { ProductID: product.ProductID, CustomerID: product.CustomerID });
                        if (productTmp === undefined) {
                            product.Amount = 0;
                            vm.productsRoundCustomerSelected.unshift(product);
                        }
                    });
                    }

                },
              function (response) {
                  //error
                  logError(response.status + " " + response.statusText);
              });

            }
            else {
                return null;
            }
        }


        function addProductToCustomer(productId) {
            tempproductsRoundCustomerSelected = [];
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

        function today() {
            var date = new Date();
            vm.dt = $filter('date')(date, 'MM.dd.yyyy'); // date.toLocaleDateString("he-IL"); //((date.getDate()) + '/' + (date.getMonth() + 1) + '/' + date.getFullYear());
            return $filter('date')(date, 'MM.dd.yyyy');
        };

        function createNewRound() {
            var round = {
                RoundName: vm.roundName,
                RoundDate: getRoundDate()
            }
            return managementDistributionsService.newRound(round).then(function (response) {
                //success
                logSuccess("הסבב נוצר בהצלחה!");
                vm.roundId = response.data;
                addUserToRound(vm.roundId);

            }, function (response) {
                //error
                logError(response.status + " " + response.statusText);
                resetRound();
            });
        }

        function addUserToRound(roundId) {
            var roundModel = {
                RoundId: roundId,
                RoundUser: [vm.workerSelected]
            }
            return managementDistributionsService.addUserToRound(roundModel).then(function (response) {
                //success
                logSuccess("המפיץ שוייך לסבב בהצלחה.");
                vm.customersRoundShow = true;

            }, function (response) {
                //error
                logError(response.status + " " + response.statusText);
            });
        }


        function saveRound() {
            vm.activeProductsNoAmount = false;
            activeChecked();
            var productsRoundCustomerGroping = _.toArray(_.groupBy(_.filter(vm.productsRoundCustomerSelected, function(product) {
                return  product.Amount !== undefined;
            }), 'CustomerID'));

            productsRoundCustomerGroping = _.sortBy(productsRoundCustomerGroping, function(p) {
              return   Number(p[0].$$hashKey.replace("object:", ""));
            });
            var productsRoundCustomernew = [];
            _.each(productsRoundCustomerGroping, function(productsRoundCustomer) {
                var roundCustomers = {
                    RoundId: vm.roundId,
                    RoundCustomers: [
                        {
                            customerRound: _.findWhere(vm.customers, { CustomerID: productsRoundCustomer[0].CustomerID }),
                            roundcustomerProducts: createRoundcustomerProducts(productsRoundCustomer)
                        }
                    ]
                }
                productsRoundCustomernew.push(roundCustomers);
            });
            return managementDistributionsService.addCustomerRound(productsRoundCustomernew).then(function (response) {
                //success
                if (response != "") {
                    logSuccess("הסבב נוצר בהצלחה:" + " " + response.data);
                    getRounds();
                    resetRound();
                } else {
                    logWarning("שגיאה !!!");
                }
                    },
                        function (response) {
                            //error
                            logError(response.status + " " + response.statusText);
                        }
                    );
        }
            //_.each(productsRoundCustomerGroping, function (productsRoundCustomer) {
            //    var roundCustomers = {
            //        RoundId: vm.roundId,
            //        RoundCustomers: [
            //            {
            //                customerRound: _.findWhere(vm.customers, { CustomerID: productsRoundCustomer[0].CustomerID }),
            //                roundcustomerProducts: createRoundcustomerProducts(productsRoundCustomer)
            //            }
            //        ]
            //    }
            //    return managementDistributionsService.addCustomerRound(roundCustomers).then(function (response) {
            //        //success
            //        logSuccess(productsRoundCustomer[0].CustomerName + ": הסבב נוצר בהצלחה.");
            //        if (productsRoundCustomerGroping[productsRoundCustomerGroping.length - 1] == productsRoundCustomer) {
            //            getRounds();
            //            resetRound();
            //        }
            //    },
            //        function (response) {
            //            //error
            //            logError(response.status + " " + response.statusText);
            //        }
            //    );
            //});

        function removeProductToCustomer(product) {
            return managementDistributionsService.removeProductToCustomer(product.ProductCustomerID).then(function (response) {
                //success
                if (response.data == "Success") {
                    logSuccess("המוצר נמחק בהצלחה.");
                    vm.productsCustomer = _.without(vm.productsCustomer, product);
                } else {
                    logWarning("המוצר לא קיים");
                }
            }, function (response) {
                //error
                logError(response.status + " " + response.statusText);
            });
        }

        function updateProductsRound(roundId) {
            updateRoundById(roundId).then(function (response) {
                //success
                var productsRoundCustomerGroping = _.toArray(_.groupBy(vm.productsRoundCustomerSelected, 'CustomerID'));
                productsRoundCustomerGroping = _.sortBy(productsRoundCustomerGroping, function (p) {
                    return Number(p[0].$$hashKey.replace("object:", ""));
                });
                var productsRoundCustomernew = [];
                _.each(productsRoundCustomerGroping, function (productsRoundCustomer) {
                    var roundCustomers = {
                        RoundId: vm.roundId,
                        RoundCustomers: [
                            {
                                customerRound: _.findWhere(vm.customers, { CustomerID: productsRoundCustomer[0].CustomerID }),
                                roundcustomerProducts: createRoundcustomerProducts(productsRoundCustomer)
                            }
                        ]
                    }
                    productsRoundCustomernew.push(roundCustomers);
                });
                return managementDistributionsService.updateCustomerRound(productsRoundCustomernew).then(function (rsponse) {
                    //success
                    logSuccess("הלקוח בסבב עודכן בהצלחה. " + rsponse.data);
                    getRounds();
                    resetRound();
                },
                       function (innerRsponse) {
                           //error
                           logError(innerRsponse.status + " " + innerRsponse.statusText);
                       }
                   );
            },
                function (response) {
                    //error
                    resetRound();
                });
        }

        function updateRoundById(roundId) {
            var round = {
                RoundID: roundId,
                RoundName: vm.roundName,
                RoundDate: getRoundDate()
            }
            return managementDistributionsService.updateRound(round).then(function (response) {
                //success
                logSuccess("הסבב עודכן בהצלחה!");
                return response;

            }, function (response) {
                //error
                logError(response.status + " " + response.statusText);
                return response;
            });
        }

        function createRoundcustomerProducts(products) {
            var roundcustomerProducts = [];
            _.each(products, function (product) {
                roundcustomerProducts.push({
                    CustomerRoundProduct: {
                        ProductCustomerID: product.ProductCustomerID,
                        CustomerID: product.CustomerID,
                        ProductID: product.ProductID,
                        dayType: product.dayType,
                        Cost: product.Cost,
                        ProductName: product.ProductName,
                        CustomerName: product.CustomerName
                    },
                    RoundsCustomerProductID: product.RoundsCustomerProductID,
                    Amount: product.Amount,
                    DeliveredAmount: product.DeliveredAmount
                });
            });
            return roundcustomerProducts;
        }

        function editRound(round) {
            var roundcustomerProducts = [];
            resetRound();
            vm.roundId = round.RoundID;
            vm.roundName = round.RoundName;
            vm.workerSelected = round.RoundUser[0];
            vm.dt = round.RoundDate;
            $('#timepicker').timepicker('setTime', $filter('date')(round.RoundDate, 'HH:mm'));// new Date(round.RoundDate).toTimeString().slice(0, 5);
            _.each(round.custRound, function (custRound) {
                _.each(custRound.roundcustomerProducts, function (product) {
                    roundcustomerProducts.push({
                        Amount: product.Amount,
                        DeliveredAmount: product.DeliveredAmount,
                        ProductCustomerID: product.CustomerRoundProduct.ProductCustomerID,
                        CustomerID: product.CustomerRoundProduct.CustomerID,
                        ProductID: product.CustomerRoundProduct.ProductID,
                        dayType: product.CustomerRoundProduct.dayType,
                        Cost: product.CustomerRoundProduct.Cost,
                        ProductName: product.CustomerRoundProduct.ProductName,
                        CustomerName: product.CustomerRoundProduct.CustomerName,
                        RoundsCustomerProductID: product.RoundsCustomerProductID
                    });
                });
            });
            vm.productsRoundCustomerSelected = roundcustomerProducts;
            vm.customersRoundShow = true;
            vm.roundBtnUpdateShow = true;
            vm.round = round;
        }

        function copyRound(round) {
            var roundcustomerProducts = [];
            resetRound();
            vm.roundId = 0;
            vm.roundName = round.RoundName;
            vm.workerSelected = round.RoundUser[0];
            vm.dt = round.RoundDate;
            $('#timepicker').timepicker('setTime', $filter('date')(round.RoundDate, 'HH:mm'));// new Date(round.RoundDate).toTimeString().slice(0, 5);
            _.each(round.custRound, function (custRound) {
                _.each(custRound.roundcustomerProducts, function (product) {
                    roundcustomerProducts.push({
                        Amount: product.Amount,
                        DeliveredAmount: product.DeliveredAmount,
                        CustomerID: product.CustomerRoundProduct.CustomerID,
                        ProductID: product.CustomerRoundProduct.ProductID,
                        dayType: product.CustomerRoundProduct.dayType,
                        Cost: product.CustomerRoundProduct.Cost,
                        ProductName: product.CustomerRoundProduct.ProductName,
                        CustomerName: product.CustomerRoundProduct.CustomerName
                    });
                });
            });
            vm.productsRoundCustomerSelected = roundcustomerProducts;
            vm.customersRoundShow = false;
            vm.roundBtnUpdateShow = false;
            vm.round = round;
        }

        function getRoundDate() {
            var date = $filter('date')(vm.dt, 'MM-dd-yyyy') + " " + vm.time.split(':')[0] + ":" + vm.time.split(':')[1];
            if (new Date(vm.dt) == 'Invalid Date') {
                date = new Date();
                date.setHours(vm.time.split(':')[0], vm.time.split(':')[1], 0);
                return date.toUTCString();
            }
            // date.setHours(vm.time.split(':')[0], vm.time.split(':')[1], 0);
            return date;
        }

        function resetRound() {
            vm.roundName = '';
            vm.customersRoundShow = false;
            vm.productsRoundCustomerSelected = [];
            vm.workerSelected = {};
            vm.productsRoundCustomer = {};
            vm.today = today();
            vm.roundId = 0;
            $('#timepicker').timepicker('setTime', new Date());
            vm.time = $('#timepicker').val();
            vm.roundBtnUpdateShow = false;
            vm.round = {};
            tempproductsRoundCustomerSelected = [];
        }

        function roundStatusChange(round) {
            if (round.roundStatus == 1) {
                round.roundStatus = 0;
            } else {
                round.roundStatus = 1;
            }

            changeRoundStatus(round);
        }

        function changeRoundStatus(round) {
            return managementDistributionsService.changeRoundStatus(round).then(function (response) {
                //success
                if (response.data.roundStatus === 1) {
                    logSuccess("הסבב פעיל");
                } else {
                    logWarning("הסבב לא פעיל");
                }
            }, function (response) {
                //error
                logError(response.status + " " + response.statusText);
            });
        }




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