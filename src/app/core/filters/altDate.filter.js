(function ()
{
    'use strict';

    angular
        .module('app.core')
        .filter('altDate', altDate);

    /** @ngInject */
    function altDate()
    {
        return function (value)
        {
            var diff = Date.now() - new Date(value);

            /**
             * If in a hour
             * e.g. "2 minutes ago"
             */
            if ( diff < (60 * 60 * 1000) )
            {
                return moment(value).fromNow();
            }
            /*
             * If in the day
             * e.g. "11:23"
             */
            else if ( diff < (60 * 60 * 24 * 1000) )
            {
                return moment(value).format('HH:mm');
            }
            /*
             * If in week
             * e.g "Tuesday"
             */
            else if ( diff < (60 * 60 * 24 * 7 * 1000) )
            {
                return moment(value).format('dddd');
            }
            /*
             * If more than a week
             * e.g. 03/29/2016
             */
            else
            {
                return moment(value).calendar();
            }

        };
    }

})();