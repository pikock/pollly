/* eslint-disable no-undef */

"use strict";

require("./things.js");
var yaml = require("js-yaml");

module.exports = function($rootScope, $scope, AlertManager, $uibModal) {
  "ngInject";
  /**
   * Modify the missing property of item
   * @param {Object} item
   * @returns
   */
  $scope.markMissingTranslations = function(item) {
    if (!item.lhs || (item.lhs && item.lhs.length === 0)) {
      item["missing"] = "lhs";
    } else if (!item.rhs || (item.rhs && item.rhs.length === 0)) {
      item["missing"] = "rhs";
    } else {
      delete item["missing"];
    }

    return item;
  };

  $scope.setSelected = function(index) {
    console.log("Set selected", index);
    var selector = ".metadata tbody tr:nth-child(" + (index + 1) + ")";
    var selectedTr = document.querySelector("tr.selected");
    if (selectedTr) {
      selectedTr.classList.remove("selected");
    }
    document.querySelector(selector).classList.add("selected");
  };

  $scope.setSpecific = function(specific) {
    $scope.keySpecific = specific;
  };

  $scope.goToMissingStep = function(index, specific, retry) {
    try {
      Object.keys($scope.metadata)
        .slice(index)
        .forEach(function(line, lineIndex) {
          if ($scope.metadata[line].hasOwnProperty("missing")) {
            if (specific && $scope.metadata[line].missing !== specific) {
              return false;
            }
            var inputIndex = $scope.metadata[line].missing === "lhs" ? 0 : 1;
            var selector =
              ".metadata tbody tr:nth-child(" +
              (lineIndex + index + 1) +
              ") td:nth-child(" +
              (inputIndex + 2) +
              ") input";
            var containerSelector =
              ".metadata tbody tr:nth-child(" + (lineIndex + index + 1) + ")";
            var element = document.querySelector(selector);
            element.focus();
            window.scrollTo(
              0,
              document.querySelector(containerSelector).offsetTop -
                window.innerHeight / 2 +
                140
            );
            $scope.keyIndex = lineIndex;
            $scope.specific = specific;
            throw BreakException;
          }
        });

      if (retry) {
        document.scrollIntoView();
      } else {
        goToMissingStep(0, specific, true);
      }
    } catch (e) {
      return e;
    }
  };

  $scope.calculateStatistics = function() {
    generateStatistic($scope.metadata);
  };

  var missingInputs = function(data) {
    var tmpNumber = 0;
    Object.keys(data).forEach(function(line) {
      if (data[line].hasOwnProperty("missing")) {
        tmpNumber++;
      }
    });
    return tmpNumber;
  };

  var generateStatistic = function(data) {
    $scope.inputs = Object.keys(data).length;
    $scope.missingInputs = missingInputs(data);
    $scope.ratioMissing = Math.floor(
      ($scope.inputs - $scope.missingInputs) / $scope.inputs * 100
    );
  };

  $scope.$on("filereaded", function(event, arg, filename) {
    $scope[arg.state] = arg.datas;

    if (!$scope.lhs || !$scope.rhs) {
      return false;
    }

    document.addEventListener("keyup", function(event) {
      var index = $scope.keyIndex || 0;
      var specific = $scope.keySpecific || undefined;
      if (event.shiftKey && event.which === 13) {
        $scope.goToMissingStep(index, specific);
      } else if (event.which === 13) {
        $scope.goToMissingStep(index);
      }
    });

    var langRhs = Object.keys($scope.rhs)[0];
    var langLhs = Object.keys($scope.lhs)[0];
    var rhs = $scope.rhs[langRhs];
    var lhs = $scope.lhs[langLhs];
    var objectLhs = {
      language: "lhs",
      translations: flattenObject(lhs)
    };
    var objectRhs = {
      language: "rhs",
      translations: flattenObject(rhs)
    };

    $scope.initialLang = langLhs;
    $scope.totranslateLang = langRhs;
    var mergedData = mergeObjects(objectLhs, objectRhs);
    var markedData = markedMissing(mergedData);
    $scope.metadata = markedData;
    generateStatistic(markedData);
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
    Object.keys(data).forEach(function(key) {
      var current = data[key];
      if (!current.lhs || (current.lhs && current.lhs.length === 0)) {
        current["missing"] = "lhs";
      } else if (!current.rhs || (current.rhs && current.rhs.length === 0)) {
        current["missing"] = "rhs";
      }

      if (
        (!current.lhs && !current.rhs) ||
        (current.lhs.length === 0 && current.rhs.length === 0)
      ) {
        delete data[key];
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

  var returnDataToExport = function(data, lang) {
    var tmpArray = [];
    Object.keys(data).forEach(function(key) {
      tmpArray.push({ path: key.split("/"), value: data[key][lang] });
    });
    return tmpArray;
  };

  var constructObj = function(array, lang) {
    $scope.tmpObj = {};
    array.forEach(function(obj) {
      addPathToObject(obj.value, obj.path, $scope.tmpObj);
    });
    var parentLang = lang === "lhs"
      ? $scope.initialLang
      : $scope.totranslateLang;
    var tmp = {};
    tmp[parentLang] = $scope.tmpObj;
    delete $scope.tmpObj;
    return tmp;
  };

  var addPathToObject = function(value, path, currentPath) {
    var toGoPath = path.shift();
    if (currentPath.hasOwnProperty(toGoPath) && path.length >= 1) {
      return addPathToObject(value, path, currentPath[toGoPath]);
    } else if (!currentPath.hasOwnProperty(toGoPath) && path.length === 0) {
      currentPath[toGoPath] = value;
      return true;
    } else if (!currentPath.hasOwnProperty(toGoPath) && path.length >= 1) {
      currentPath[toGoPath] = {};
      return addPathToObject(value, path, currentPath[toGoPath]);
    }
  };

  // We need to export both versions (lhs and rhs) since values might have been added on both sides
  $scope.export = function(data, lang) {
    var modalInstance = $uibModal.open({
      animation: true,
      templateUrl: "exportModal.html",
      size: "lg",
      resolve: {
        filename: function() {
          return $scope.filename + ".yml";
        }
      }
    });

    modalInstance.result.then(function(filename) {
      filename = /.yml/.test(filename) ? filename : filename + ".yml";
      var filtered = returnDataToExport(data, lang);
      var constructed = constructObj(filtered, lang);
      var yamlToExport = yaml.dump(constructed);
      var blob = new Blob([yamlToExport], { type: "application/x-yaml" });
      if (window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveBlob(blob, filename);
      } else {
        var elem = window.document.createElement("a");
        elem.href = window.URL.createObjectURL(blob);
        elem.download = filename;
        document.body.appendChild(elem);
        elem.click();
        document.body.removeChild(elem);
      }
    });
  };
};
