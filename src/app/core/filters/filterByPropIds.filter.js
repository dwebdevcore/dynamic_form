(function ()
{
    'use strict';

    angular
        .module('app.core')
        .filter('filterByPropIds', filterByPropIds);

    /** @ngInject */
    function filterByPropIds()
    {
        return function (items, parameter, ids)
        {
            if ( items.length === 0 || !ids || ids.length === 0 )
            {
                return items;
            }

            var filtered = [];

            for ( var i = 0; i < items.length; i++ )
            {
                var item = items[i];
                var match = false;

                for ( var j = 0; j < ids.length; j++ )
                {
                    var id = ids[j];
                    if ( item[parameter].indexOf(id) > -1 )
                    {
                        match = true;
                        break;
                    }
                }

                if ( match )
                {
                    filtered.push(item);
                }

            }

            return filtered;

        };
    }

})();