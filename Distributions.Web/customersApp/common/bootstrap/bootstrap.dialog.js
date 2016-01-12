(function () {
    'use strict';

    var bootstrapModule = angular.module('common.bootstrap', ['ui.bootstrap']);

    bootstrapModule.factory('bootstrap.dialog', ['$modal', '$templateCache', modalDialog]);

    function modalDialog($modal, $templateCache) {
        var service = {
            deleteDialog: deleteDialog,
            confirmationDialog: confirmationDialog,
            roundDialog: roundDialog,
            workerPrintDialog:workerPrintDialog
        };

        $templateCache.put('modalDialog.tpl.html', 
            '<div>' +
            '    <div class="modal-header">' +
            '        <button type="button" class="close" data-dismiss="modal" aria-hidden="true" data-ng-click="cancel()">&times;</button>' +
            '        <h3>{{title}}</h3>' +
            '    </div>' +
            '    <div class="modal-body">' +
            '        <p>{{message}}</p>' +
            '    </div>' +
            '    <div class="modal-footer">' +
            '        <button class="btn btn-primary" data-ng-click="ok()">{{okText}}</button>' +
            '        <button class="btn btn-info" data-ng-click="cancel()">{{cancelText}}</button>' +
            '    </div>' +
            '</div>');

        $templateCache.put('roundModalDialog.tpl.html',
              '<div>' +
            '    <div class="modal-header">' +
            '        <button type="button" class="close" data-dismiss="modal" aria-hidden="true" data-ng-click="cancel()">&times;</button>' +
            '        <h4 class="modal-title">שם הסבב: {{round.RoundName}}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;מפיץ: {{round.RoundUser[0].FirstName + " "+ round.RoundUser[0].LastName}}'+
            '        &nbsp;&nbsp;&nbsp;&nbsp; תאריך: {{round.RoundDate | date:"dd-MM-yyyy"}}</h4>' +
            '    </div>' +
            '    <div class="modal-body">' +
            '      <table data-ng-repeat="custRound in round.custRound" class="table date-filter table-condensed table-bordered  table-striped">'+
            '       <thead ng-if="$index==0">'+
            '         <tr>'+
            '           <th>לקוח</th>'+
            '           <th>מוצר</th>'+
            '           <th>התקבל</th>'+
            '           <th>חזרות</th>'+
            '         </tr>'+
            '      </thead>'+
            '      <tbody>'+
            '         <tr data-ng-repeat="product in custRound.roundcustomerProducts">'+
            '            <td class={{custRound.customerRound.RoundCustomerStatus==true?"applay":""}}>{{product.CustomerRoundProduct.CustomerName}}</td>'+
            '            <td class={{custRound.customerRound.RoundCustomerStatus==true?"applay":""}}>{{product.CustomerRoundProduct.ProductName}}</td>'+
            '            <td class={{custRound.customerRound.RoundCustomerStatus==true?"applay":""}}>{{product.Amount}}</td>'+
            '            <td class={{custRound.customerRound.RoundCustomerStatus==true?"applay":""}}>{{product.DeliveredAmount}}</td>'+
            '        </tr>'+
            '     </tbody>'+
            '   </table>   ' +
            '  </div>' +
            '    <!--<div class="modal-footer">' +
            '        <button class="btn btn-primary" ng-click="ok()">OK</button>' +
            '         <button class="btn btn-warning" ng-click="cancel()">בטל</button>' +
            '    </div>-->' +
            '</div>');

        $templateCache.put('workerPrintDialog.tpl.html',
           '<div>' +
           '    <div class="modal-header">' +
           '        <button type="button" class="close" data-dismiss="modal" aria-hidden="true" data-ng-click="cancel()">&times;</button>' +
           '        <h3>{{title}}</h3>' +
           '    </div>' +
           '    <div class="modal-body">' +
           '        <p>{{message}}</p>' +
           '    </div>' +
           '    <div class="modal-footer">' +
           '        <button class="btn btn-primary" data-ng-click="ok('+"'workerPrint'"+')">{{workerPrintText}}</button>' +
           '        <button class="btn btn-primary" data-ng-click="ok('+"'workerPrintPay'"+')">{{workerPrintPayText}}</button>' +
           '        <button class="btn btn-primary" data-ng-click="ok('+"'workerPrintAll'"+')">{{workerPrintAllText}}</button>' +
           '    </div>' +
           '</div>');

        return service;

        function deleteDialog(itemName) {
            var title = 'Confirm Delete';
            itemName = itemName || 'item';
            var msg = 'Delete ' + itemName + '?';

            return confirmationDialog(title, msg);
        }

        function confirmationDialog(title, msg, okText, cancelText) {

            var modalOptions = {
                templateUrl: 'modalDialog.tpl.html',
                controller: ModalInstance,
                keyboard: true,
                resolve: {
                    options: function () {
                        return {
                            title: title,
                            message: msg,
                            okText: okText,
                            cancelText: cancelText
                        };
                    }
                }
            };

            return $modal.open(modalOptions).result; 
        }

        function roundDialog(round) {
            var modalOptions = {
                templateUrl: 'roundModalDialog.tpl.html',
                controller: RoundModalInstance,
                keyboard: true,
                size: 'lg',
                resolve: {
                    round: function () {
                        return round;
                    }
                }
            };

            return $modal.open(modalOptions).result;
        }

        function workerPrintDialog(title, msg, workerPrintText, workerPrintPayText, workerPrintAllText) {
            var modalOptions = {
                templateUrl: 'workerPrintDialog.tpl.html',
                controller: WorkerPrintModalInstance,
                size: 'md',
                resolve: {
                    options: function () {
                        return {
                            title: title,
                            message: msg,
                            workerPrintText: workerPrintText,
                            workerPrintPayText: workerPrintPayText,
                            workerPrintAllText: workerPrintAllText
                        };
                    }
                }
            };

            return $modal.open(modalOptions).result;
        }
    }

    

    var ModalInstance = ['$scope', '$modalInstance', 'options',
        function ($scope, $modalInstance, options) {
            $scope.title = options.title || 'Title';
            $scope.message = options.message || '';
            $scope.okText = options.okText || 'OK';
            $scope.cancelText = options.cancelText || 'Cancel';
            $scope.ok = function () { $modalInstance.close('ok'); };
            $scope.cancel = function () { $modalInstance.dismiss('cancel'); };
        }];

    var RoundModalInstance = ['$scope','$modalInstance', 'round',
        function ($scope,$modalInstance, round) {

            $scope.round = round;
            $scope.ok = ok;
            $scope.cancel = cancel;

            function ok() {
                $modalInstance.close(round);
            };

            function cancel() {
                $modalInstance.dismiss('cancel');
            };
        }
    ];

    var WorkerPrintModalInstance = ['$scope', '$modalInstance', 'options',
        function ($scope, $modalInstance, options) {
            $scope.title = options.title || 'דפסת תעודות משלוח';
            $scope.message = options.message || 'אנא בחר את סוג ההדפסה הרצוי';
            $scope.workerPrintText = options.workerPrintText || 'תעודה ללקוח';
            $scope.workerPrintPayText = options.workerPrintPayText || 'תעודה לתשלום';
            $scope.workerPrintAllText = options.workerPrintAllText || 'כל הסבב';
            $scope.ok = function(action) {
                 $modalInstance.close(action);
            };
            $scope.cancel = function () { $modalInstance.dismiss('cancel'); };
        }];
})();