/*global module */
/**
 * for orson by thierry_c
 */

module.exports = function($scope, $rootScope, wizardService, $translate) {
    'ngInject';
    'use strict';


    $scope.currentLang = $translate.use();


    $scope.progress = wizardService.progress;

    $scope.changeLang = function(lang){
      $translate.use(lang);
      $scope.currentLang = lang;
    }

    $scope.$watch('wizardService.progress.value', function(newValue) {
        if (newValue)
            $scope.progress.value = newValue;
        }
    );
};
