var allItemIds;

$.getJSON('allIds.json', function(data) {
    allItemIds = data;
    doTheThing(data);
});


var doTheThing = function(knownIds) {
    debugger;
    var itemsToDelete = $.grep(allItemIds, function(item){return $.inArray(item, gw2ids) == -1});
    var itemsToAdd = $.grep(gw2ids, function(item){return $.inArray(item, allItemIds) == -1});
};
