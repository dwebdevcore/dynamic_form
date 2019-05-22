(function () {
    'use strict';

    angular
        .module('app.core')
        .directive('formBuilder', formBuilderDirective);

    /** @ngInject */
    function formBuilderDirective($ocLazyLoad) {

        var styles = `
            <style>
                form-builder [class^="icon-"]:before,
                form-builder [class*=" icon-"]:before {
                    font-family: form-builder-font !important;
                    margin-right: .2em !important;
                    margin-left: .2em !important;
                }
            </style>
        `;

        var directive = {
            require: 'ngModel',
            link: link,
            restrict: 'E',
            template: '',
            scope: {
                options: '='
            }
        };

        return directive;

        function link(scope, element, attrs, ctrl) {

            var fields = [{
                label: "Button",
                type: "button",
                className: 'md-button md-raised',
                style: 'null'
            }]

            var options = {
                // fields: fields,
                // disableFields: ["button"]
            }

            options = angular.extend(options, scope.options);

            var formBuilder;

            $ocLazyLoad.load(["https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.11.4/jquery-ui.min.js",
                "https://formbuilder.online/assets/js/form-builder.min.js"
            ]).then(function () {
                formBuilder = element.formBuilder(options);
                attachEvents();
                element.append(styles);
                element.addClass('bootstrap-wrapper');
            })

            function attachEvents() {
                document.addEventListener('fieldAdded', setModelData);
                document.addEventListener('fieldRemoved', setModelData);
                document.addEventListener('formSaved', setModelData);
            }

            function setModelData() {

                if (formBuilder) {
                    var data = formBuilder.formData;
                    if (data) {
                        ctrl.$setViewValue(JSON.parse(data));
                    }
                }
            }


        }
    }

})();