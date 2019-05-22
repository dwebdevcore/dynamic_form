(function ()
{
    'use strict';

    /**
     * Main module of the Fuse
     */
    angular
        .module('fuse', [

            "oc.lazyLoad",

            // Core
            'app.core',

            // Navigation
            'app.navigation',

            // Toolbar
            'app.toolbar',

            // Quick Panel
            'app.quick-panel',

            //Account
            'app.account',

            // Sample
            // 'app.sample',

            //Project
            'app.project'
        ]);
})();