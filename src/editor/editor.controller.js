/* eslint-disable no-undef */

"use strict";

require("./things.js");
var YAMLJS = require("json2yaml");

module.exports = function($rootScope, $scope, AlertManager) {
  "ngInject";

  /**
   * Modify the missing property of item
   * @param {Object} item
   * @returns
   */
  $scope.markMissingTranslations = function(item) {
    console.log(item);
    if (
      !item.lhs || item.lhs.length === 0 || (!item.rhs || item.rhs.length === 0)
    ) {
      item["missing"] = true;
    } else {
      delete item["missing"];
    }
    return item;
  };

  $scope.$on("filereaded", function(event, arg, filename) {
    console.log(arg.state)
    $scope[arg.state] = arg.datas;

    if (!$scope.lhs || !$scope.rhs) {
      return false;
    }
    var rhs = $scope.rhs.en;
    var lhs = $scope.lhs.fr;
    var objectLhs = {
      language: "lhs",
      translations: flattenObject(lhs)
    };
    var objectRhs = {
      language: "rhs",
      translations: flattenObject(rhs)
    };

    $scope.initialLang = "lhs";
    $scope.totranslateLang = "rhs";
    var mergedData = mergeObjects(objectLhs, objectRhs);
    var markedData = markedMissing(mergedData);
    $scope.metadata = markedData;

    console.log("Metadata", $scope.metadata);
  });

  // Takes a nested object and produces a result objects where all the nested paths have
  // been flattened (segments are separated by /)
  var flattenObject = function(obj, path, flattened) {
    path = path || [];
    flattened = flattened || {};
    for (var property in obj) {
      if (typeof obj[property] === "object") {
        flattenObject(obj[property], path.concat([property]), flattened);
      } else {
        flattened[path.concat([property]).join("/")] = obj[property];
      }
    }
    return flattened;
  };

  var markedMissing = function(data) {
    console.log("Marked missing data", data);
    Object.keys(data).forEach(function(key) {
      var current = data[key];
      if (current.lhs.length === 0 || current.rhs.length === 0) {
        current["missing"] = true;
      }
    });
    return data;
  };

  // Merges two objects in one object that Angular can use to display the translation table
  // The keys that exist on the left hand side object are looked up in the right hand side object
  // If a value exists there, we stuff it in the common path and then we delete it from the right hand side
  // object (to speed up operations for the second phase)
  // If it doesn't exist, we add it to the common path with a '' value
  // In the second phase we do the same by using the right hand side as the base (i.e. keys that exist in the rhs, but not in the lhs)
  var mergeObjects = function(leftHandSide, rightHandSide) {
    var result = {};
    var leftHandSideLanguage = leftHandSide.language;
    var rightHandSideLanguage = rightHandSide.language;
    for (var lhs in leftHandSide.translations) {
      result[lhs] = result[lhs] || {};
      result[lhs][leftHandSideLanguage] = leftHandSide.translations[lhs];
      result[lhs][rightHandSideLanguage] =
        rightHandSide.translations[lhs] || "";
      delete rightHandSide.translations[lhs];
    }
    for (var rhs in rightHandSide.translations) {
      result[rhs] = result[rhs] || {};
      result[rhs][leftHandSideLanguage] = "";
      result[rhs][rightHandSideLanguage] = rightHandSide.translations[rhs];
    }
    return result;
  };

  // We need to export both versions (lhs and rhs) since values might have been added on both sides
  $scope.export = function(datas, lang) {
    console.log("Datas", datas);
    console.log("Lang", lang);
    // console.log($scope.filename)
    //   if (checkEmptyValue(datas, lang)) {
    //     AlertManager.add({
    //       type: 'danger',
    //       msg: 'Still has empty values'
    //     })
    //     return false
    //   }

    //   for (var i = 0; i < datas.length; i++) {
    //     var paths = datas[i].path.split('/')
    //     paths.splice(0, 2)
    //     paths.unshift(lang)
    //     addPathToObject($scope.totranslate, paths, datas[i].key, datas[i][lang])
    //   }

    //   var yamlToExport = YAMLJS.stringify($scope.totranslate)
    //   var blob = new Blob([yamlToExport], { type: 'application/x-yaml' })

    //   if (window.navigator.msSaveOrOpenBlob) {
    //     window.navigator.msSaveBlob(blob, $scope.filename)
    //   } else {
    //     var elem = window.document.createElement('a')
    //     elem.href = window.URL.createObjectURL(blob)
    //     elem.download = $scope.filename
    //     document.body.appendChild(elem)
    //     elem.click()
    //     document.body.removeChild(elem)
    //   }
    // }
  };
};
