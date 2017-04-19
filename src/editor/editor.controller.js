/* eslint-disable no-undef */

'use strict'

require('./things.js')
var YAMLJS = require('json2yaml')

module.exports = function ($rootScope, $scope, GenericDatas, AlertManager) {
  'ngInject'

  $scope.getLangFromObjectToTranslate = function (obj) {
    return Object.keys(obj)[0]
  }

  var isPresentString = function (string) {
    return typeof string === 'string' && string.length !== 0
  }

  /**
   * Modify the missing property of item
   * @param {Object} item
   * @returns
   */
  $scope.changeInputTraduction = function (item) {
    if (isPresentString(item[$scope.initialLang]) && isPresentString(item[$scope.totranslateLang])) {
      delete item.missing
    } else if (!item.hasOwnProperty('missing')) {
      item['missing'] = {}
      if (typeof item[$scope.initialLang] === 'string' && item[$scope.initialLang].length === 0) {
        item.missing[$scope.initialLang] = true
      } else if (typeof item[$scope.totranslateLang] === 'string' && item[$scope.totranslateLang].length === 0) {
        item.missing[$scope.totranslateLang] = true
      }
    }
    return item
  }

  $scope.$on('filereaded', function (event, arg) {
    var state = arg.state
    $scope[state] = arg.datas
    $scope[state + 'Lang'] = $scope.getLangFromObjectToTranslate($scope[state])

    if (state === 'totranslate') {
      $scope.inline_es = convertToArray(
        $scope.initial,
        '',
        '',
        $scope.getLangFromObjectToTranslate($scope.initial)
      )
      $scope.inline_fr = convertToArray(
        $scope.totranslate,
        '',
        '',
        $scope.getLangFromObjectToTranslate($scope.totranslate)
      )
      extractDiffKeys(
        $scope.inline_es,
        $scope.inline_fr,
        $scope.getLangFromObjectToTranslate($scope.totranslate)
      )
      extractDiffKeys(
        $scope.inline_fr,
        $scope.inline_es,
        $scope.getLangFromObjectToTranslate($scope.initial),
        'reverse'
      )
    }
  })

  var convertToArray = function (translations, oldPath, newPath, lang) {
    var newDatas = []

    function convert (translations, oldPath, newPath, lang) {
      var path = oldPath + '/' + newPath
      if (newPath === '' && oldPath === '') {
        path = ''
      }

      for (var property in translations) {
        if (translations.hasOwnProperty(property)) {
          if (typeof translations[property] === 'object') {
            convert(translations[property], path, property, lang)
          } else {
            var item = {
              key: property
            }
            item[lang] = translations[property]
            item['path'] = path
            newDatas.push(item)
          }
        }
      }
    }

    convert(translations, '', '', lang)
    return newDatas
  }

  var extractDiffKeys = function (a, b, lang, mode) {
    for (var i = 0; i < a.length; i++) {
      var isPresent = false

      for (var j = 0; j < b.length; j++) {
        // FIXME: Should not relay on double equel to function correctly
        if (b[j].key == [a[i].key]) {
          if (angular.isDefined(mode)) {
          } else {
            a[i][lang] = b[j][lang]
          }
          isPresent = true
        }
      }

      if (!isPresent) {
        if (angular.isDefined(mode)) {
          b[j] = a[i]
          b[j][lang] = ''
          b[j]['missing'] = {}
          b[j]['missing'][lang] = true
        } else {
          a[i][lang] = ''
          a[i]['missing'] = {}
          a[i]['missing'][lang] = true
        }
      }
    }
  }

  /**
   * @description addPathToObject allows to set a nested value in an object
   * @param {Object} object The object to modify
   * @param {Array} path The segments of the path to the key we want to set 
   * @param {String} key The key we want to set in the object
   * @param {String} value The value associated with the key
   */
  var addPathToObject = function (object, path, key, value) {
    var prop = path.shift()
    // We're at the end of the path
    if (typeof prop === 'undefined') {
      object[key] = value
      return object
    } else {
      // If the path segment doesn't exist at this level of the object
      // create it with an empty object and keep on descending
      if (!object.hasOwnProperty(prop)) {
        object[prop] = {}
      }
      // Default case, the path segment exists, so we keep on descending
      addPathToObject(object[prop], path, key, value)
    }
  }
 

  var checkEmptyValue = function (datas, lang) {
    for (var i = 0; i < datas.length; i++) {
      if (datas[i][lang] === '') {
        return true
      }
    }
    return false
  }

  $scope.export = function (datas, lang) {
    if (checkEmptyValue(datas, lang)) {
      AlertManager.add({
        type: 'danger',
        msg: 'Still has empty values'
      });
      return;
    }

    for (var i = 0; i < datas.length; i++) {
      var paths = datas[i].path.split('/')
      paths.splice(0, 2);
      paths.unshift(lang);

      addPathToObject(
        $scope.totranslate,
        paths,
        datas[i].key,
        datas[i][lang]
      )
    }

    var yamlToExport = YAMLJS.stringify($scope.totranslate)
    var uriContent = 'data:application/octet-stream,' +
    encodeURIComponent(yamlToExport)
    window.open(uriContent, 'neuesDokument')
  }
}
