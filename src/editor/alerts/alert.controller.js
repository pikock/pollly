/* global module */
/**
 * for orson by thierry_c
 */

module.exports = function ($scope, AlertManager) {
  'ngInject'
  'use strict'
  $scope.alerts = AlertManager.list
  $scope.closeAlert = function () {
    AlertManager.del()
  }
}
