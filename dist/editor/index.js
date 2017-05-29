/* global module require */

'use strict'

module.exports = angular.module('editor', [
  require('./directives/OrAlert'),
  require('./services/AlertManager'),
  require('./directives/FileRead'),
  require('./controllers/exportModal')
]).name
