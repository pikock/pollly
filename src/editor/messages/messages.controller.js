/* global module */

module.exports = function($scope, $uibModalInstance, messageBox) {
  'ngInject'
  'use strict'
  $scope.title = messageBox.title
  $scope.message = messageBox.message

  $scope.btnOk = messageBox.btnOk || 'Ok'
  $scope.btnCancel = messageBox.btnCancel || 'Cancel'

  $scope.ok = function() {
    $uibModalInstance.close('ok')
  }

  $scope.close = function() {
    $uibModalInstance.close()
  }

  $scope.getSvg = function(fileName) {
    return '/assets/images/' + fileName + '.svg'
  }
}
