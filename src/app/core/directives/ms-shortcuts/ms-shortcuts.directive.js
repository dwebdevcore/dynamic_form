(function ()
{
    'use strict';

    angular
        .module('app.core')
        .controller('MsShortcutsController', MsShortcutsController)
        .directive('msShortcuts', msShortcutsDirective);

    /** @ngInject */
    function MsShortcutsController($scope, $cookies, $document, $timeout, $q, msNavigationService)
    {
        var vm = this;

        // Data
        vm.query = '';
        vm.queryOptions = {
            debounce: 300
        };
        vm.resultsLoading = false;
        vm.selectedResultIndex = 0;
        vm.ignoreMouseEvents = false;
        vm.mobileBarActive = false;

        vm.results = null;
        vm.shortcuts = [];

        vm.sortableOptions = {
            ghostClass   : 'ghost',
            forceFallback: true,
            fallbackClass: 'dragging',
            onSort       : function ()
            {
                vm.saveShortcuts();
            }
        };

        // Methods
        vm.populateResults = populateResults;
        vm.loadShortcuts = loadShortcuts;
        vm.saveShortcuts = saveShortcuts;
        vm.addShortcut = addShortcut;
        vm.removeShortcut = removeShortcut;
        vm.handleResultClick = handleResultClick;

        vm.absorbEvent = absorbEvent;
        vm.handleKeydown = handleKeydown;
        vm.handleMouseenter = handleMouseenter;
        vm.temporarilyIgnoreMouseEvents = temporarilyIgnoreMouseEvents;
        vm.ensureSelectedResultIsVisible = ensureSelectedResultIsVisible;
        vm.toggleMobileBar = toggleMobileBar;

        //////////

        init();

        function init()
        {
            // Load the shortcuts
            vm.loadShortcuts().then(
                // Success
                function (response)
                {
                    vm.shortcuts = response;

                    // Add shortcuts as results by default
                    if ( vm.shortcuts.length > 0 )
                    {
                        vm.results = response;
                    }
                }
            );

            // Watch the model changes to trigger the search
            $scope.$watch('MsShortcuts.query', function (current, old)
            {
                if ( angular.isUndefined(current) )
                {
                    return;
                }

                if ( angular.equals(current, old) )
                {
                    return;
                }

                // Show the loader
                vm.resultsLoading = true;

                // Populate the results
                vm.populateResults().then(
                    // Success
                    function (response)
                    {
                        vm.results = response;
                    },
                    // Error
                    function ()
                    {
                        vm.results = [];
                    }
                ).finally(
                    function ()
                    {
                        // Hide the loader
                        vm.resultsLoading = false;
                    }
                );
            });
        }

        /**
         * Populate the results
         */
        function populateResults()
        {
            var results = [],
                flatNavigation = msNavigationService.getFlatNavigation(),
                deferred = $q.defer();

            // Iterate through the navigation array and
            // make sure it doesn't have any groups or
            // none ui-sref items
            for ( var x = 0; x < flatNavigation.length; x++ )
            {
                if ( flatNavigation[x].uisref )
                {
                    results.push(flatNavigation[x]);
                }
            }

            // If there is a query, filter the results
            if ( vm.query )
            {
                results = results.filter(function (item)
                {
                    if ( angular.lowercase(item.title).search(angular.lowercase(vm.query)) > -1 )
                    {
                        return true;
                    }
                });

                // Iterate through one last time and
                // add required properties to items
                for ( var i = 0; i < results.length; i++ )
                {
                    // Add false to hasShortcut by default
                    results[i].hasShortcut = false;

                    // Test if the item is in the shortcuts list
                    for ( var y = 0; y < vm.shortcuts.length; y++ )
                    {
                        if ( vm.shortcuts[y]._id === results[i]._id )
                        {
                            results[i].hasShortcut = true;
                            break;
                        }
                    }
                }
            }
            else
            {
                // If the query is empty, that means
                // there is nothing to search for so
                // we will populate the results with
                // current shortcuts if there is any
                if ( vm.shortcuts.length > 0 )
                {
                    results = vm.shortcuts;
                }
            }

            // Reset the selected result
            vm.selectedResultIndex = 0;

            // Fake the service delay
            $timeout(function ()
            {
                // Resolve the promise
                deferred.resolve(results);
            }, 250);

            // Return a promise
            return deferred.promise;
        }

        /**
         * Load shortcuts
         */
        function loadShortcuts()
        {
            var deferred = $q.defer();

            // For the demo purposes, we will
            // load the shortcuts from the cookies.
            // But here you can make an API call
            // to load them from the DB.
            var shortcuts = angular.fromJson($cookies.get('FUSE.shortcuts'));

            // No cookie available. Generate one
            // for the demo purposes...
            if ( angular.isUndefined(shortcuts) )
            {
                shortcuts = [
                    {
                        'title'      : 'Sample',
                        'icon'       : 'icon-tile-four',
                        'state'      : 'app.sample',
                        'weight'     : 1,
                        'children'   : [],
                        '_id'        : 'sample',
                        '_path'      : 'apps.sample',
                        'uisref'     : 'app.sample',
                        'hasShortcut': true
                    }
                ];

                $cookies.put('FUSE.shortcuts', angular.toJson(shortcuts));
            }

            // Resolve the promise
            deferred.resolve(shortcuts);

            return deferred.promise;
        }

        /**
         * Save the shortcuts
         */
        function saveShortcuts()
        {
            var deferred = $q.defer();

            // For the demo purposes, we will
            // keep the shortcuts in the cookies.
            // But here you can make an API call
            // to save them to the DB.
            $cookies.put('FUSE.shortcuts', angular.toJson(vm.shortcuts));

            // Fake the service delay
            $timeout(function ()
            {
                deferred.resolve({'success': true});
            }, 250);

            return deferred.promise;
        }

        /**
         * Add item as shortcut
         *
         * @param item
         */
        function addShortcut(item)
        {
            // Update the hasShortcut status
            item.hasShortcut = true;

            // Add as a shortcut
            vm.shortcuts.push(item);

            // Save the shortcuts
            vm.saveShortcuts();
        }

        /**
         * Remove item from shortcuts
         *
         * @param item
         */
        function removeShortcut(item)
        {
            // Update the hasShortcut status
            item.hasShortcut = false;

            // Remove the shortcut
            for ( var x = 0; x < vm.shortcuts.length; x++ )
            {
                if ( vm.shortcuts[x]._id === item._id )
                {
                    // Remove the x-th item from the array
                    vm.shortcuts.splice(x, 1);

                    // If we aren't searching for anything...
                    if ( !vm.query )
                    {
                        // If all the shortcuts have been removed,
                        // null-ify the results
                        if ( vm.shortcuts.length === 0 )
                        {
                            vm.results = null;
                        }
                        // Otherwise update the selected index
                        else
                        {
                            if ( x >= vm.shortcuts.length )
                            {
                                vm.selectedResultIndex = vm.shortcuts.length - 1;
                            }
                        }
                    }
                }
            }

            // Save the shortcuts
            vm.saveShortcuts();
        }

        /**
         * Handle the result click
         *
         * @param item
         */
        function handleResultClick(item)
        {
            // Add or remove the shortcut
            if ( item.hasShortcut )
            {
                vm.removeShortcut(item);
            }
            else
            {
                vm.addShortcut(item);
            }
        }

        /**
         * Absorb the given event
         *
         * @param event
         */
        function absorbEvent(event)
        {
            event.preventDefault();
        }

        /**
         * Handle keydown
         *
         * @param event
         */
        function handleKeydown(event)
        {
            var keyCode = event.keyCode,
                keys = [38, 40];

            // Prevent the default action if
            // one of the keys are pressed that
            // we are listening
            if ( keys.indexOf(keyCode) > -1 )
            {
                event.preventDefault();
            }

            switch ( keyCode )
            {
                // Enter
                case 13:

                    // Trigger result click
                    vm.handleResultClick(vm.results[vm.selectedResultIndex]);

                    break;

                // Up Arrow
                case 38:

                    // Decrease the selected result index
                    if ( vm.selectedResultIndex - 1 >= 0 )
                    {
                        // Decrease the selected index
                        vm.selectedResultIndex--;

                        // Make sure the selected result is in the view
                        vm.ensureSelectedResultIsVisible();
                    }

                    break;

                // Down Arrow
                case 40:

                    // Increase the selected result index
                    if ( vm.selectedResultIndex + 1 < vm.results.length )
                    {
                        // Increase the selected index
                        vm.selectedResultIndex++;

                        // Make sure the selected result is in the view
                        vm.ensureSelectedResultIsVisible();
                    }

                    break;

                default:
                    break;
            }
        }

        /**
         * Handle mouseenter
         *
         * @param index
         */
        function handleMouseenter(index)
        {
            if ( vm.ignoreMouseEvents )
            {
                return;
            }

            // Update the selected result index
            // with the given index
            vm.selectedResultIndex = index;
        }

        /**
         * Set a variable for a limited time
         * to make other functions to ignore
         * the mouse events
         */
        function temporarilyIgnoreMouseEvents()
        {
            // Set the variable
            vm.ignoreMouseEvents = true;

            // Cancel the previous timeout
            $timeout.cancel(vm.mouseEventIgnoreTimeout);

            // Set the timeout
            vm.mouseEventIgnoreTimeout = $timeout(function ()
            {
                vm.ignoreMouseEvents = false;
            }, 250);
        }

        /**
         * Ensure the selected result will
         * always be visible on the results
         * area
         */
        function ensureSelectedResultIsVisible()
        {
            var resultsEl = $document.find('#ms-shortcut-add-menu').find('.results'),
                selectedItemEl = angular.element(resultsEl.find('.result')[vm.selectedResultIndex]);

            if ( resultsEl && selectedItemEl )
            {
                var top = selectedItemEl.position().top - 8,
                    bottom = selectedItemEl.position().top + selectedItemEl.outerHeight() + 8;

                // Start ignoring mouse events
                vm.temporarilyIgnoreMouseEvents();

                if ( resultsEl.scrollTop() > top )
                {
                    resultsEl.scrollTop(top);
                }

                if ( bottom > (resultsEl.height() + resultsEl.scrollTop()) )
                {
                    resultsEl.scrollTop(bottom - resultsEl.height());
                }
            }
        }

        /**
         * Toggle mobile bar
         */
        function toggleMobileBar()
        {
            vm.mobileBarActive = !vm.mobileBarActive;
        }
    }

    /** @ngInject */
    function msShortcutsDirective()
    {
        return {
            restrict        : 'E',
            scope           : {},
            require         : 'msShortcuts',
            controller      : 'MsShortcutsController as MsShortcuts',
            bindToController: {},
            templateUrl     : 'app/core/directives/ms-shortcuts/ms-shortcuts.html',
            compile         : function (tElement)
            {
                // Add class
                tElement.addClass('ms-shortcuts');

                return function postLink(scope, iElement)
                {
                    // Data

                };
            }
        };
    }
})();