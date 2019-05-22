(function () {
  'use strict';

  angular
    .module('app.account.register')
    .controller('RegisterV2Controller', RegisterV2Controller);

  /** @ngInject */
  function RegisterV2Controller($state) {
    var vm = this;
    // Data

    // Methods


    vm.register = function () {
        $state.go('app.login');
    }
    //////////
  }
})();
