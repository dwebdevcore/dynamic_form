(function ()
{
    'use strict';

    angular
        .module('app.account.login')
        .controller('LoginV2Controller', LoginV2Controller);

    /** @ngInject */
    function LoginV2Controller($state)
    {
        var vm = this;

        // Data

        // Methods

        vm.login = function() {
            $state.go('app.project.create-form');
        }

        //////////
    }
})();