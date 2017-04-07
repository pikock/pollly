/*global module require */
/**
 * for orson by thierry_c
 */
'use strict';

require('./services');
require('./directives');


module.exports = angular.module('wizard', [
  // require('./dep'),
  'services', 'directives'
])
  /* set storagekey */
  .value('storageKey', 'osrsonLiftWizard')
  .factory('wizardService', function ($rootScope, $exceptionHandler, $window, storageKey) {
    'ngInject';

    var service = {
      isInit: false,
      progress: {
        value: 1,
        max: 8,
        direction: true
      },
      facebook_accounts: [],
      site: {
        language:'fr',
        provider: '1and1',

        url: '',
        colors: {
          'mainColor': '#185FF5',
          'secondColor': '#ffffff',
          'thirdColor': '#828282',
          'fourthColor': '#FFFFFF',
          'fifthColor': '#2F2F2F',
          'sixthColor': '#000000',
          'mainFont': 'Fira Sans Condensed',
          'secondFont': 'Open Sans',
          'modularRatio': '0',
          'buttonStyle': 'reflect',
          'buttonBorderRadius': '2px',
          'baseFontSize': '14px'
        },
        logo: {
          src: '/assets/images/icn-upload.svg'
        },
        image: {
          src: ''
        },
        siteCreated:{
        }
      },
      default_site: {
        provider: 'facebook',
        url: '',
        colors: {
          'mainColor': '#bd4848',
          'secondColor': '#ffffff',
          'thirdColor': '#828282',
          'fourthColor': '#FFFFFF',
          'fifthColor': '#545454',
          'sixthColor': '#545454',
          'mainFont': 'Droid Sans',
          'secondFont': 'Droid Sans',
          'modularRatio': '0',
          'buttonStyle': 'reflect',
          'buttonBorderRadius': '2px',
          'baseFontSize': '14px'
        },
        logo: {
          src: 'http://placehold.it/150x150'
        },
        image: {
          src: ''
        }
      },
      state: {
        default: {},
        previous: {},
        current: {}
      }
    }
    return service
  })
  .name
