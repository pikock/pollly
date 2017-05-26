/* global module */
/**
 * for orson by thierry_c
 */

module.exports = ($scope, AlertManager) => {
  'ngInject'
  'use strict'
  $scope.alerts = AlertManager.list
  $scope.closeAlert = () => {
    AlertManager.del()
  }
}
