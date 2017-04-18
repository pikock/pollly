/* eslint-disable no-undef */

'use strict'

require('./things.js')

module.exports = function ($rootScope, $scope, GenericDatas, AlertManager) {
  'ngInject'

  $scope.getLangFromObjectToTranslate = function (obj) {
    return Object.keys(obj)[0]
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

  var setPropertyFromPath = function (targetObject, path, key, value) {
    var currentValue = targetObject
    var parentValue
    for (var i = 0, l = path.length; i < l; i++) {
      // At each step, we're descending through the object
      var previousPath = i - 1
      parentValue = currentValue[path[previousPath]]
      currentValue = currentValue[path[i]]
    }
    if (angular.isUndefined(currentValue[key])) {
      AlertManager.add({
        type: 'danger',
        msg: 'Files error'
      })
    } else {
      currentValue[key] = value
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
      })
    }

    for (var i = 0; i < datas.length; i++) {
      var paths = datas[i].path.split('/')
      paths.splice(0, 2)
      paths.unshift(lang)
      setPropertyFromPath(
        $scope.totranslate,
        paths,
        datas[i].key,
        datas[i][lang]
      )
    }

    var yamlToExport = YAML.stringify($scope.totranslate, 4)
    var uriContent = 'data:application/octet-stream,' + encodeURIComponent(yamlToExport)
    window.open(uriContent, 'neuesDokument')
  }
}
