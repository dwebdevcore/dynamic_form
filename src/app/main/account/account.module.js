(function ()
{
    'use strict';

    angular
        .module('app.account', [
            'app.account.login',
            'app.account.register',
            'app.account.forgot-password'
        ])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider)
    {
                
    }
})();