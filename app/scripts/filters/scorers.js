'use strict';

angular.module('beerPongTournamentApp')
.filter('scorers', function () {
    return function (items,filterType, filter) {
        console.log(items,filterType, filter);
        if(filterType < 0 || filterType>-1 && !filter){
            return items;
        }
        else if(filterType == 0){
            var newItems = [];
            for (var i = 0, len=items.length; i < len; i++) {
                if (items[i]['groupName'] === filter) {
                    newItems.push(items[i]);
                }
            };
            return newItems;
        }
        else{
            var newItems = [];
            for (var i = 0, len=items.length; i < len; i++) {
                if (items[i]['teamName'] === filter) {
                    newItems.push(items[i]);
                }
            };
            return newItems;
        }
    };
});
