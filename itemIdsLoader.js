var allKnownItemIdsAndNames;
var detailedItemsToAdd = [];
var newList;

$(document).ready(function () {
    $('#getAndCopyButton').click(function () {
        $('#getAndCopyButton').hide();
        $('#progressShower').html('fetching known ids...');
        getAllKnownIdsAndNames();
    });
});

var getAllKnownIdsAndNames = function() {
    $.getJSON('allItemIdsAndNames.json', function(data) {
        allKnownItemIdsAndNames = data;
        updateItemIds();
    });
};

var updateItemIds = function() {
    $('#progressShower').html('fetching gw2 ids...');
    var gw2ids = gw2ApiCall('v2/items');

    $('#progressShower').html('generating items to add');
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

    $('#progressShower').html('fetching known ids...');
    for (var i = 0; i < groups.length; i++) {
        $('#progressShower').html('fetching known ids...' + i + ' of ' + groups.length);
        var detailedGroupItems = gw2ApiCall('v2/items', [{ids:groups[i].toString()}]);
        if (detailedGroupItems) {
            detailedItemsToAdd = detailedItemsToAdd.concat(detailedGroupItems);
        }
    }

    $('#progressShower').html('generating new list');
    var itemsToAddIdsAndNames = detailedItemsToAdd.map(function(item) {
        return {id:item.id,name:item.name};
    });

    newList = allKnownItemIdsAndNames.concat(itemsToAddIdsAndNames);

    $('#progressShower').html('copying to text area');
    putNewListIntoTextField(newList);
};

var putNewListIntoTextField = function(thingToCopy) {
    var $temp = $('<textarea></textarea>');
    $('body').append($temp);
    $temp.val(JSON.stringify(thingToCopy)).select();
    $('#progressShower').html('Done.');
}
