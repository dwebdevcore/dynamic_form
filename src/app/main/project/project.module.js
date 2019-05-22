(function () {
  'use strict';

  angular
    .module('app.project', [
      'datatables',
      'app.project.forms',
      'app.project.create-form',
      'app.project.preview-form'
    ])
    .config(config);

  /** @ngInject */
  function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider) {
    // State
    $stateProvider
      .state('app.project', {
        url: '/project',
        abstract: true,
        template: '<ui-view/>'
      });

    // Navigation
    msNavigationServiceProvider.saveItem('project', {
      title: 'APPS',
      group: true,
      weight: 2
    });
  }
})();
