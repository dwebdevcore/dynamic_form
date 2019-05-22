(function () {
    'use strict';

    angular
        .module('app.project.forms')
        .controller('FormsController', FormsController);

    /** @ngInject */
    function FormsController($state, formsService) {
        var vm = this;

        // Data

        vm.forms = [];

        vm.forms = formsService.getForms();

        console.log($state.href('app.project.preview-form'));

        vm.dtOptions = {
            dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
            pagingType: 'simple',
            autoWidth: false,
            responsive: true
        };

        // Methods
        var originatorEv;

        this.openMenu = function ($mdMenu, ev) {
            originatorEv = ev;
            $mdMenu.open(ev);
        };

        //////////
    }
})();