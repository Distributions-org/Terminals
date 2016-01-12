(function () {
    'use strict';

    var app = angular.module('customerApp');

    app.directive('ccImgPerson', ['config', function (config) {
        //Usage:
        //<img data-cc-img-person="{{s.speaker.imageSource}}"/>
        var basePath = config.imageSettings.imageBasePath;
        var unknownImage = config.imageSettings.unknownPersonImageSource;
        var directive = {
            link: link,
            restrict: 'A'
        };
        return directive;

        function link(scope, element, attrs) {
            attrs.$observe('ccImgPerson', function (value) {
                value = basePath + (value || unknownImage);
                attrs.$set('src', value);
            });
        }
    }]);


    app.directive('ccSidebar', function () {
        // Opens and clsoes the sidebar menu.
        // Usage:
        //  <div data-cc-sidebar>
        // Creates:
        //  <div data-cc-sidebar class="sidebar">
        var directive = {
            link: link,
            restrict: 'A'
        };
        return directive;

        function link(scope, element, attrs) {
            var $sidebarInner = element.find('.sidebar-inner');
            var $dropdownElement = element.find('.sidebar-dropdown a');
            element.addClass('sidebar');
            $dropdownElement.click(dropdown);

            function dropdown(e) {
                var dropClass = 'dropy';
                e.preventDefault();
                if (!$dropdownElement.hasClass(dropClass)) {
                    hideAllSidebars();
                    $sidebarInner.slideDown(350);
                    $dropdownElement.addClass(dropClass);
                } else if ($dropdownElement.hasClass(dropClass)) {
                    $dropdownElement.removeClass(dropClass);
                    $sidebarInner.slideUp(350);
                }

                function hideAllSidebars() {
                    $sidebarInner.slideUp(350);
                    $('.sidebar-dropdown a').removeClass(dropClass);
                }
            }
        }
    });


    app.directive('ccWidgetClose', function () {
        // Usage:
        // <a data-cc-widget-close></a>
        // Creates:
        // <a data-cc-widget-close="" href="#" class="wclose">
        //     <i class="fa fa-remove"></i>
        // </a>
        var directive = {
            link: link,
            template: '<i class="fa fa-remove"></i>',
            restrict: 'A'
        };
        return directive;

        function link(scope, element, attrs) {
            attrs.$set('href', '#');
            attrs.$set('wclose');
            element.click(close);

            function close(e) {
                e.preventDefault();
                element.parent().parent().parent().hide(100);
            }
        }
    });

    app.directive('ccWidgetMinimize', function () {
        // Usage:
        // <a data-cc-widget-minimize></a>
        // Creates:
        // <a data-cc-widget-minimize="" href="#"><i class="fa fa-chevron-up"></i></a>
        var directive = {
            link: link,
            template: '<i class="fa fa-chevron-up"></i>',
            restrict: 'A'
        };
        return directive;

        function link(scope, element, attrs) {
            //$('body').on('click', '.widget .wminimize', minimize);
            attrs.$set('href', '#');
            attrs.$set('wminimize');
            element.click(minimize);

            function minimize(e) {
                e.preventDefault();
                var $wcontent = element.parent().parent().next('.widget-content');
                var iElement = element.children('i');
                if ($wcontent.is(':visible')) {
                    iElement.removeClass('fa fa-chevron-up');
                    iElement.addClass('fa fa-chevron-down');
                } else {
                    iElement.removeClass('fa fa-chevron-down');
                    iElement.addClass('fa fa-chevron-up');
                }
                $wcontent.toggle(500);
            }
        }
    });

    app.directive('ccScrollToTop', ['$window',
        // Usage:
        // <span data-cc-scroll-to-top></span>
        // Creates:
        // <span data-cc-scroll-to-top="" class="totop">
        //      <a href="#"><i class="fa fa-chevron-up"></i></a>
        // </span>
        function ($window) {
            var directive = {
                link: link,
                template: '<a href="#"><i class="fa fa-chevron-up"></i></a>',
                restrict: 'A'
            };
            return directive;

            function link(scope, element, attrs) {
                var $win = $($window);
                element.addClass('totop');
                $win.scroll(toggleIcon);

                element.find('a').click(function (e) {
                    e.preventDefault();
                    // Learning Point: $anchorScroll works, but no animation
                    //$anchorScroll();
                    $('body').animate({ scrollTop: 0 }, 500);
                });

                function toggleIcon() {
                    $win.scrollTop() > 300 ? element.slideDown() : element.slideUp();
                }
            }
        }
    ]);

    app.directive('ccSpinner', ['$window', function ($window) {
        // Description:
        //  Creates a new Spinner and sets its options
        // Usage:
        //  <div data-cc-spinner="vm.spinnerOptions"></div>
        var directive = {
            link: link,
            restrict: 'A'
        };
        return directive;

        function link(scope, element, attrs) {
            scope.spinner = null;
            scope.$watch(attrs.ccSpinner, function (options) {
                if (scope.spinner) {
                    scope.spinner.stop();
                }
                scope.spinner = new $window.Spinner(options);
                scope.spinner.spin(element[0]);
            }, true);
        }
    }]);

    app.directive('ccWidgetHeader', function () {
        //Usage:
        //<div data-cc-widget-header title="vm.map.title"></div>
        var directive = {
            link: link,
            scope: {
                'title': '@',
                'subtitle': '@',
                'rightText': '@',
                'allowCollapse': '@'
            },
            templateUrl: '/app/layout/widgetheader.html',
            restrict: 'A',
        };
        return directive;

        function link(scope, element, attrs) {
            attrs.$set('class', 'widget-head');
        }
    });

    app.directive('compareTo', function () {

        var directive = {
            require: "ngModel",
            scope: {
                otherModelValue: "=compareTo"
            },
            link: function (scope, element, attributes, ngModel) {

                ngModel.$validators.compareTo = function (modelValue) {
                    return modelValue == scope.otherModelValue;
                };
                scope.$watch("otherModelValue", function () {
                    ngModel.$validate();
                });
            }
        };
        return directive;
    });

    app.directive('optionsClass', ['$parse', function ($parse) {
        return {
            require: 'select',
            link: function (scope, elem, attrs, ngSelect) {
                // get the source for the items array that populates the select.
                var optionsSourceStr = attrs.ngOptions.split(' ').pop(),
                // use $parse to get a function from the options-class attribute
                // that you can use to evaluate later.
                    getOptionsClass = $parse(attrs.optionsClass);

                scope.$watch(optionsSourceStr, function (items) {
                    // when the options source changes loop through its items.
                    angular.forEach(items, function (item, index) {
                        // evaluate against the item to get a mapping object for
                        // for your classes.
                        var classes = getOptionsClass(item),
                        // also get the option you're going to need. This can be found
                        // by looking for the option with the appropriate index in the
                        // value attribute.
                            option = elem.find('option[value=' + index + ']');

                        // now loop through the key/value pairs in the mapping object
                        // and apply the classes that evaluated to be truthy.
                        angular.forEach(classes, function (add, className) {
                            if (add) {
                                angular.element(option).addClass(className);
                            }
                        });
                    });
                });
            }
        };
    }]);

    app.directive('reportCounts',['print', function (print) {
        var directive = {
            restrict: 'E',
            scope: {
                round: '=round',
                products: '@',
                printReportCount: '&',
                managerdetails: '=managerdetails'
            },
            templateUrl: '/app/reports/templates/report-counts.html',
            link: link
        }
        function link(scope, element, attrs) {
            scope.$watch("round", function () {
                //console.log(scope.round)
                if (scope.round.custRound) {
                    scope.products = getProducts(scope.round.custRound);
                }
                scope.$watch('printReportCount', function() {
                    scope.printReportCount = printReportCount;
                });
            });
        }

        function printReportCount(managerName) {
            print.printThisReportCount('print-report-counts',managerName);
        }
        
        function getProducts(custRound) {
            var products = [],counts = [],productsPager = [],tmpProducts = [];
            if (custRound.length > 0) {
                _.each(custRound, function (custr) {
                    _.each(custr.roundcustomerProducts, function(product) {
                        var map = { productName: product.CustomerRoundProduct.ProductName, amount: product.Amount };
                        if (map.amount != 0) {
                            products.push(map);
                        }
                    });
                });
                var groupProducts = _.groupBy(products, function(item) {
                    return item.productName;
                });
                
                _.each(groupProducts, function(item, index) {
                    counts.push({
                        productName: index,
                        count: _.reduce(item, function (memo, item) {
                            return memo + item.amount;
                        }, 0)
                    });
                });
                var sortProducts = _.sortBy(counts, 'productName');
                _.each(sortProducts, function (item, index) {
                    if (index % 20 == 0) {
                        if (tmpProducts.length == 20) {
                            productsPager.push(tmpProducts);
                        }
                         tmpProducts = [];
                    }
                    tmpProducts.push(item);
                    if (index == sortProducts.length - 1) {
                        productsPager.push(tmpProducts);
                    }
                });
                return productsPager; 
            }
        }
        return directive;
    }]
    );
})();

