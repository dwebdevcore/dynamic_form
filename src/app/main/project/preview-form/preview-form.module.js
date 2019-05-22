(function () {
    'use strict';

    angular
        .module('app.project.preview-form', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider) {
        // State
        $stateProvider
            .state('app.project.preview-form', {
                url: '/preview-form/{id: int}',
                views: {
                    'content@app': {
                        templateUrl: 'app/main/project/preview-form/preview-form.html',
                        controller: 'PreviewFormController as vm'
                    }
                }
            });
    }
})();