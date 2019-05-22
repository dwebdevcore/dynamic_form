(function ()
{
    'use strict';

    angular
        .module('app.project.forms', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider)
    {        
        // State
        $stateProvider
            .state('app.project.forms', {
                url    : '/forms',
                views  : {
                    'content@app': {
                        templateUrl: 'app/main/project/forms/forms.html',
                        controller : 'FormsController as vm'
                    }
                }               
            });

        

        msNavigationServiceProvider.saveItem('project.forms', {
            title    : 'Project',
            icon     : 'icon-tile-four',
            state    : 'app.project.forms',            
            weight   : 1
        });
    }
})();