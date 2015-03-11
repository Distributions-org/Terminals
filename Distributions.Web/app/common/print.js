(function () {
    'use strict';

    angular
        .module('app')
        .factory('print', print);

    

    function print() {
        var service = {
            printReport: printReport
        };

        return service;

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
                popupWin.document.write('<!DOCTYPE html><html><head>' +
                    '<link href="/content/bootstrap.min.css" rel="stylesheet">' + '<link href="/Content/bootstrap-rtl.css" rel="stylesheet"> <link href="/content/customtheme.css" rel="stylesheet">' +
                    '<link href="/content/styles.css" rel="stylesheet"> <link href="/Content/StyleSheet.min.css" rel="stylesheet"> <link href="/Content/printWorker.css" rel="stylesheet">' +
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
                popupWin.document.write('<html><head><link href="/content/bootstrap.min.css" rel="stylesheet">' + '<link href="/Content/bootstrap-rtl.css" rel="stylesheet"> <link href="/content/customtheme.css" rel="stylesheet">' +
                    '<link href="/content/styles.css" rel="stylesheet"> <link href="/Content/StyleSheet.min.css" rel="stylesheet"> <link href="/Content/printWorker.css" rel="stylesheet">' +
                    '</head><body onload="window.print()">' + printContents + '</html>');
                popupWin.document.close();
            }
            popupWin.document.close();

            return true;
        }
    }
})();