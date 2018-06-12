var allKnownItemIdsAndNames;
var apiItemsIdsAndNames;
var detailedItemsToAdd = [];
var detailedApiItems = [];
var updatedList;
var gw2ids = [];

$(document).ready(function () {
    $('#getAndCopyButton').click(function () {
        $('#getAndCopyButton').hide();
        console.log('fetching known ids...');
        $('#progressShower').html('fetching known ids...');
        getAllKnownIdsAndNames();
    });
});

var getAllKnownIdsAndNames = function() {
    $.getJSON('/assets/data/allItemIdsAndNames_6.12.18.json', function(data) {
        allKnownItemIdsAndNames = data;
        updateItemIds();
    });
};

var updateItemIds = function() {
    console.log('fetching gw2 ids...');
    $('#progressShower').html('fetching gw2 ids...');
    gw2ids = gw2ApiCall('v2/items');

    console.log('generating items to add');
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

    console.log('fetching known ids...');
    $('#progressShower').html('fetching known ids...');
    for (var i = 0; i < groups.length; i++) {
        console.log('fetching known ids...' + i + ' of ' + groups.length);
        $('#progressShower').html('fetching known ids...' + i + ' of ' + groups.length);
        var detailedGroupItems = gw2ApiCall('v2/items', [{ids:groups[i].toString()}]);
        if (detailedGroupItems) {
            detailedItemsToAdd = detailedItemsToAdd.concat(detailedGroupItems);
        }
    }

    console.log('generating new list');
    $('#progressShower').html('generating new list');
    var itemsToAddIdsAndNames = detailedItemsToAdd.map(function(item) {
        return {id:item.id,name:item.name};
    });

    updatedList = allKnownItemIdsAndNames.concat(itemsToAddIdsAndNames);

    if (itemsToAddIdsAndNames && itemsToAddIdsAndNames.length > 0) {
        console.log(itemsToAddIdsAndNames.length + ' item(s) to update');
        $('#progressShower').html(itemsToAddIdsAndNames.length + ' items to update</br>copy(JSON.stringify(updatedList))</br>copy(getFormattedItemsToAddList())');
    } else {
        console.log('Nothing to update.');
        $('#progressShower').html('Nothing to update.');
    }
};

var putNewListIntoTextField = function(thingToCopy) {
    var $temp = $('<textarea></textarea>');
    $('body').append($temp);
    $temp.val(JSON.stringify(thingToCopy)).select();
    console.log('Done.');
    $('#progressShower').html('Done.');
}

var getFormattedItemsToAddList = function () {
    var formattedString = '';
    if (detailedItemsToAdd) {
        for (var i = 0; i < detailedItemsToAdd.length; i++) {
            formattedString +=
                'name: ' + detailedItemsToAdd[i].name + '\n' +
                'link: ' + detailedItemsToAdd[i].chat_link + '\n' +
                'description: ' + (detailedItemsToAdd[i].description ? detailedItemsToAdd[i].description : 'N/A') +
                '\n\n';
        }
    }

    return formattedString;
}

var getAllApiDetailedItems = function() {
    var groupedGw2ids = [];

    while (gw2ids.length > 0) {
        groupedGw2ids.push(gw2ids.splice(0, 100));
    }

    for (var i = 0; i < groupedGw2ids.length; i++) {
        console.log('fetching api items...' + (i+1) + ' of ' + groupedGw2ids.length);
        detailedApiItems = detailedApiItems.concat(gw2ApiCall('v2/items', [{ids:groupedGw2ids[i].toString()}]));
    }

    apiItemsIdsAndNames = detailedApiItems.map(function(item) {
        return {id:item.id,name:item.name};
    });
};
