(function () {
    'use strict';

    angular
        .module('app.project.create-form')
        .controller('CreateFormController', CreateFormController);

    /** @ngInject */
    function CreateFormController($mdToast, $state, formsService) {
        var vm = this;

        // Data

        var inputOptionsText = [
            'Firstname', 'Surname', 'Username', 'Geo location',
            'Email Address', 'Phone Number', 'Date of Birth', 'IP Address',
            'Street Address', 'City', 'Passport Number', 'Social Security Number',
            'State', 'Zip Code', 'Driver\'s License', 'Driver License State'
        ];

        vm.inputOptions = [];

        inputOptionsText.forEach(item => {
            vm.inputOptions.push({
                id: 0,
                name: item,
                checked: false
            });
        });

        // Methods

        function selectedInputOptionsCount() {
            return vm.inputOptions.filter(t => t.checked == true).length;
        }

        vm.step1Valid = function () {
            return selectedInputOptionsCount() > 0;
        }

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

            // $state.go('app.project.preview-form', {
            //     id: createdForm.id
            // });
        }

        
        //////////
    }
})();