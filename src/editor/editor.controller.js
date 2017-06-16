'use strict'

require('./lib/things.js')
require('./lib/blob.js')
var Clipboard = require('clipboard')
var FileSaver = require('file-saver')
var yaml = require('js-yaml')

module.exports = function($rootScope, $scope, AlertManager, $uibModal) {
  'ngInject'
  $scope.displayKey = false
  $scope.inputName = false
  $scope.filterAction = 'missings'
  /**
   * Modify the missing property of item
   * @param {Object} item
   * @returns
   */
  $scope.markMissingTranslations = function(item) {
    if (!item.lhs || (item.lhs && item.lhs.length === 0)) {
      item['missing'] = 'lhs'
    } else if (!item.rhs || (item.rhs && item.rhs.length === 0)) {
      item['missing'] = 'rhs'
    } else {
      delete item['missing']
    }

    return item
  }

  $scope.toggleKey = function() {
    var th = document.querySelector('table th.key')
    var tr = document.querySelectorAll('table tr td.key')
    if ($scope.displayKey) {
      th.classList.add('hidden')
      tr.forEach(function(line) {
        line.classList.add('hidden')
      })
      $scope.displayKey = false
    } else {
      th.classList.remove('hidden')
      tr.forEach(function(line) {
        line.classList.remove('hidden')
      })
      $scope.displayKey = true
    }
  }

  $scope.filter = function(action) {
    if (action === 'missings') {
      window.scroll(0, 0)
      $scope.tempData = $scope.metadata
      var missingsKey = Object.keys($scope.metadata).filter(function(key) {
        return $scope.metadata[key].missing
      })
      $scope.metadata = {}
      missingsKey.forEach(function(line) {
        $scope.metadata[line] = $scope.tempData[line]
      })
      $scope.filterAction = 'all'
    } else if (action === 'all') {
      $scope.metadata = $scope.tempData
      $scope.filterAction = 'missings'
    }
    generateStatistic($scope.metadata)
  }

  $scope.setSelected = function(index) {
    var selector = '.metadata tbody tr:nth-child(' + (index + 1) + ')'
    var selectedTr = document.querySelector('tr.selected')
    if (selectedTr) {
      selectedTr.classList.remove('selected')
    }
    document.querySelector(selector).classList.add('selected')
  }

  $scope.setSpecific = function(specific) {
    $scope.keySpecific = specific
  }

  $scope.goToMissingStep = function(index, specific, retry) {
    try {
      Object.keys($scope.metadata)
        .slice(index)
        .forEach(function(line, lineIndex) {
          if ($scope.metadata[line].hasOwnProperty('missing')) {
            if (specific && $scope.metadata[line].missing !== specific) {
              return false
            }

            var inputIndex = $scope.metadata[line].missing === 'lhs' ? 0 : 1
            var selector =
              '.metadata tbody tr:nth-child(' +
              (lineIndex + index + 1) +
              ') td:nth-child(' +
              (inputIndex + 3) +
              ') input'
            var containerSelector =
              '.metadata tbody tr:nth-child(' + (lineIndex + index + 1) + ')'
            var element = document.querySelector(selector)
            element.focus()
            window.scrollTo(
              0,
              document.querySelector(containerSelector).offsetTop -
                window.innerHeight / 2 +
                140
            )
            $scope.keyIndex = lineIndex
            $scope.specific = specific
            throw new Error('BreakException')
          }
        })

      if (retry) {
        document.scrollIntoView()
      } else {
        $scope.goToMissingStep(0, specific, true)
      }
    } catch (e) {
      return e
    }
  }

  $scope.calculateStatistics = function() {
    generateStatistic($scope.metadata)
  }

  var missingInputs = function(data) {
    var tmpNumber = 0
    Object.keys(data).forEach(function(line) {
      if (data[line].hasOwnProperty('missing')) {
        tmpNumber++
      }
    })
    return tmpNumber
  }

  var generateStatistic = function(data) {
    $scope.inputs = Object.keys(data).length
    $scope.missingInputs = missingInputs(data)
    $scope.ratioMissing = Math.floor(
      ($scope.inputs - $scope.missingInputs) / $scope.inputs * 100
    )
  }

  var attachListener = function() {
    document.addEventListener('keyup', function(event) {
      var index = $scope.keyIndex || 0
      var specific = $scope.keySpecific || undefined
      if (event.shiftKey && event.which === 13) {
        $scope.goToMissingStep(index, specific)
      } else if (event.which === 13) {
        $scope.goToMissingStep(index)
      }
    })
  }

  var capitalize = function(string) {
    return string[0].toUpperCase() + string.substr(1)
  }

  var constructLangObject = function() {
    var objToReturn = {}
    ;['lhs', 'rhs'].forEach(function(lang) {
      var obj = $scope[lang]
      var tmp
      if (Object.keys(obj).length > 1) {
        $scope['lang' + capitalize(lang)] = lang
        tmp = {
          language: lang,
          translations: flattenObject({ tmp: $scope[lang] })
        }
      } else {
        $scope['lang' + capitalize(lang)] = Object.keys($scope[lang])[0]
        tmp = {
          language: lang,
          translations: flattenObject(
            $scope[lang][$scope['lang' + capitalize(lang)]]
          )
        }
      }

      objToReturn[lang] = tmp
    })

    return objToReturn
  }

  $scope.$on('filereaded', function(event, arg, filename) {
    $scope[arg.state] = arg.datas
    if (!$scope.lhs || !$scope.rhs) {
      return false
    }

    attachListener()
    var langObj = constructLangObject()
    var mergedData = mergeObjects(langObj.lhs, langObj.rhs)
    $scope.metadata = markedMissing(mergedData)
    $scope.enterPressed = true
    generateStatistic($scope.metadata)
    $scope.goToMissingStep(0)
  })

  // Takes a nested object and produces a result objects where all the nested paths have
  // been flattened (segments are separated by /)
  var flattenObject = function(obj, path, flattened) {
    path = path || []
    flattened = flattened || {}
    for (var property in obj) {
      if (typeof obj[property] === 'object') {
        flattenObject(obj[property], path.concat([property]), flattened)
      } else {
        flattened[path.concat([property]).join('/')] = obj[property]
      }
    }
    return flattened
  }

  var markedMissing = function(data) {
    Object.keys(data).forEach(function(key) {
      var current = data[key]
      if (!current.lhs || (current.lhs && current.lhs.length === 0)) {
        current['missing'] = 'lhs'
      } else if (!current.rhs || (current.rhs && current.rhs.length === 0)) {
        current['missing'] = 'rhs'
      }

      if (
        (!current.lhs && !current.rhs) ||
        (current.lhs.length === 0 && current.rhs.length === 0)
      ) {
        delete data[key]
      }
    })
    return data
  }

  // Merges two objects in one object that Angular can use to display the translation table
  // The keys that exist on the left hand side object are looked up in the right hand side object
  // If a value exists there, we stuff it in the common path and then we delete it from the right hand side
  // object (to speed up operations for the second phase)
  // If it doesn't exist, we add it to the common path with a '' value
  // In the second phase we do the same by using the right hand side as the base (i.e. keys that exist in the rhs, but not in the lhs)
  var mergeObjects = function(leftHandSide, rightHandSide) {
    var result = {}
    var leftHandSideLanguage = leftHandSide.language
    var rightHandSideLanguage = rightHandSide.language
    for (var lhs in leftHandSide.translations) {
      result[lhs] = result[lhs] || {}
      result[lhs][leftHandSideLanguage] = leftHandSide.translations[lhs]
      result[lhs][rightHandSideLanguage] = rightHandSide.translations[lhs] || ''
      delete rightHandSide.translations[lhs]
    }
    for (var rhs in rightHandSide.translations) {
      result[rhs] = result[rhs] || {}
      result[rhs][leftHandSideLanguage] = ''
      result[rhs][rightHandSideLanguage] = rightHandSide.translations[rhs]
    }
    return result
  }

  var returnDataToExport = function(data, lang) {
    var tmpArray = []
    Object.keys(data).forEach(function(key) {
      tmpArray.push({ path: key.split('/'), value: data[key][lang] })
    })
    return tmpArray
  }

  var constructObj = function(array, lang) {
    $scope.tmpObj = {}
    array.forEach(function(obj) {
      addPathToObject(obj.value, obj.path, $scope.tmpObj)
    })
    var parentLang = lang === 'lhs' ? $scope.langLhs : $scope.langRhs
    var tmp = {}
    console.log('Lang', lang)
    console.log('ParentLang', parentLang)

    if (parentLang !== 'tmp') {
      tmp[parentLang] = $scope.tmpObj
    } else if (lang === 'lhs' || lang === 'rhs') {
      tmp = $scope.tmpObj
      console.log($scope.tmpObj)
      console.log('TMP', tmp)
    }

    delete $scope.tmpObj
    return tmp
  }

  var addPathToObject = function(value, path, currentPath) {
    var toGoPath = path.shift()
    if (currentPath.hasOwnProperty(toGoPath) && path.length >= 1) {
      return addPathToObject(value, path, currentPath[toGoPath])
    } else if (!currentPath.hasOwnProperty(toGoPath) && path.length === 0) {
      currentPath[toGoPath] = value
      return true
    } else if (!currentPath.hasOwnProperty(toGoPath) && path.length >= 1) {
      currentPath[toGoPath] = {}
      return addPathToObject(value, path, currentPath[toGoPath])
    }
  }

  // We need to export both versions (lhs and rhs) since values might have been added on both sides
  $scope.export = function(data, lang) {
    console.log(data, lang)
    if ($scope.ratioMissing !== 100) {
      AlertManager.add({
        type: 'danger',
        msg:
          "Tous les champs n'ont pas été rempli, veuillez remplir tout les champs avant d'exporter"
      })
    }

    var ratio = $scope.ratioMissing

    var modalInstance = $uibModal.open({
      animation: true,
      templateUrl: 'exportController.html',
      controller: [
        '$scope',
        function($scope) {
          $scope.ratio = ratio

          $scope.setLangChoosed = function(lang) {
            $scope.lang = lang
            $('.close-button').removeAttr('disabled')
            $('.close-button').removeClass('disabled')
            var previous = document.querySelector('.choose_lang.selected')
            if (previous) {
              previous.classList.remove('selected')
            }
            event.target.classList.add('selected')
            $('input.filename').focus()
          }

          $scope.close = function() {
            modalInstance.close({
              filename: $scope.filename,
              lang: $scope.lang
            })
          }
        }
      ],
      size: 'lg'
    })

    modalInstance.result.then(function(modalResult) {
      console.log(modalResult)
      modalResult.filename = /.yml/.test(modalResult.filename)
        ? modalResult.filename
        : modalResult.filename + '.yml'
      console.log('Data', data)
      var filtered = returnDataToExport(data, modalResult.lang)
      console.log('Filtered', filtered)
      var constructed = constructObj(filtered, modalResult.lang)
      console.log('Constructed', constructed)
      var yamlToExport = yaml.dump(constructed)
      console.log('YamlToExport', yamlToExport)
      var blob = new window.Blob([yamlToExport], {
        type: 'application/octet-stream'
      })
      FileSaver.saveAs(blob, modalResult.filename)
    })
  }
}
