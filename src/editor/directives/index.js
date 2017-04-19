var YAMLJS = require('js-yaml')

module.exports = angular
  .module('directives', [])
  .directive('orAlert', function () {
    'ngInject'
    'use strict'
    return {
      template: require('../alerts/index.html'),
      scope: {
        alerts: '=orAlert'
      },
      controller: require('../alerts/alert.controller.js'),
      link: function (scope, element, attr) {}
    }
  })
  .directive('fileread', [
    function () {
      return {
        link: function (scope, element, attributes) {
          element.bind('change', function (changeEvent) {
            console.log('Changevent filename', changeEvent.target.files[0].name)
            var reader = new FileReader()
            reader.onload = function (loadEvent) {
              scope.$apply(function () {
                scope.fileread = YAMLJS.safeLoad(loadEvent.target.result)
                scope.$emit('filereaded', {
                  datas: scope.fileread,
                  state: attributes.fileread,
                  filename: changeEvent.target.files[0].name
                })
              })
            }
            reader.readAsText(changeEvent.target.files[0])
          })
        }
      }
    }
  ])
  .directive('dropdownColor', function () {
    'ngInject'
    return {
      restrict: 'AE',
      template: require('./dropdown-color.html'),
      scope: {
        color: '=',
        colors: '='
      },
      link: function (scope, element, attr) {
        scope.status = {
          isopen: false
        }
        scope.name = attr.colorName

        scope.selectColor = function (hexa) {
          scope.color = hexa
          scope.status.isopen = !scope.status.isopen
        }

        scope.colorIsCustom = function (color, colors) {
          for (var i = 0; i < colors.length; i++) {
            if (color == colors[i].hexa) {
              return false
            }
          }
          return true
        }
      }
    }
  })
  .directive('focusMe', function ($timeout, $parse) {
    'ngInject'
    return {
      restrict: 'A', //  faster
      link: function (scope, element, attrs) {
        var model = $parse(attrs.focusMe)
        scope.$watch(model, function (value) {
          if (value === true) {
            // TODO better test for android
            $timeout(
              function () {
                element[0].focus()
              },
              100
            )
          }
        })

        if (!attrs.focusMe) {
          // console.log(element[0]);
          $timeout(
            function () {
              // console.log(element[0], 'focus');
              element[0].focus()
            },
            800
          )
        }
        /*
      element.bind('blur', function() {
        //console.log(model, scope);
        scope.$apply(model.assign(scope, false));
      })
      */
      }
    }
  }).name
