/*global module */
/**
 * for orson by thierry_c
 */

module.exports = function($scope, $rootScope, wizardService) {
    'ngInject';
    'use strict';

    
    $scope.getSvg = function (fileName) {
      return '/assets/images/' + fileName + '.svg'
    }
};
