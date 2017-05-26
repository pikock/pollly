/* global module */

module.exports = ($scope, $uibModalInstance, messageBox) => {
  'ngInject'
  'use strict'
  $scope.title = messageBox.title
  $scope.message = messageBox.message

  $scope.btnOk = messageBox.btnOk || 'Ok'
  $scope.btnCancel = messageBox.btnCancel || 'Cancel'

  $scope.ok = () => {
    $uibModalInstance.close('ok')
  }

  $scope.close = () => {
    $uibModalInstance.close()
  }

  $scope.getSvg = fileName => {
    return '/assets/images/' + fileName + '.svg'
  }
}
