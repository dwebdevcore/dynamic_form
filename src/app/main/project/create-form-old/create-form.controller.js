(function () {
  'use strict';

  angular
    .module('app.project.create-form.OLD')
    .controller('CreateFormController', CreateFormController);

  /** @ngInject */
  function CreateFormController($mdToast, $state, formsService) {
    var vm = this;

    // Data
    // Methods
    vm.formValid = function (form, wizzardForm) {
      return form && form.data.length > 0 && wizzardForm.$valid;
    }

    vm.save = function (configuration) {
      configuration.name = vm.name;
      console.log(configuration);
      var createdForm = formsService.addForm(configuration);

      $mdToast.show(
        $mdToast.simple()
        .textContent('Configuration saved successfully!')
        .position('right')
        .hideDelay(3000)
      );

      $state.go('app.project.preview-form', {id: createdForm.id});
    }
    //////////
  }
})();