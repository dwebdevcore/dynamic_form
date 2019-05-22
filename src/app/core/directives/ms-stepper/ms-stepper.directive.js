(function ()
{
    'use strict';

    angular
        .module('app.core')
        .controller('MsStepperController', MsStepperController)
        .directive('msHorizontalStepper', msHorizontalStepperDirective)
        .directive('msHorizontalStepperStep', msHorizontalStepperStepDirective)
        .directive('msVerticalStepper', msVerticalStepperDirective)
        .directive('msVerticalStepperStep', msVerticalStepperStepDirective);

    /** @ngInject */
    function MsStepperController($timeout)
    {
        var vm = this;

        // Data
        vm.mainForm = undefined;

        vm.orientation = 'horizontal';
        vm.steps = [];
        vm.currentStep = undefined;
        vm.currentStepNumber = 1;

        // Methods
        vm.setOrientation = setOrientation;
        vm.registerMainForm = registerMainForm;
        vm.registerStep = registerStep;
        vm.setupSteps = setupSteps;
        vm.resetForm = resetForm;

        vm.setCurrentStep = setCurrentStep;

        vm.gotoStep = gotoStep;
        vm.gotoPreviousStep = gotoPreviousStep;
        vm.gotoNextStep = gotoNextStep;
        vm.gotoFirstStep = gotoFirstStep;
        vm.gotoLastStep = gotoLastStep;

        vm.isFirstStep = isFirstStep;
        vm.isLastStep = isLastStep;

        vm.isStepCurrent = isStepCurrent;
        vm.isStepDisabled = isStepDisabled;
        vm.isStepOptional = isStepOptional;
        vm.isStepHidden = isStepHidden;
        vm.filterHiddenStep = filterHiddenStep;
        vm.isStepValid = isStepValid;
        vm.isStepNumberValid = isStepNumberValid;

        vm.isFormValid = isFormValid;

        //////////

        /**
         * Set the orientation of the stepper
         *
         * @param orientation
         */
        function setOrientation(orientation)
        {
            vm.orientation = orientation || 'horizontal';
        }

        /**
         * Register the main form
         *
         * @param form
         */
        function registerMainForm(form)
        {
            vm.mainForm = form;
        }

        /**
         * Register a step
         *
         * @param element
         * @param scope
         * @param form
         */
        function registerStep(element, scope, form)
        {
            var step = {
                element           : element,
                scope             : scope,
                form              : form,
                stepNumber        : scope.step || (vm.steps.length + 1),
                stepTitle         : scope.stepTitle,
                stepTitleTranslate: scope.stepTitleTranslate
            };

            // Push the step into steps array
            vm.steps.push(step);

            // Sort steps by stepNumber
            vm.steps.sort(function (a, b)
            {
                return a.stepNumber - b.stepNumber;
            });

            return step;
        }

        /**
         * Setup steps for the first time
         */
        function setupSteps()
        {
            vm.setCurrentStep(vm.currentStepNumber);
        }

        /**
         * Reset steps and the main form
         */
        function resetForm()
        {
            // Timeout is required here because we need to
            // let form model to reset before setting the
            // statuses
            $timeout(function ()
            {
                // Reset all the steps
                for ( var x = 0; x < vm.steps.length; x++ )
                {
                    vm.steps[x].form.$setPristine();
                    vm.steps[x].form.$setUntouched();
                }

                // Reset the main form
                vm.mainForm.$setPristine();
                vm.mainForm.$setUntouched();

                // Go to first step
                gotoFirstStep();
            });
        }

        /**
         * Set current step
         *
         * @param stepNumber
         */
        function setCurrentStep(stepNumber)
        {
            // If the stepNumber is not a valid step number, bail...
            if ( !isStepNumberValid(stepNumber) )
            {
                return;
            }

            // Update the current step number
            vm.currentStepNumber = stepNumber;

            if ( vm.orientation === 'horizontal' )
            {
                // Hide all steps
                for ( var i = 0; i < vm.steps.length; i++ )
                {
                    vm.steps[i].element.hide();
                }

                // Show the current step
                vm.steps[vm.currentStepNumber - 1].element.show();
            }
            else if ( vm.orientation === 'vertical' )
            {
                // Hide all step content
                for ( var j = 0; j < vm.steps.length; j++ )
                {
                    vm.steps[j].element.find('.ms-stepper-step-content').hide();
                }

                // Show the current step content
                vm.steps[vm.currentStepNumber - 1].element.find('.ms-stepper-step-content').show();
            }
        }

        /**
         * Go to a step
         *
         * @param stepNumber
         */
        function gotoStep(stepNumber)
        {
            // If the step we are about to go
            // is hidden, bail...
            if ( isStepHidden(stepNumber) )
            {
                return;
            }

            vm.setCurrentStep(stepNumber);
        }

        /**
         * Go to the previous step
         */
        function gotoPreviousStep()
        {
            var stepNumber = vm.currentStepNumber - 1;

            // Test the previous steps and make sure we
            // will land to the one that is not hidden
            for ( var s = stepNumber; s >= 1; s-- )
            {
                if ( !isStepHidden(s) )
                {
                    stepNumber = s;
                    break;
                }
            }

            vm.setCurrentStep(stepNumber);
        }

        /**
         * Go to the next step
         */
        function gotoNextStep()
        {
            var stepNumber = vm.currentStepNumber + 1;

            // Test the following steps and make sure we
            // will land to the one that is not hidden
            for ( var s = stepNumber; s <= vm.steps.length; s++ )
            {
                if ( !isStepHidden(s) )
                {
                    stepNumber = s;
                    break;
                }
            }

            vm.setCurrentStep(stepNumber);
        }

        /**
         * Go to the first step
         */
        function gotoFirstStep()
        {
            vm.setCurrentStep(1);
        }

        /**
         * Go to the last step
         */
        function gotoLastStep()
        {
            vm.setCurrentStep(vm.steps.length);
        }

        /**
         * Check if the current step is the first step
         *
         * @returns {boolean}
         */
        function isFirstStep()
        {
            return vm.currentStepNumber === 1;
        }

        /**
         * Check if the current step is the last step
         *
         * @returns {boolean}
         */
        function isLastStep()
        {
            return vm.currentStepNumber === vm.steps.length;
        }

        /**
         * Check if the given step is the current one
         *
         * @param stepNumber
         * @returns {null|boolean}
         */
        function isStepCurrent(stepNumber)
        {
            // If the stepNumber is not a valid step number, bail...
            if ( !isStepNumberValid(stepNumber) )
            {
                return null;
            }

            return vm.currentStepNumber === stepNumber;
        }

        /**
         * Check if the given step should be disabled
         *
         * @param stepNumber
         * @returns {null|boolean}
         */
        function isStepDisabled(stepNumber)
        {
            // If the stepNumber is not a valid step number, bail...
            if ( !isStepNumberValid(stepNumber) )
            {
                return null;
            }

            var disabled = false;

            for ( var i = 1; i < stepNumber; i++ )
            {
                if ( !isStepValid(i) )
                {
                    disabled = true;
                    break;
                }
            }

            return disabled;
        }

        /**
         * Check if the given step is optional
         *
         * @param stepNumber
         * @returns {null|boolean}
         */
        function isStepOptional(stepNumber)
        {
            // If the stepNumber is not a valid step number, bail...
            if ( !isStepNumberValid(stepNumber) )
            {
                return null;
            }

            return vm.steps[stepNumber - 1].scope.optionalStep;
        }

        /**
         * Check if the given step is hidden
         *
         * @param stepNumber
         * @returns {null|boolean}
         */
        function isStepHidden(stepNumber)
        {
            // If the stepNumber is not a valid step number, bail...
            if ( !isStepNumberValid(stepNumber) )
            {
                return null;
            }

            return !!vm.steps[stepNumber - 1].scope.hideStep;
        }

        /**
         * Check if the given step is hidden as a filter
         *
         * @param step
         * @returns {boolean}
         */
        function filterHiddenStep(step)
        {
            return !isStepHidden(step.stepNumber);
        }

        /**
         * Check if the given step is valid
         *
         * @param stepNumber
         * @returns {null|boolean}
         */
        function isStepValid(stepNumber)
        {
            // If the stepNumber is not a valid step number, bail...
            if ( !isStepNumberValid(stepNumber) )
            {
                return null;
            }

            // If the step is optional, always return true
            if ( isStepOptional(stepNumber) )
            {
                return true;
            }

            return vm.steps[stepNumber - 1].form.$valid;
        }

        /**
         * Check if the given step number is a valid step number
         *
         * @param stepNumber
         * @returns {boolean}
         */
        function isStepNumberValid(stepNumber)
        {
            return !(angular.isUndefined(stepNumber) || stepNumber < 1 || stepNumber > vm.steps.length);
        }

        /**
         * Check if the entire form is valid
         *
         * @returns {boolean}
         */
        function isFormValid()
        {
            return vm.mainForm.$valid;
        }
    }

    /** @ngInject */
    function msHorizontalStepperDirective()
    {
        return {
            restrict        : 'A',
            scope           : {},
            require         : ['form', 'msHorizontalStepper'],
            priority        : 1001,
            controller      : 'MsStepperController as MsStepper',
            bindToController: {
                model: '=ngModel'
            },
            transclude      : true,
            templateUrl     : 'app/core/directives/ms-stepper/templates/horizontal/horizontal.html',
            compile         : function (tElement)
            {
                tElement.addClass('ms-stepper');

                return function postLink(scope, iElement, iAttrs, ctrls)
                {
                    var FormCtrl = ctrls[0],
                        MsStepperCtrl = ctrls[1];

                    // Register the main form and setup
                    // the steps for the first time
                    MsStepperCtrl.setOrientation('horizontal');
                    MsStepperCtrl.registerMainForm(FormCtrl);
                    MsStepperCtrl.setupSteps();
                };
            }
        };
    }

    /** @ngInject */
    function msHorizontalStepperStepDirective()
    {
        return {
            restrict: 'E',
            require : ['form', '^msHorizontalStepper'],
            priority: 1000,
            scope   : {
                step              : '=?',
                stepTitle         : '=?',
                stepTitleTranslate: '=?',
                optionalStep      : '=?',
                hideStep          : '=?'
            },
            compile : function (tElement)
            {
                tElement.addClass('ms-stepper-step');

                return function postLink(scope, iElement, iAttrs, ctrls)
                {
                    var FormCtrl = ctrls[0],
                        MsStepperCtrl = ctrls[1];

                    // Is it an optional step?
                    scope.optionalStep = angular.isDefined(iAttrs.optionalStep);

                    // Register the step
                    MsStepperCtrl.registerStep(iElement, scope, FormCtrl);

                    // Hide the step by default
                    iElement.hide();
                };
            }
        };
    }

    /** @ngInject */
    function msVerticalStepperDirective($timeout)
    {
        return {
            restrict        : 'A',
            scope           : {},
            require         : ['form', 'msVerticalStepper'],
            priority        : 1001,
            controller      : 'MsStepperController as MsStepper',
            bindToController: {
                model: '=ngModel'
            },
            transclude      : true,
            templateUrl     : 'app/core/directives/ms-stepper/templates/vertical/vertical.html',
            compile         : function (tElement)
            {
                tElement.addClass('ms-stepper');

                return function postLink(scope, iElement, iAttrs, ctrls)
                {
                    var FormCtrl = ctrls[0],
                        MsStepperCtrl = ctrls[1];

                    // Register the main form and setup
                    // the steps for the first time

                    // Timeout is required in vertical stepper
                    // as we are using transclusion in steps.
                    // We have to wait for them to be transcluded
                    // and registered to the controller
                    $timeout(function ()
                    {
                        MsStepperCtrl.setOrientation('vertical');
                        MsStepperCtrl.registerMainForm(FormCtrl);
                        MsStepperCtrl.setupSteps();
                    });
                };
            }
        };
    }

    /** @ngInject */
    function msVerticalStepperStepDirective()
    {
        return {
            restrict   : 'E',
            require    : ['form', '^msVerticalStepper'],
            priority   : 1000,
            scope      : {
                step              : '=?',
                stepTitle         : '=?',
                stepTitleTranslate: '=?',
                optionalStep      : '=?',
                hideStep          : '=?'
            },
            transclude : true,
            templateUrl: 'app/core/directives/ms-stepper/templates/vertical/step/vertical-step.html',
            compile    : function (tElement)
            {
                tElement.addClass('ms-stepper-step');

                return function postLink(scope, iElement, iAttrs, ctrls)
                {
                    var FormCtrl = ctrls[0],
                        MsStepperCtrl = ctrls[1];

                    // Is it an optional step?
                    scope.optionalStep = angular.isDefined(iAttrs.optionalStep);

                    // Register the step
                    scope.stepInfo = MsStepperCtrl.registerStep(iElement, scope, FormCtrl);

                    // Expose the controller to the scope
                    scope.MsStepper = MsStepperCtrl;

                    // Hide the step content by default
                    iElement.find('.ms-stepper-step-content').hide();
                };
            }
        };
    }
})();