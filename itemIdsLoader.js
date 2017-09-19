var allKnownItemIdsAndNames;

var getAllKnownIdsAndNames = function() {
    $.getJSON('allItemIdsAndNames.json', function(data) {
        allKnownItemIdsAndNames = data;
    });
};

var updateItemIds = function() {
    var gw2ids = gw2ApiCall('v2/items');

    var map = {};
    for (var i = 0; i < allKnownItemIdsAndNames.length; i++) {
      map[allKnownItemIdsAndNames[i].id] = 1;
    }
    var itemsToAdd = [];
    for (i = 0; i < gw2ids.length; i++) {
      if (!(gw2ids[i] in map)) {
        itemsToAdd.push(gw2ids[i]);
      }
    }

    var groups = [];
    $.each(itemsToAdd, function (n, v) {
        var ng = Math.trunc(n/100);

        groups[ng] = groups[ng] || [];
        groups[ng].push(v);
    });
    debugger;
};
