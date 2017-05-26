'use strict'

require('./things.js')
let yaml = require('js-yaml')

module.exports = function ($rootScope, $scope, AlertManager, $uibModal) {
  'ngInject'
  $scope.displayKey = false
  $scope.filterAction = 'missings'
  /**
   * Modify the missing property of item
   * @param {Object} item
   * @returns
   */
  $scope.markMissingTranslations = item => {
    if (!item.lhs || (item.lhs && item.lhs.length === 0)) {
      item['missing'] = 'lhs'
    } else if (!item.rhs || (item.rhs && item.rhs.length === 0)) {
      item['missing'] = 'rhs'
    } else {
      delete item['missing']
    }

    return item
  }

  $scope.toggleKey = () => {
    let th = document.querySelector('table th.key')
    let tr = document.querySelectorAll('table tr td.key')
    if ($scope.displayKey) {
      th.classList.add('hidden')
      tr.forEach(function (line) {
        line.classList.add('hidden')
      })
      $scope.displayKey = false
    } else {
      th.classList.remove('hidden')
      tr.forEach(function (line) {
        line.classList.remove('hidden')
      })
      $scope.displayKey = true
    }
  }

  $scope.filter = action => {
    if (action === 'missings') {
      window.scroll(0, 0)
      $scope.tempData = $scope.metadata
      let missingsKey = Object.keys($scope.metadata).filter(function (key) {
        return $scope.metadata[key].missing
      })
      $scope.metadata = {}
      missingsKey.forEach(function (line) {
        $scope.metadata[line] = $scope.tempData[line]
      })
      $scope.filterAction = 'all'
    } else if (action === 'all') {
      $scope.metadata = $scope.tempData
      $scope.filterAction = 'missings'
    }
    generateStatistic($scope.metadata)
  }

  $scope.enterPressedClick = () => {
    if ($scope.metadata) {
      $scope.enterPressed = true
    }
  }

  $scope.setSelected = index => {
    let selector = '.metadata tbody tr:nth-child(' + (index + 1) + ')'
    let selectedTr = document.querySelector('tr.selected')
    if (selectedTr) {
      selectedTr.classList.remove('selected')
    }
    document.querySelector(selector).classList.add('selected')
  }

  $scope.setSpecific = specific => {
    $scope.keySpecific = specific
  }

  $scope.goToMissingStep = (index, specific, retry) => {
    try {
      Object.keys($scope.metadata)
        .slice(index)
        .forEach(function (line, lineIndex) {
          if ($scope.metadata[line].hasOwnProperty('missing')) {
            if (specific && $scope.metadata[line].missing !== specific) {
              return false
            }

            let inputIndex = $scope.metadata[line].missing === 'lhs' ? 0 : 1
            let selector =
              '.metadata tbody tr:nth-child(' +
              (lineIndex + index + 1) +
              ') td:nth-child(' +
              (inputIndex + 3) +
              ') input'
            let containerSelector =
              '.metadata tbody tr:nth-child(' + (lineIndex + index + 1) + ')'
            let element = document.querySelector(selector)
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

  $scope.calculateStatistics = () => {
    generateStatistic($scope.metadata)
  }

  let missingInputs = data => {
    return Object.values(data).reduce((memo, line) => {
      if (line.hasOwnProperty('missing')) {
        memo++
      }
      return memo
    }, 0)
  }

  let generateStatistic = data => {
    $scope.inputs = Object.keys(data).length
    $scope.missingInputs = missingInputs(data)
    $scope.ratioMissing = Math.floor(
      ($scope.inputs - $scope.missingInputs) / $scope.inputs * 100
    )
  }

  let attachListener = () => {
    document.addEventListener('keyup', function (event) {
      let index = $scope.keyIndex || 0
      let specific = $scope.keySpecific || undefined
      if (event.shiftKey && event.which === 13) {
        $scope.goToMissingStep(index, specific)
      } else if (event.which === 13) {
        $scope.goToMissingStep(index)
      }
    })
  }

  let capitalize = string => {
    return string[0].toUpperCase() + string.substr(1)
  }

  let constructLangObject = () => {
    let objToReturn = {}
    ;['lhs', 'rhs'].forEach(function (lang) {
      let obj = $scope[lang]
      let tmp
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

  $scope.$on('filereaded', function (event, arg, filename) {
    $scope[arg.state] = arg.datas
    if (!$scope.lhs || !$scope.rhs) {
      return false
    }

    attachListener()
    let { lhs, rhs } = constructLangObject()
    let mergedData = mergeObjects(lhs, rhs)
    $scope.metadata = markedMissing(mergedData)
    generateStatistic($scope.metadata)
  })

  // Takes a nested object and produces a result objects where all the nested paths have
  // been flattened (segments are separated by /)
  let flattenObject = function (obj, path, flattened) {
    path = path || []
    flattened = flattened || {}
    for (let property in obj) {
      if (typeof obj[property] === 'object') {
        flattenObject(obj[property], path.concat([property]), flattened)
      } else {
        flattened[path.concat([property]).join('/')] = obj[property]
      }
    }
    return flattened
  }

  let markedMissing = function (data) {
    Object.keys(data).forEach(function (key) {
      let current = data[key]
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
  let mergeObjects = function (leftHandSide, rightHandSide) {
    let result = {}
    let leftHandSideLanguage = leftHandSide.language
    let rightHandSideLanguage = rightHandSide.language
    for (let lhs in leftHandSide.translations) {
      result[lhs] = result[lhs] || {}
      result[lhs][leftHandSideLanguage] = leftHandSide.translations[lhs]
      result[lhs][rightHandSideLanguage] = rightHandSide.translations[lhs] || ''
      delete rightHandSide.translations[lhs]
    }
    for (let rhs in rightHandSide.translations) {
      result[rhs] = result[rhs] || {}
      result[rhs][leftHandSideLanguage] = ''
      result[rhs][rightHandSideLanguage] = rightHandSide.translations[rhs]
    }
    return result
  }

  let returnDataToExport = function (data, lang) {
    let tmpArray = []
    Object.keys(data).forEach(function (key) {
      tmpArray.push({ path: key.split('/'), value: data[key][lang] })
    })
    return tmpArray
  }

  let constructObj = function (array, lang) {
    $scope.tmpObj = {}
    array.forEach(function (obj) {
      addPathToObject(obj.value, obj.path, $scope.tmpObj)
    })
    let parentLang = lang === 'lhs' ? $scope.langLhs : $scope.langRhs
    let tmp = {}
    if (lang === 'lhs' || lang === 'rhs') {
      tmp = $scope.tmpObj
    } else {
      tmp[parentLang] = $scope.tmpObj
    }

    delete $scope.tmpObj
    return tmp
  }

  let addPathToObject = function (value, path, currentPath) {
    let toGoPath = path.shift()
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
  $scope.export = function (data, lang) {
    if ($scope.ratioMissing !== 100) {
      AlertManager.add({
        type: 'danger',
        msg: "Tous les champs n'ont pas été rempli, veuillez remplir tout les champs avant d'exporter"
      })
    }

    let modalInstance = $uibModal.open({
      animation: true,
      templateUrl: 'exportModal.html',
      controller: 'exportController',
      size: 'lg'
    })

    modalInstance.result.then(function (modalResult) {
      modalResult.filename = /.yml/.test(modalResult.filename)
        ? modalResult.filename
        : modalResult.filename + '.yml'
      let filtered = returnDataToExport(data, modalResult.lang)
      let constructed = constructObj(filtered, modalResult.lang)
      let yamlToExport = yaml.dump(constructed)
      let blob = new window.Blob([yamlToExport], { type: 'application/x-yaml' })
      if (window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveBlob(blob, modalResult.filename)
      } else {
        let elem = window.document.createElement('a')
        elem.href = window.URL.createObjectURL(blob)
        elem.download = modalResult.filename
        document.body.appendChild(elem)
        elem.click()
        document.body.removeChild(elem)
      }
    })
  }
}
