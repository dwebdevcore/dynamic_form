(function ()
{
    'use strict';

    angular
        .module('app.core')
        .controller('msMaterialColorPickerController', msMaterialColorPickerController)
        .directive('msMaterialColorPicker', msMaterialColorPicker);

    /** @ngInject */
    function msMaterialColorPickerController($scope, $mdColorPalette, $mdMenu, fuseGenerator)
    {
        var vm = this;
        vm.palettes = $mdColorPalette; // Material Color Palette
        vm.selectedPalette = false;
        vm.selectedHues = false;
        $scope.$selectedColor = {};

        // Methods
        vm.activateHueSelection = activateHueSelection;
        vm.selectColor = selectColor;
        vm.removeColor = removeColor;

        /**
         * Initialize / Watch model changes
         */
        $scope.$watch('ngModel', setSelectedColor);

        /**
         * Activate Hue Selection
         * @param palette
         * @param hues
         */
        function activateHueSelection(palette, hues)
        {
            vm.selectedPalette = palette;
            vm.selectedHues = hues;
        }

        /**
         * Select Color
         * @type {selectColor}
         */
        function selectColor(palette, hue)
        {
            // Update Selected Color
            updateSelectedColor(palette, hue);

            // Update Model Value
            updateModel();

            // Hide The picker
            $mdMenu.hide();
        }

        function removeColor()
        {
            vm.selectedColor = {
                palette: '',
                hue    : '',
                class  : ''
            };

            activateHueSelection(false, false);

            updateModel();
        }

        /**
         * Set SelectedColor by model type
         */
        function setSelectedColor()
        {
            if ( !vm.modelCtrl.$viewValue || vm.modelCtrl.$viewValue === '' )
            {
                removeColor();
                return;
            }

            var palette, hue;

            // If ModelType Class
            if ( vm.msModelType === 'class' )
            {
                var color = vm.modelCtrl.$viewValue.split('-');
                if ( color.length >= 5 )
                {
                    palette = color[1] + '-' + color[2];
                    hue = color[3];
                }
                else
                {
                    palette = color[1];
                    hue = color[2];
                }
            }

            // If ModelType Object
            else if ( vm.msModelType === 'obj' )
            {
                palette = vm.modelCtrl.$viewValue.palette;
                hue = vm.modelCtrl.$viewValue.hue || 500;
            }

            // Update Selected Color
            updateSelectedColor(palette, hue);
        }

        /**
         * Update Selected Color
         * @param palette
         * @param hue
         */
        function updateSelectedColor(palette, hue)
        {
            vm.selectedColor = {
                palette     : palette,
                hue         : hue,
                class       : 'md-' + palette + '-' + hue + '-bg',
                bgColorValue: fuseGenerator.rgba(vm.palettes[palette][hue].value),
                fgColorValue: fuseGenerator.rgba(vm.palettes[palette][hue].contrast)
            };

            // If Model object not Equals the selectedColor update it
            // it can be happen when the model only have pallete and hue values
            if ( vm.msModelType === 'obj' && !angular.equals(vm.selectedColor, vm.modelCtrl.$viewValue) )
            {
                // Update Model Value
                updateModel();
            }

            activateHueSelection(palette, vm.palettes[palette]);

            $scope.$selectedColor = vm.selectedColor;
        }

        /**
         * Update Model Value by model type
         */
        function updateModel()
        {
            if ( vm.msModelType === 'class' )
            {
                vm.modelCtrl.$setViewValue(vm.selectedColor.class);
            }
            else if ( vm.msModelType === 'obj' )
            {
                vm.modelCtrl.$setViewValue(vm.selectedColor);
            }
        }
    }

    /** @ngInject */
    function msMaterialColorPicker()
    {
        return {
            require    : ['msMaterialColorPicker', 'ngModel'],
            restrict   : 'E',
            scope      : {
                ngModel    : '=',
                msModelType: '@?'
            },
            controller : 'msMaterialColorPickerController as vm',
            transclude : true,
            templateUrl: 'app/core/directives/ms-material-color-picker/ms-material-color-picker.html',
            link       : function (scope, element, attrs, controllers, transclude)
            {
                var ctrl = controllers[0];

                /**
                 *  Pass model controller to directive controller
                 */
                ctrl.modelCtrl = controllers[1];

                /**
                 * ModelType: 'obj', 'class'(default)
                 * @type {string|string}
                 */
                ctrl.msModelType = scope.msModelType || 'class';

                transclude(scope, function (clone)
                {
                    clone = clone.filter(function (i, el)
                    {
                        return ( el.nodeType === 1 ) ? true : false;
                    });

                    if ( clone.length )
                    {
                        element.find('ms-color-picker-button').replaceWith(clone);
                    }
                });
            }
        };
    }
})();