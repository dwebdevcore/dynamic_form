(function () {
    'use strict';

    angular
        .module('app.project.preview-form')
        .controller('PreviewFormController', PreviewFormController);

    /** @ngInject */
    function PreviewFormController($mdToast, $state, $stateParams, formsService) {
        var vm = this;

        // Data

        var formId = $stateParams.id;
        var form = formsService.find(formId);
        console.log(form);
        vm.configuration = angular.copy(form);

        // Methods


        //////////
    }
})();