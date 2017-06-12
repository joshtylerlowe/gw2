var baseUrl = 'https://api.guildwars2.com/';
var sortByBuys = true;
var itemsToCompareList = [];
var searchedItemsList = [];
var selectedItemsList = [];
var prebuiltLists = [];

$(document).ready(function () {
    $('#search-results-container').hide();
    $('.full-page-loading-spinner-container').show();

    $.each(prebuiltLists, function (x, y) {
        $('#prebuilt-lists').append($('<option></option>').val(y.id).html(y.name));
    });
});

var gw2ApiCall = function (endpoint, parameters) {

    var constructedParameters = '';
    var result = false;

    if (parameters && parameters.length > 0) {

        if (parameters.length > 1) {

            constructedParameters = '/' + parameters[0].value;

        } else {

            constructedParameters += '?';

            for (i = 0; i < parameters.length; i++) {

                if (i > 0) {
                    constructedParameters += '&';
                }

                $.each(parameters[i], function (key, value) {
                    constructedParameters += key + '=' + value;
                });
            }
        }
    }

    $.ajax({
        async: false,
        type: 'GET',
        dataType: 'json',
        url: baseUrl + endpoint + constructedParameters,
        success: function (ret) {
            result = ret;
        },
        error: function (error) {
            alert(error.message);
        }
    });

    return result;
};

var allItems;

$.getJSON('allItemIdsAndNames.json', function (response) {
    allItems = response;
    $('.full-page-loading-spinner-container').hide();
});

var prebuiltCompare = function () {
    var prebuiltCompareList = $.grep(prebuiltLists, function (x) {
        return x.id == $('#prebuilt-lists').val();
    });
    var prebuiltCompareListWithInfo = gw2ApiCall('v2/items', [{ ids: prebuiltCompareList[0].list.toString() }]);

    itemsToCompareList = $.grep(prebuiltCompareListWithInfo, function (x, y) {
        return _.contains(prebuiltCompareList[0].list, x.id);
    });

    generateTable();
}

var searchForItem = function () {
    var isExactSearch = $('#search-is-exact').is(':checked');
    var searchString = $('#search').val().toLowerCase();
    var searchResults = $.grep(allItems, function (item) {
        if (isExactSearch) {
            return item.name.toLowerCase() == searchString;
        } else {
            return (item.name.toLowerCase()).indexOf(searchString) >= 0;
        }
    });
    var itemIdsToGetInfo = _.pluck(searchResults, "id");
    searchedItemsList = gw2ApiCall('v2/items', [{ ids: itemIdsToGetInfo.toString() }]);

    var htmlString = '';

    $.each(searchedItemsList, function (key, value) {
        htmlString += '<div class="search-result-container" onclick="addItemToList(' + value.id + ')"><div class="bordered-item"><img class="item-icon ' + value.rarity + '" src="' + value.icon + '" /></div>' + value.name + '</div><br>'
    });

    $('#search-results').html(htmlString);
    $('#search-results-container').show();
};

var removeItemFromList = function (element) {
    var index = _.findIndex(selectedItemsList, { id: parseInt(element.id) });

    if (index >= 0) {
        selectedItemsList.splice(index, 1);
    }

    generateSelectedItemsList();
}

var addItemToList = function (id) {
    if (_.findIndex(selectedItemsList, { id: parseInt(id) }) < 0) {
        selectedItemsList.push(_.findWhere(searchedItemsList, { id: id }));
    }

    generateSelectedItemsList();
};

var generateSelectedItemsList = function () {
    var htmlString = '';
    $.each(selectedItemsList, function (key, value) {
        htmlString += '<div class="search-result-container"><div class="delete-item" onclick="removeItemFromList(this)" id="' + value.id + '"><img src="red_x.png"></div><div class="bordered-item"><img class="item-icon ' + value.rarity + '" src="' + value.icon + '" /></div>' + value.name + '</div><br>'
    });

    $('#items-list').html(htmlString);
};

var compareItemsFromList = function () {
    itemsToCompareList = selectedItemsList;

    generateTable();
};

var generateTable = function () {
    $('#item-list').find("tr:gt(0)").remove();

    var ids = [];
    for (var i = 0; i < itemsToCompareList.length; i++) {
        ids.push(itemsToCompareList[i].id);
    }

    var parameters = [{ ids: ids.toString() }];

    var prices = gw2ApiCall("v2/commerce/prices", parameters);

    var pricedItems = _.map(itemsToCompareList, function (item) {
        return _.extend(item, _.findWhere(prices, { id: item.id }));
    });

    var sortedItems = sortByPrices(sortByBuys, pricedItems);

    $.each(sortedItems, function (key, value) {

        var buy = convertValueToGoldHtmlString(value.buys);
        var sell = convertValueToGoldHtmlString(value.sells);
        var bonusBuyData = value.buys ? '<br><div class="quantity">(' + value.buys.quantity + ')</div>' : '';
        var bonusSellData = value.sells ? '<br><div class="quantity">(' + value.sells.quantity + ')</div>' : '';

        $('#item-list tr:last').after(
            '<tr class="item-row">' +
                '<td><div class="bordered-item"><img class="item-icon ' + value.rarity + '" src="' + value.icon + '" /></div></td>' +
                '<td class="row-name">' + value.name + '</td>' + //name
                '<td>' + buy + bonusBuyData + '</td>' + //buy
                '<td>' + sell + bonusSellData + '</td>' + //sell
            '</tr>'
            );
    });
};

var convertValueToGoldHtmlString = function (value) {
    var returnValue = 'N/A';

    if (value) {

        var amount = value.unit_price;

        var gold = '';
        var silver = '';
        var copper = '';

        if (amount > 0) {
            copper = amount % 100;
            amount = Math.floor(amount / 100);
        }
        if (amount > 0) {
            silver = amount % 100;
            amount = Math.floor(amount / 100);
        }
        if (amount > 0) {
            gold = amount
        }

        returnValue =
            (gold > 0 ? gold + ' <img class="currency" src="Gold_coin.png"> ' : '') +
            (silver > 0 ? (silver < 10 && gold > 0 ? '0' + silver : silver) + ' <img class="currency" src="Silver_coin.png"> ' : (gold > 0 ? '00 <img class="currency" src="Silver_coin.png"> ' : '')) +
            (copper > 0 ? (copper < 10 && silver > 0 ? '0' + copper : copper) + ' <img class="currency" src="Copper_coin.png">' : (gold > 0 || silver > 0 ? '00 <img class="currency" src="Copper_coin.png"> ' : ''));
    }

    return returnValue;
}

var sortByPrices = function(sortByBuys, pricedItems) {

    return pricedItems.sort(function (a, b) {
        if (a.sells == null) {
            return 1;
        }
        else if (b.sells == null) {
            return -1;
        }

        if (sortByBuys) {
            if (a.buys.unit_price == b.buys.unit_price) {
                return 0;
            }
            else {
                return a.buys.unit_price < b.buys.unit_price ? 1 : -1;
            }
        } else {
            if (a.sells.unit_price == b.sells.unit_price) {
                return 0;
            }
            else {
                return a.sells.unit_price < b.sells.unit_price ? 1 : -1;
            }
        }
    });
};

var setSortByBuys = function (value, element) {
    var $element = $(element);
    $element.closest(".filterable").children("a").removeClass("selected-filter");
    $element.addClass("selected-filter");
    sortByBuys = value;
    generateTable();
}

var jubilantDyePackItemIds = [
  67284,
  67285,
  67286,
  67287,
  67288,
  67289,
  69231,
  68728,
  69477,
  69229,
  69057,
  69109,
  69172,
  69038,
  69469,
  69451,
  70364,
  70308,
  70368,
  70362,
  70322,
  70329,
  77540,
  77524,
  77559,
  77553,
  77499,
  77534,
  78736,
  78722,
  78737,
  78719,
  78729,
  78738,
  78739,
  78721,
  78735,
  79309,
  79317,
  79340,
  79344,
  79346,
  79358
];
var celebratoryDyePackItemIds = [
  41757,
  41756,
  41752,
  41755,
  41753,
  41754,
  41746,
  41747,
  41749,
  41750,
  41748,
  41751,
  47905,
  47906,
  47904,
  47902,
  47901,
  47903,
  48924,
  48925,
  48926,
  48927,
  48928,
  48929,
  49525,
  49526,
  49527,
  49528,
  49530,
  64198,
  64199,
  64200,
  64201,
  64202,
  64203,
  65164,
  65165,
  65166,
  65167,
  65168,
  65169,
  67284,
  67285,
  67286,
  67287,
  67288,
  67289,
  67991,
  67992,
  67993,
  67994,
  67995,
  67996,
  68675,
  68673,
  68677,
  68674,
  68676,
  68678
];
var chestOfInscriptionsItemIds = [
  70434,
  46689,
  19920,
  19919,
  46686,
  46687,
  71433,
  19917,
  66767,
  19922,
  19918,
  72875,
  46690,
  73305,
  19921,
  73772,
  37181,
  66638,
  41560,
  46684,
  19923,
  49865,
  43775,
  76048,
  46688,
  76361,
  46685,
  67830,
  77001,
  38434
];
var chestOfInsigniaItemIds = [
  70424,
  19915,
  19914,
  46711,
  70766,
  46712,
  43774,
  71262,
  46708,
  19912,
  19913,
  49866,
  46710,
  19916,
  19911,
  41556,
  73227,
  19910,
  66641,
  37177,
  74430,
  46713,
  49522,
  75354,
  75981,
  67831,
  76115,
  46709
];
var reclaimedWeaponsItemIds = [
 70655,
 71215,
 71382,
 71841,
 72152,
 72389,
 72467,
 72660,
 72773,
 72952,
 73796,
 74484,
 76890,
 77078,
 77144,
 77239
];
var watchworkSproketItemIds = [
  44951,
  44950,
  44944,
  44956,
  44957,
  44947
];

var prebuiltLists = [
    {
        name: 'Chest of Inscriptions',
        list: chestOfInscriptionsItemIds,
        id: 77948
    },
    {
        name: 'Chest of Insignia',
        list: chestOfInsigniaItemIds,
        id: 77886
    },
    {
        name: 'Celebratory Dye Pack',
        list: celebratoryDyePackItemIds,
        id: 70229
    },
    {
        name: 'Jubilant Dye Pack',
        list: jubilantDyePackItemIds,
        id: 79351
    },
    {
        name: 'Reclaimed Weapons',
        list: reclaimedWeaponsItemIds,
        id: 1000001
    },
    {
        name: 'Watchwork Sprocket Produced Items',
        list: watchworkSproketItemIds,
        id: 1000002
    }
];
