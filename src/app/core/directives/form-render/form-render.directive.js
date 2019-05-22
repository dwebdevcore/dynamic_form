(function () {
    'use strict';

    angular
        .module('app.core')
        .directive('formRender', formRenderDirective);

    /** @ngInject */
    function formRenderDirective($ocLazyLoad) {

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
            // require: 'ngModel',
            link: link,
            restrict: 'E',
            template: '',
            scope: {
                formData: '='
            }
        };

        return directive;

        function link(scope, element, attrs, ctrl) {
           

            var options = {
                dataType: 'json',
                formData: scope.formData
            }

            var formRender;

            $ocLazyLoad.load(["https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.11.4/jquery-ui.min.js",
                "https://formbuilder.online/assets/js/form-render.min.js"
            ]).then(function () {
                element.formRender(options);               
                element.addClass('bootstrap-wrapper');
                element.find('.rendered-form').addClass('container').addClass('padding-top-30 padding-bottom-30');
            });
        }
    }

})();