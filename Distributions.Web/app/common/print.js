(function () {
    'use strict';

    var serviceId = 'print';
    angular.module('app').factory(serviceId, ['common',print]);
    
    function print(common) {
        
        var service = {
            printReport: printReport,
            printThisReport: printThisReport,
            printThisReportCount: printThisReportCount
        };

        return service;

        function printThisReport(element,managerName) {
            $("#" + element).printThis({
      debug: false,               //* show the iframe for debugging
      importCSS: true,            //* import page CSS
      importStyle: false,         //* import style tags
      printContainer: true,      // * grab outer container as well as the contents of the selector
      loadCSS: ["/content/bootstrap.min.css", "/Content/bootstrap-rtl.css", "/Content/customtheme.css"
      , "/Content/styles.css", "/Content/StyleSheet.min.css", "/Content/printWorker.css", "/Content/print.css"], // * path to additional css file - us an array [] for multiple
      pageTitle: managerName,              //* add title to print page
      removeInline: false,       // * remove all inline styles from print elements
      printDelay: 333,           // * variable print delay
      header: null,              // * prefix to html
      formValues: true           // * preserve input/form values
  });
        }

        function printReport(divName) {
            var printContents = document.getElementById(divName).innerHTML;
            var originalContents = document.body.innerHTML;
            var params = [
        'height=' + screen.height,
        'width=' + screen.width,
        'fullscreen=yes' // only works in IE, but here for completeness
            ].join(',');
            var popupWin;
            if (navigator.userAgent.toLowerCase().indexOf('chrome') > -1) {
                popupWin = window.open('', '_blank', params + ',scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no');
                popupWin.window.focus();
                popupWin.document.write('<!DOCTYPE html><html><head> <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"> <meta name="format-detection" content="telephone=no">' +
                    '<link href="/content/bootstrap.min.css" rel="stylesheet">' + '<link href="/Content/bootstrap-rtl.css" rel="stylesheet"> <link href="/content/customtheme.css" rel="stylesheet">' +
                    '<link href="/content/styles.css" rel="stylesheet"> <link href="/Content/StyleSheet.min.css" rel="stylesheet"> <link href="/Content/print.css?ver=0.4" rel="stylesheet"> <link href="/Content/printWorker.css?ver=4" rel="stylesheet"> ' +
                    '</head><body onload="window.print()"><div class="reward-body">' + printContents + '</div></html>');
                popupWin.onbeforeunload = function (event) {
                    popupWin.close();
                    return '.\n';
                };
                popupWin.onabort = function (event) {
                    popupWin.document.close();
                    popupWin.close();
                }
            } else {
                popupWin = window.open('', '_blank', params);
                popupWin.document.open();
                popupWin.document.write('<html><head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8"> <meta name="format-detection" content="telephone=no"> <link href="/content/bootstrap.min.css" rel="stylesheet">' + '<link href="/Content/bootstrap-rtl.css" rel="stylesheet"> <link href="/content/customtheme.css" rel="stylesheet">' +
                    '<link href="/content/styles.css" rel="stylesheet"> <link href="/Content/StyleSheet.min.css" rel="stylesheet"> <link href="/Content/printWorker.css?ver=4" rel="stylesheet">' +
                    '</head><body onload="window.print()">' + printContents + '</html>');
                popupWin.document.close();
            }
            popupWin.document.close();

            return true;
        }

        function printThisReportCount(element,managerName) {
            $("#" + element).printThis({
                debug: false,               //* show the iframe for debugging
                importCSS: true,            //* import page CSS
                importStyle: false,         //* import style tags
                printContainer: true,      // * grab outer container as well as the contents of the selector
                loadCSS: ["/content/bootstrap.min.css", "/Content/bootstrap-rtl.css", "/Content/customtheme.css"
                , "/Content/styles.css", "/Content/StyleSheet.min.css", "/Content/printCount.css"], // * path to additional css file - us an array [] for multiple
                pageTitle: managerName,              //* add title to print page
                removeInline: false,       // * remove all inline styles from print elements
                printDelay: 555,           // * variable print delay
                header: null,              // * prefix to html
                formValues: false           // * preserve input/form values
            });
        }
    }
})();