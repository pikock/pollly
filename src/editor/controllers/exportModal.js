module.exports = window.angular
  .module('exportModal', ['ui.bootstrap'])
  .controller('exportController', function () {
    'ngInject'
    this.modalText = 'Modal Text'
  })
