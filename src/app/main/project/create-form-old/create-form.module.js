(function ()
{
    'use strict';

    angular
        .module('app.project.create-form.OLD', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider)
    {        
        // State
        $stateProvider
            .state('app.project.create-form', {
                url    : '/create-form',
                views  : {
                    'content@app': {
                        templateUrl: 'app/main/project/create-form/create-form.html',
                        controller : 'CreateFormController as vm'
                    }
                }               
            });        
    }
})();