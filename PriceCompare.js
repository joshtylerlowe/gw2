var sortByBuys = true;
var itemsToCompareList = [];
var searchedItemsList = [];
var selectedItemsList = [];
var prebuiltLists = [];
var sortByBuysAsc = false;
var sortByBuysDesc = true;
var sortBySellsAsc = false;
var sortBySellsDesc = false;

$(document).ready(function () {
    $.each(prebuiltLists, function (x, y) {
        $('#prebuilt-lists').append($('<option></option>').val(y.id).html(y.name));
    });

    $('input#search').on('input', function() {
        if ($(this).val().length > 2) {
            searchForItem();
        } else {
            $('#search-results').html('');
            $('.search-results-section').hide();
        }
    });
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
};

var searchForItem = function () {
    var searchString = $('#search').val().toLowerCase();
    var searchResults = $.grep(allItems, function (item) {
        return (item.name.toLowerCase()).indexOf(searchString) >= 0;
    }).slice(0,25);

    if (searchResults.length > 0) {
        var itemIdsToGetInfo = _.pluck(searchResults, "id");
        searchedItemsList = gw2ApiCall('v2/items', [{ ids: itemIdsToGetInfo.toString() }]);

        var htmlString = '';

        $.each(searchedItemsList, function (key, value) {
            htmlString += '<div class="search-result-container" onclick="addItemToList(' + value.id + ')"><div class="bordered-item"><img class="item-icon ' + value.rarity + '" src="' + value.icon + '" /></div><div class="item-name">' + value.name + '</div></div><br>'
        });

        $('#search-results').html(htmlString);
        $('.search-results-section').show();
    } else {
        $('#search-results').html('');
        $('.search-results-section').hide();
    }
};

var removeItemFromList = function (element) {
    var index = _.findIndex(selectedItemsList, { id: parseInt(element.id) });

    if (index >= 0) {
        selectedItemsList.splice(index, 1);
    }

    itemsToCompareList = selectedItemsList;

    generateTable();
};

var addItemToList = function (id) {
    if (_.findIndex(selectedItemsList, { id: parseInt(id) }) < 0) {
        selectedItemsList.push(_.findWhere(searchedItemsList, { id: id }));
    }

    itemsToCompareList = selectedItemsList;

    generateTable();
};

var lastPrices;
var generateTable = function (skip) {
    if (itemsToCompareList.length > 0) {
        $('#item-list').show();
    } else {
        $('#item-list').hide();
        return;
    }

    $('#item-list').find("tr:gt(0)").remove();
    
    var ids = [];
    for (var i = 0; i < itemsToCompareList.length; i++) {
        ids.push(itemsToCompareList[i].id);
    }

    var pricedItems;

    if (skip) {
        pricedItems = lastPrices;
    } else {
        var prices = gw2ApiCall("v2/commerce/prices", [{ ids: ids.toString() }]);
        
        pricedItems = _.map(itemsToCompareList, function (item) {
            return _.extend(item, _.findWhere(prices, { id: item.id }));
        });
        lastPrices = pricedItems;
    }    

    var sortedItems = sortByPrices(pricedItems);

    $.each(sortedItems, function (key, value) {
        var buy = convertValueToGoldHtmlString(value.buys);
        var sell = convertValueToGoldHtmlString(value.sells);
        var bonusBuyData = value.buys ? '<br><div class="quantity">(' + value.buys.quantity + ')</div>' : '';
        var bonusSellData = value.sells ? '<br><div class="quantity">(' + value.sells.quantity + ')</div>' : '';

        $('#item-list tr:last').after(
            '<tr class="item-row">' +
                '<td class="item-icon-container">' +
                '<div class="delete-item" onclick="removeItemFromList(this)" id="' + value.id + '"><img src="red_x.png"></div><img src=""><div class="bordered-item"><img class="item-icon ' + value.rarity + '" src="' + value.icon + '" /></div>' +
                '</td>' +
                '<td class="row-name">' + value.name + '</td>' + //name
                '<td>' + buy + bonusBuyData + '</td>' + //buy
                '<td>' + sell + bonusSellData + '</td>' + //sell
            '</tr>'
            );
    });
};

var sortByPrices = function(pricedItems) {
    return pricedItems.sort(function (a, b) {
        if (a.sells == null) {
            return 1;
        }
        else if (b.sells == null) {
            return -1;
        }

        if (sortByBuysAsc || sortByBuysDesc) {
            if (a.buys.unit_price == b.buys.unit_price) {
                return 0;
            }
            else {
                return (a.buys.unit_price < b.buys.unit_price ? 1 : -1) * (sortByBuysDesc ? 1 : -1);
            }
        } else {
            if (a.sells.unit_price == b.sells.unit_price) {
                return 0;
            }
            else {
                return (a.sells.unit_price < b.sells.unit_price ? 1 : -1) * (sortBySellsDesc ? 1 : -1);
            }
        }
    });
};

var setSortBy = function (value) {
    if (value == 'buy') {
        sortBySellsAsc = sortBySellsDesc = false;
        $('#sortArrowSell').removeClass('sortArrowVisible');
        $('#sortArrowSell').addClass('sortArrowGone');
        $('#sortArrowBuy').addClass('sortArrowVisible');
        $('#sortArrowBuy').removeClass('sortArrowGone');

        if (sortByBuysDesc || sortByBuysAsc) {
            sortByBuysAsc = !sortByBuysAsc;
            sortByBuysDesc = !sortByBuysDesc;

            $('#sortArrowBuy').toggleClass('sortArrowUp');
            $('#sortArrowBuy').toggleClass('sortArrowDown');
        } else {
            sortByBuysDesc = true;
            $('#sortArrowBuy').addClass('sortArrowVisible');
            $('#sortArrowBuy').addClass('sortArrowDown');
            $('#sortArrowBuy').removeClass('sortArrowUp');
        }
    } else {
        sortByBuysAsc = sortByBuysDesc = false;
        $('#sortArrowBuy').removeClass('sortArrowVisible');
        $('#sortArrowBuy').addClass('sortArrowGone');
        $('#sortArrowSell').addClass('sortArrowVisible');
        $('#sortArrowSell').removeClass('sortArrowGone');

        if (sortBySellsDesc || sortBySellsAsc) {
            sortBySellsAsc = !sortBySellsAsc;
            sortBySellsDesc = !sortBySellsDesc;

            $('#sortArrowSell').toggleClass('sortArrowUp');
            $('#sortArrowSell').toggleClass('sortArrowDown');
        } else {
            sortBySellsDesc = true;
            $('#sortArrowSell').addClass('sortArrowVisible');
            $('#sortArrowSell').addClass('sortArrowDown');
            $('#sortArrowSell').removeClass('sortArrowUp');
        }
    }

    generateTable(true);
};

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
var plantDeedItemIds = [
  12161,
  12134,
  73113,
  12142,
  12135,
  12535,
  12162,
  12329,
  12512,
  12507,
  73096,
  12531,
  12255,
  12537,
  12341,
  36731,
  12254,
  12253,
  12247,
  12336,
  12536,
  12244,
  12246,
  12335,
  12243,
  12248,
  12534,
  12546,
  12547,
  12506,
  12505,
  12332,
  12532,
  82866,
  12238,
  12330,
  12163,
  12333,
  12508,
  12241,
  12236,
  12331,
  12147,
  12334,
  73504,
  12342,
  12234,
  12511,
  12538
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
    },
    {
        name: 'Garden Plot Deed Plants',
        list: plantDeedItemIds,
        id: 1000003
    }
];
