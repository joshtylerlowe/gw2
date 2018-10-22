var multipliers = [
    {tier:1, multiplier: 1.41},
    {tier:2, multiplier: 0.68},
    {tier:3, multiplier: 0.91},
    {tier:4, multiplier: 0.70},
    {tier:5, multiplier: 1.49},
    {tier:6, multiplier: 0.43}
];
var trophy = {
    bone: [
        { tier: 1, id: 24342 },
        { tier: 2, id: 24343 },
        { tier: 3, id: 24344 },
        { tier: 4, id: 24345 },
        { tier: 5, id: 24341 },
        { tier: 6, id: 24358 }
    ],
    claw: [
        { tier: 1, id: 24346 },
        { tier: 2, id: 24347 },
        { tier: 3, id: 24348 },
        { tier: 4, id: 24349 },
        { tier: 5, id: 24350 },
        { tier: 6, id: 24351 }
    ],
    dust: [
        { tier: 1, id: 24272 },
        { tier: 2, id: 24273 },
        { tier: 3, id: 24274 },
        { tier: 4, id: 24275 },
        { tier: 5, id: 24276 },
        { tier: 6, id: 24277 }
    ],
    fang: [
        { tier: 1, id: 24352 },
        { tier: 2, id: 24353 },
        { tier: 3, id: 24354 },
        { tier: 4, id: 24355 },
        { tier: 5, id: 24356 },
        { tier: 6, id: 24357 }
    ],
    scale: [
        { tier: 1, id: 24284 },
        { tier: 2, id: 24285 },
        { tier: 3, id: 24286 },
        { tier: 4, id: 24287 },
        { tier: 5, id: 24288 },
        { tier: 6, id: 24289 }
    ],
    totem: [
        { tier: 1, id: 24296 },
        { tier: 2, id: 24297 },
        { tier: 3, id: 24298 },
        { tier: 4, id: 24363 },
        { tier: 5, id: 24299 },
        { tier: 6, id: 24300 }
    ],
    venom: [
        { tier: 1, id: 24278 },
        { tier: 2, id: 24279 },
        { tier: 3, id: 24280 },
        { tier: 4, id: 24281 },
        { tier: 5, id: 24282 },
        { tier: 6, id: 24283 }
    ],
    blood: [
        { tier: 1, id: 24290 },
        { tier: 2, id: 24291 },
        { tier: 3, id: 24292 },
        { tier: 4, id: 24293 },
        { tier: 5, id: 24294 },
        { tier: 6, id: 24295 }
    ]
};
var trophyIds = '24342,24343,24344,24345,24341,24358,24346,24347,24348,24349,24350,24351,24272,24273,24274,24275,24276,24277,24352,24353,24354,24355,24356,24357,24284,24285,24286,24287,24288,24289,24296,24297,24298,24363,24299,24300,24278,24279,24280,24281,24282,24283,24290,24291,24292,24293,24294,24295'
var buySellValue = 'sell';
var highestBuyPrices = [0,0,0,0,0,0,0,0];
var highestSellPrices = [0,0,0,0,0,0,0,0];
var lowestBuyPrices = [0,0,0,0,0,0,0,0];
var lowestSellPrices = [0,0,0,0,0,0,0,0];

$(document).ready(function () {
    for (var i = 0; i < multipliers.length; i++) {
        $('#t' + (i+1) + 'multiplier').html(multipliers[i].multiplier);
    }

    var prices = gw2ApiCall("v2/commerce/prices", [{ ids: trophyIds }]);

    Object.keys(trophy).forEach(function (key, index) {
        trophy[key] = mergeDataByKey(trophy[key], prices, 'id');
        trophy[key] = mergeDataByKey(trophy[key], multipliers, 'tier');
        trophy[key] = addAdjustedValue(trophy[key]);
        trophy[key].push(getAdjustedTotal(trophy[key]));

        calculateHighestValues(trophy[key]);
        calculateLowestValues(trophy[key]);
    });

    displayEverything();

    $('input[name=buySellSelection]').click(function () {
        buySellValue = $('input[name=buySellSelection]:checked').val();
        $('#item-list').find("tr:gt(1)").remove();
        displayEverything();
    });
});

var calculateHighestValues = function (compareObject) {

  for (var i = 0; i < compareObject.length; i++) {
    if (compareObject[i].buys.unit_price > highestBuyPrices[i]) {
      highestBuyPrices[i] = compareObject[i].buys.unit_price;
    }
    if (compareObject[i].sells.unit_price > highestSellPrices[i]) {
      highestSellPrices[i] = compareObject[i].sells.unit_price;
    }
  }

  if (compareObject[6].buys.unit_price > highestBuyPrices[6]) {
    highestBuyPrices[6] = compareObject[6].buys.unit_price;
  }
  if (compareObject[6].sells.unit_price > highestSellPrices[6]) {
    highestSellPrices[6] = compareObject[6].sells.unit_price;
  }
  if (compareObject[6].adjustedBuyValue > highestBuyPrices[7]) {
    highestBuyPrices[7] = compareObject[6].adjustedBuyValue;
  }
  if (compareObject[6].adjustedSellValue > highestSellPrices[7]) {
    highestSellPrices[7] = compareObject[6].adjustedSellValue;
  }
}

var calculateLowestValues = function (compareObject) {

  for (var i = 0; i < compareObject.length; i++) {
    if (lowestBuyPrices[i] == 0 || compareObject[i].buys.unit_price < lowestBuyPrices[i]) {
      lowestBuyPrices[i] = compareObject[i].buys.unit_price;
    }
    if (lowestSellPrices[i] == 0 || compareObject[i].sells.unit_price < lowestSellPrices[i]) {
      lowestSellPrices[i] = compareObject[i].sells.unit_price;
    }
  }

  if (lowestBuyPrices[6] == 0 || compareObject[6].buys.unit_price < lowestBuyPrices[6]) {
    lowestBuyPrices[6] = compareObject[6].buys.unit_price;
  }
  if (lowestSellPrices[6] == 0 || compareObject[6].sells.unit_price < lowestSellPrices[6]) {
    lowestSellPrices[6] = compareObject[6].sells.unit_price;
  }
  if (lowestBuyPrices[7] == 0 || compareObject[6].adjustedBuyValue < lowestBuyPrices[7]) {
    lowestBuyPrices[7] = compareObject[6].adjustedBuyValue;
  }
  if (lowestSellPrices[7] == 0 || compareObject[6].adjustedSellValue < lowestSellPrices[7]) {
    lowestSellPrices[7] = compareObject[6].adjustedSellValue;
  }
}

var addAdjustedValue = function (items) {
    for (var i = 0; i < items.length; i++) {
        if (items[i].tier > 0) {
            items[i].adjustedSellValue = Number((items[i].sells.unit_price * items[i].multiplier).toFixed(2));
            items[i].adjustedBuyValue = Number((items[i].buys.unit_price * items[i].multiplier).toFixed(2));
        }
    }

    return items;
};

var getAdjustedTotal = function (items) {
    var buyTotalAdjusted = 0;
    var sellTotalAdjusted = 0;
    var buyTotalTP = 0;
    var sellTotalTP = 0;

    for (var i = 0; i < items.length; i++) {
        buyTotalAdjusted += items[i].adjustedBuyValue;
        sellTotalAdjusted += items[i].adjustedSellValue;
        buyTotalTP += items[i].buys.unit_price;
        sellTotalTP += items[i].sells.unit_price;
    }

    return {
        tier: 'total',
        adjustedBuyValue: buyTotalAdjusted.toFixed(2),
        adjustedSellValue: sellTotalAdjusted.toFixed(2),
        buys: { unit_price: buyTotalTP },
        sells: { unit_price: sellTotalTP }
    };
};

var displayEverything = function () {
    var goBySellValue = buySellValue == 'sell';

    Object.keys(trophy).forEach(function (key, index) {
        var generatedHtml =
            '<tr class="item-row">' +
            '<td style="text-transform:capitalize; border-right:2px solid #333;">' + key + '</td>'; //type

        trophy[key].forEach(function (x) {
            var tpValue = goBySellValue ? x.sells.unit_price : x.buys.unit_price;
            var adjustedValue = goBySellValue ? x.adjustedSellValue : x.adjustedBuyValue;
            var highestPrices = goBySellValue ? highestSellPrices : highestBuyPrices;
            var lowestPrices = goBySellValue ? lowestSellPrices : lowestBuyPrices;

            if (x.tier == 'total') {
                additionalAdjustedStyles = adjustedValue == highestPrices[7] ? 'background-color: #99ff99;' : '';
                additionalAdjustedStyles += adjustedValue == lowestPrices[7] ? 'background-color: #ff7777;' : '';

                generatedHtml +=
                    '<td style="font-weight:bold;  border-left:2px solid #333; ' + additionalAdjustedStyles +'">' +
                    convertValueToGoldHtmlString({ unit_price: Number(adjustedValue) }, 2) +
                    '</td>';
            } else {
                additionalStyles = tpValue == highestPrices[x.tier - 1] ? 'background-color: #99ff99;' : '';
                additionalStyles += tpValue == lowestPrices[x.tier - 1] ? 'background-color: #ff7777;' : '';

                generatedHtml +=
                    '<td style="' + additionalStyles +'">' +
                    convertValueToGoldHtmlString({ unit_price: Number(tpValue) }) +
                    '</td>';
            }

        });
        generatedHtml += '</tr>';

        $('#item-list tr:last').after(generatedHtml);
    });
    $('.full-page-loading-spinner-container').hide();
    $('#item-list').show();
};
