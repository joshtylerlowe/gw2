var allUpgradesAndPrices = [];
var componentBuySell = 'buys';
var resultBuySell = 'sells';
var tax = 0;

$(function () {
    applyDataAndPricesToMaterials();
    buildTables();

    $('.full-page-loading-spinner-container').hide();
});

var applyDataAndPricesToMaterials = function() {
    var allPrePrice = [];

    for (var i = 0; i < rareCraftingMats.length; i++) {
        allPrePrice.pushArray(rareCraftingMats[i].map(function (item, y) {
            return item.id;
        }));
    }
    for (var i = 0; i < fineCraftingMats.length; i++) {
        allPrePrice.pushArray(fineCraftingMats[i].map(function (item, y) {
            return item.id;
        }));
    }

    allUpgradesAndPrices = gw2ApiCall('v2/commerce/prices', [{ ids: allPrePrice.toString() }]);
    var upgradeDataWithoutPrices = gw2ApiCall('v2/items', [{ ids: allPrePrice.toString() }]);

    t5rare = mergeDataByKey(t5rare, upgradeDataWithoutPrices, 'id');
    t4rare = mergeDataByKey(t4rare, upgradeDataWithoutPrices, 'id');
    t3rare = mergeDataByKey(t3rare, upgradeDataWithoutPrices, 'id');
    t2rare = mergeDataByKey(t2rare, upgradeDataWithoutPrices, 'id');
    t1rare = mergeDataByKey(t1rare, upgradeDataWithoutPrices, 'id');
    t6fine = mergeDataByKey(t6fine, upgradeDataWithoutPrices, 'id');
    t5fine = mergeDataByKey(t5fine, upgradeDataWithoutPrices, 'id');
    t4fine = mergeDataByKey(t4fine, upgradeDataWithoutPrices, 'id');
    t3fine = mergeDataByKey(t3fine, upgradeDataWithoutPrices, 'id');
    t2fine = mergeDataByKey(t2fine, upgradeDataWithoutPrices, 'id');
    t1fine = mergeDataByKey(t1fine, upgradeDataWithoutPrices, 'id');

    t5rare = mergeDataByKey(t5rare, allUpgradesAndPrices, 'id');
    t4rare = mergeDataByKey(t4rare, allUpgradesAndPrices, 'id');
    t3rare = mergeDataByKey(t3rare, allUpgradesAndPrices, 'id');
    t2rare = mergeDataByKey(t2rare, allUpgradesAndPrices, 'id');
    t1rare = mergeDataByKey(t1rare, allUpgradesAndPrices, 'id');
    t6fine = mergeDataByKey(t6fine, allUpgradesAndPrices, 'id');
    t5fine = mergeDataByKey(t5fine, allUpgradesAndPrices, 'id');
    t4fine = mergeDataByKey(t4fine, allUpgradesAndPrices, 'id');
    t3fine = mergeDataByKey(t3fine, allUpgradesAndPrices, 'id');
    t2fine = mergeDataByKey(t2fine, allUpgradesAndPrices, 'id');
    t1fine = mergeDataByKey(t1fine, allUpgradesAndPrices, 'id');

    $('input[name=buySellComponent]').click(function () {
        componentBuySell = $('input[name=buySellComponent]:checked').val();
        clearTables();
        buildTables();
    });
    $('input[name=buySellResult]').click(function () {
        resultBuySell = $('input[name=buySellResult]:checked').val();
        clearTables();
        buildTables();
    });
};

var clearTables = function () {
    $('#rare-promotion-section').html('');
    $('#fine-promotion-section').html('');
};

var buildTables = function () {
    tax = resultBuySell == 'sells' ? .15 : .10;
    buildRareTable();
    buildFineTable();
};

var buildRareTable = function () {
    var rareCraftingTableHTML = '<table class="centered-content">';
    for (var i = 0; i < rareCraftingMats.length - 1; i++) {

        rareCraftingTableHTML += '<tr><th colspan="12">T' + (rareCraftingMats.length - (i + 1)) + ' -> T' + (rareCraftingMats.length - (i)) + '</th></tr>';
        rareCraftingTableHTML += '<tr><th class="upgradeElement" colspan="2">' + rareCraftingMats[i + 1][0].name.split(' ')[1] + '</th><th></th><th class="upgradeElement">Dust</th><th></th><th class="upgradeElement">Elonian Wine</th><th></th><th class="upgradeElement">Mystic Crystal</th><th></th><th class="upgradeElement">' + rareCraftingMats[i][0].name.split(' ')[1] + '</th><th>Value Change If Converted</th><th>Profit</th></tr>';

        var tier = rareCraftingMats[i];
        for (var j = 0; j < tier.length; j++) {
            var material = tier[j];
            var lesserMaterial = rareCraftingMats[i + 1][j];
            var dust = fineCraftingMats[i][7];

            var valueOfMats = (lesserMaterial[resultBuySell].unit_price * 2) + dust[resultBuySell].unit_price;

            var profit = (material[resultBuySell].unit_price - (material[resultBuySell].unit_price * tax)) - (valueOfMats + elonianWine.price);
            var delta = profit - (valueOfMats - (valueOfMats * tax));

            rareCraftingTableHTML += '<tr class="upgradeRow">';
            rareCraftingTableHTML += '<td style="padding-right:0;"><img class="material-image" src="' + lesserMaterial.icon + '"></td>';
            rareCraftingTableHTML += '<td style="padding-left:0;">x2</td>';
            rareCraftingTableHTML += '<td>+</td>';
            rareCraftingTableHTML += '<td><img class="material-image" src="' + dust.icon + '"></td>';
            rareCraftingTableHTML += '<td>+</td>';
            rareCraftingTableHTML += '<td><img class="material-image" src="' + elonianWine.icon + '"></td>';
            rareCraftingTableHTML += '<td>+</td>';
            rareCraftingTableHTML += '<td><img class="material-image" src="' + mysticCrystal.icon + '"></td>';
            rareCraftingTableHTML += '<td>=</td>';
            rareCraftingTableHTML += '<td><img class="material-image" src="' + material.icon + '"></td>';
            rareCraftingTableHTML += '<td style="min-width:175px;" ' + (delta < 0 ? 'class="negative-currency"' : '') + '>' + convertValueToGoldHtmlString({ unit_price: delta }, 0) + '</td>';
            rareCraftingTableHTML += '<td style="min-width:175px;" ' + (profit < 0 ? 'class="negative-currency"' : '') + '>' + convertValueToGoldHtmlString({ unit_price: profit }, 0) + '</td>';
            rareCraftingTableHTML += '</tr>';
        }
    }
    rareCraftingTableHTML += '</table>';

    $('#rare-promotion-section').prepend(rareCraftingTableHTML);

};

var buildFineTable = function () {
    var fineCraftingTableHTML = '<table class="centered-content">';
    for (var i = 0; i < fineCraftingMats.length - 1; i++) {
        fineCraftingTableHTML += '<tr><th colspan="15">T' + (fineCraftingMats.length - (i + 1)) + ' -> T' + (fineCraftingMats.length - i) + '</th></tr>';
        fineCraftingTableHTML += '<tr><th class="upgradeElement" colspan="2">T' + (fineCraftingMats.length - (i + 1)) + '</th><th></th><th class="upgradeElement">T' + (fineCraftingMats.length - i) + '</th><th></th><th class="upgradeElement" colspan="2">Dust</th><th></th><th class="upgradeElement" colspan="2">Philosopher\'s Stone</th><th></th><th class="upgradeElement" colspan="2">T' + (fineCraftingMats.length - i) + '</th><th>Profit</th></tr>';
        var altMatCount = (fineCraftingMats.length - (i + 1));

        var tier = fineCraftingMats[i];
        for (var j = 0; j < tier.length - 1; j++) {
            var material = tier[j];
            var lesserMaterial = fineCraftingMats[i + 1][j];
            var dust = fineCraftingMats[i][7];
            var returnMultiplier = i == 0 ? fineCraftingT6Return : fineCraftingReturn;            

            var resultPrice = (material[resultBuySell].unit_price * returnMultiplier) - ((material[resultBuySell].unit_price * returnMultiplier) * tax);
            var profit = resultPrice - ((lesserMaterial[componentBuySell].unit_price * 50) + material[componentBuySell].unit_price + (dust[componentBuySell].unit_price * 5));

            fineCraftingTableHTML += '<tr class="upgradeRow">';
            fineCraftingTableHTML += '<td class="force-right"><img class="material-image" src="' + lesserMaterial.icon + '"></td>';
            fineCraftingTableHTML += '<td class="force-left">x50</td>';
            fineCraftingTableHTML += '<td>+</td>';
            fineCraftingTableHTML += '<td><img class="material-image" src="' + material.icon + '"></td>';
            fineCraftingTableHTML += '<td>+</td>';
            fineCraftingTableHTML += '<td class="force-right"><img class="material-image" src="' + dust.icon + '"></td>';
            fineCraftingTableHTML += '<td class="force-left">x5</td>';
            fineCraftingTableHTML += '<td>+</td>';
            fineCraftingTableHTML += '<td class="force-right"><img class="material-image" src="' + stone.icon + '"></td>';
            fineCraftingTableHTML += '<td class="force-left">x' + altMatCount + '</td>';
            fineCraftingTableHTML += '<td>&#8771;</td>';
            fineCraftingTableHTML += '<td class="force-right"><img class="material-image" src="' + material.icon + '"></td>';
            fineCraftingTableHTML += '<td class="force-left">x' + returnMultiplier + '</td>';
            fineCraftingTableHTML += '<td style="min-width:175px;" ' + (profit < 0 ? 'class="negative-currency"' : '') + '>' + convertValueToGoldHtmlString({ unit_price: profit }, 2) + '</td>';
            fineCraftingTableHTML += '</tr>';
        }
    }

    fineCraftingTableHTML += '</table>';

    fineCraftingTableHTML += '<table class="centered-content">';
    fineCraftingTableHTML += '<tr><th colspan="15">Dusts</th></tr>';
    fineCraftingTableHTML += '<tr><th class="upgradeElement" colspan="2">Lower Tier Dust</th><th></th><th class="upgradeElement">Higher Tier Dust</th><th></th><th class="upgradeElement" colspan="2">Mystic Crystal</th><th></th><th class="upgradeElement" colspan="2">Philosopher\'s Stone</th><th></th><th class="upgradeElement" colspan="2">T' + (fineCraftingMats.length - i) + '</th><th>Profit</th></tr>';

    for (var i = 0; i < fineCraftingMats.length - 1; i++) {
        var tier = fineCraftingMats[i];
        var material = tier[7];
        var lesserMaterial = fineCraftingMats[i + 1][j];
        var dust = fineCraftingMats[i][7];
        var returnMultiplier = i == 0 ? dustCraftingT6Return : dustCraftingReturn;
        altMatCount = (fineCraftingMats.length - (i + 1));

        var resultPrice = (material[resultBuySell].unit_price * returnMultiplier) - ((material[resultBuySell].unit_price * returnMultiplier) * tax);
        var profit = resultPrice - ((lesserMaterial[componentBuySell].unit_price * 250) + material[componentBuySell].unit_price);

        fineCraftingTableHTML += '<tr class="upgradeRow">';
        fineCraftingTableHTML += '<td class="force-right"><img class="material-image" src="' + lesserMaterial.icon + '"></td>';
        fineCraftingTableHTML += '<td class="force-left">x250</td>';
        fineCraftingTableHTML += '<td>+</td>';
        fineCraftingTableHTML += '<td><img class="material-image" src="' + material.icon + '"></td>';
        fineCraftingTableHTML += '<td>+</td>';
        fineCraftingTableHTML += '<td class="force-right"><img class="material-image" src="' + mysticCrystal.icon + '"></td>';
        fineCraftingTableHTML += '<td class="force-left">x' + altMatCount + '</td>';
        fineCraftingTableHTML += '<td>+</td>';
        fineCraftingTableHTML += '<td class="force-right"><img class="material-image" src="' + stone.icon + '"></td>';
        fineCraftingTableHTML += '<td class="force-left">x' + altMatCount + '</td>';
        fineCraftingTableHTML += '<td>&#8771;</td>';
        fineCraftingTableHTML += '<td class="force-right"><img class="material-image" src="' + material.icon + '"></td>';
        fineCraftingTableHTML += '<td class="force-left">x' + returnMultiplier + '</td>';
        fineCraftingTableHTML += '<td style="min-width:175px;" ' + (profit < 0 ? 'class="negative-currency"' : '') + '>' + convertValueToGoldHtmlString({ unit_price: profit }, 2) + '</td>';
        fineCraftingTableHTML += '</tr>';
        
    }

    fineCraftingTableHTML += '</table>';

    $('#fine-promotion-section').prepend(fineCraftingTableHTML);

};

var toggleSection = function (section) {
    $('#' + section + '-section').slideToggle();
    if ($('#' + section + '-expander').html() == '+') {
        $('#' + section + '-expander').html(' - ');
    } else {
        $('#' + section + '-expander').html('+');
    }
};

var fineCraftingReturn = 18.51;
var fineCraftingT6Return = 6.91;
var dustCraftingReturn = 60;
var dustCraftingT6Return = 18;

var elonianWine = {
    "name": "Bottle of Elonian Wine",
    "price": 2504,
    "icon": "https://render.guildwars2.com/file/CC720B5A5810A84FD97AB00FA43F1679C48074DE/455843.png"
};

var mysticCrystal = {
    "name": "Mystic Crystal",
    "icon": "https://render.guildwars2.com/file/045C05C2F83A59FC4B6F15073465C5D3040E4DF5/65674.png"
};

var stone = {
    "name": "Philosopher's Stone",
    "icon": "https://render.guildwars2.com/file/68FF9617BA1BE1AD58E83E4209AEF0FB58950702/434425.png"
}

var t5rare = [
  {
      "id": 24330,
      "name": "Crystal Lodestone"
  },
  {
      "id": 24325,
      "name": "Destroyer Lodestone"
  },
  {
      "id": 24340,
      "name": "Corrupted Lodestone"
  },
  {
      "id": 24305,
      "name": "Charged Lodestone"
  },
  {
      "id": 24310,
      "name": "Onyx Lodestone"
  },
  {
      "id": 24315,
      "name": "Molten Lodestone"
  },
  {
      "id": 24320,
      "name": "Glacial Lodestone"
  },
  {
      "id": 24335,
      "name": "Pile of Putrid Essence"
  }
];

var t4rare = [
  {
      "id": 24329,
      "name": "Crystal Core"
  },
  {
      "id": 24324,
      "name": "Destroyer Core"
  },
  {
      "id": 24339,
      "name": "Corrupted Core"
  },
  {
      "id": 24304,
      "name": "Charged Core"
  },
  {
      "id": 24309,
      "name": "Onyx Core"
  },
  {
      "id": 24314,
      "name": "Molten Core"
  },
  {
      "id": 24319,
      "name": "Glacial Core"
  },
  {
      "id": 24334,
      "name": "Pile of Vile Essence"
  }
];

var t3rare = [
  {
      "id": 24328,
      "name": "Crystal Shard"
  },
  {
      "id": 24323,
      "name": "Destroyer Shard"
  },
  {
      "id": 24338,
      "name": "Corrupted Shard"
  },
  {
      "id": 24303,
      "name": "Charged Shard"
  },
  {
      "id": 24308,
      "name": "Onyx Shard"
  },
  {
      "id": 24313,
      "name": "Molten Shard"
  },
  {
      "id": 24318,
      "name": "Glacial Shard"
  },
  {
      "id": 24333,
      "name": "Pile of Filthy Essence"
  }
];

var t2rare = [
  {
      "id": 24327,
      "name": "Crystal Fragment"
  },
  {
      "id": 24322,
      "name": "Destroyer Fragment"
  },
  {
      "id": 24337,
      "name": "Corrupted Fragment"
  },
  {
      "id": 24302,
      "name": "Charged Fragment"
  },
  {
      "id": 24307,
      "name": "Onyx Fragment"
  },
  {
      "id": 24312,
      "name": "Molten Fragment"
  },
  {
      "id": 24317,
      "name": "Glacial Fragment"
  },
  {
      "id": 24332,
      "name": "Pile of Foul Essence"
  }
];

var t1rare = [
  {
      "id": 24326,
      "name": "Crystal Sliver"
  },
  {
      "id": 24321,
      "name": "Destroyer Sliver"
  },
  {
      "id": 24336,
      "name": "Corrupted Sliver"
  },
  {
      "id": 24301,
      "name": "Charged Sliver"
  },
  {
      "id": 24306,
      "name": "Onyx Sliver"
  },
  {
      "id": 24311,
      "name": "Molten Sliver"
  },
  {
      "id": 24316,
      "name": "Glacial Sliver"
  },
  {
      "id": 24331,
      "name": "Pile of Soiled Essence"
  }
];

var t6fine = [
  {
      "id": 24295,
      "name": "Vial of Powerful Blood"
  },
  {
      "id": 24358,
      "name": "Ancient Bone"
  },
  {
      "id": 24351,
      "name": "Vicious Claw"
  },
  {
      "id": 24357,
      "name": "Vicious Fang"
  },
  {
      "id": 24289,
      "name": "Armored Scale"
  },
  {
      "id": 24300,
      "name": "Elaborate Totem"
  },
  {
      "id": 24283,
      "name": "Powerful Venom Sac"
  },
  {
      "id": 24277,
      "name": "Pile of Crystalline Dust"
  }
];

var t5fine = [
  {
      "id": 24294,
      "name": "Vial of Potent Blood"
  },
  {
      "id": 24341,
      "name": "Large Bone"
  },
  {
      "id": 24350,
      "name": "Large Claw"
  },
  {
      "id": 24356,
      "name": "Large Fang"
  },
  {
      "id": 24288,
      "name": "Large Scale"
  },
  {
      "id": 24299,
      "name": "Intricate Totem"
  },
  {
      "id": 24282,
      "name": "Potent Venom Sac"
  },
  {
      "id": 24276,
      "name": "Pile of Incandescent Dust"
  }
];

var t4fine = [
  {
      "id": 24293,
      "name": "Vial of Thick Blood"
  },
  {
      "id": 24345,
      "name": "Heavy Bone"
  },
  {
      "id": 24349,
      "name": "Sharp Claw"
  },
  {
      "id": 24355,
      "name": "Sharp Fang"
  },
  {
      "id": 24287,
      "name": "Smooth Scale"
  },
  {
      "id": 24363,
      "name": "Engraved Totem"
  },
  {
      "id": 24281,
      "name": "Full Venom Sac"
  },
  {
      "id": 24275,
      "name": "Pile of Luminous Dust"
  }
];

var t3fine = [
  {
      "id": 24292,
      "name": "Vial of Blood"
  },
  {
      "id": 24344,
      "name": "Bone"
  },
  {
      "id": 24348,
      "name": "Claw"
  },
  {
      "id": 24354,
      "name": "Fang"
  },
  {
      "id": 24286,
      "name": "Scale"
  },
  {
      "id": 24298,
      "name": "Totem"
  },
  {
      "id": 24280,
      "name": "Venom Sac"
  },
  {
      "id": 24274,
      "name": "Pile of Radiant Dust"
  }
];

var t2fine = [
  {
      "id": 24291,
      "name": "Vial of Thin Blood"
  },
  {
      "id": 24343,
      "name": "Bone Shard"
  },
  {
      "id": 24347,
      "name": "Small Claw"
  },
  {
      "id": 24353,
      "name": "Small Fang"
  },
  {
      "id": 24285,
      "name": "Small Scale"
  },
  {
      "id": 24297,
      "name": "Small Totem"
  },
  {
      "id": 24279,
      "name": "Small Venom Sac"
  },
  {
      "id": 24273,
      "name": "Pile of Shimmering Dust"
  }
];

var t1fine = [
  {
      "id": 24290,
      "name": "Vial of Weak Blood"
  },
  {
      "id": 24342,
      "name": "Bone Chip"
  },
  {
      "id": 24346,
      "name": "Tiny Claw"
  },
  {
      "id": 24352,
      "name": "Tiny Fang"
  },
  {
      "id": 24284,
      "name": "Tiny Scale"
  },
  {
      "id": 24296,
      "name": "Tiny Totem"
  },
  {
      "id": 24278,
      "name": "Tiny Venom Sac"
  },
  {
      "id": 24272,
      "name": "Pile of Glittering Dust"
  }
];

var rareCraftingMats = [
    t5rare,
    t4rare,
    t3rare,
    t2rare,
    t1rare
];

var fineCraftingMats = [
    t6fine,
    t5fine,
    t4fine,
    t3fine,
    t2fine,
    t1fine
];
