var allUpgradesAndPrices = [];
var componentBuySell = 'sells';
var resultBuySell = 'sells';
var tax = .15;
var leftSelectorsExpanded = true;

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
    for (var i = 0; i < lesserRefinementMats.length; i++) {
        allPrePrice.pushArray(lesserRefinementMats[i].map(function (item, y) {
            return item.id;
        }));
    }
    for (var i = 0; i < greaterRefinementMats.length; i++) {
        allPrePrice.pushArray(greaterRefinementMats[i].map(function (item, y) {
            return item.id;
        }));
    }
    allPrePrice.push(globOfEctoplasm.id);
    allPrePrice.push(mysticCurio.id);

    //allPrePrice.pushArray(ascendedMats.map(function (item, y) {
    //    return item.id;
    //}));

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
    ores = mergeDataByKey(ores, upgradeDataWithoutPrices, 'id');
    ingots = mergeDataByKey(ingots, upgradeDataWithoutPrices, 'id');
    scraps = mergeDataByKey(scraps, upgradeDataWithoutPrices, 'id');
    bolts = mergeDataByKey(bolts, upgradeDataWithoutPrices, 'id');
    sections = mergeDataByKey(sections, upgradeDataWithoutPrices, 'id');
    squares = mergeDataByKey(squares, upgradeDataWithoutPrices, 'id');
    logs = mergeDataByKey(logs, upgradeDataWithoutPrices, 'id');
    planks = mergeDataByKey(planks, upgradeDataWithoutPrices, 'id');
    //ascendedMats = mergeDataByKey(ascendedMats, upgradeDataWithoutPrices, 'id');
    globOfEctoplasm = _.extend(globOfEctoplasm, _.findWhere(upgradeDataWithoutPrices, { id: globOfEctoplasm.id }));
    mysticCurio = _.extend(mysticCurio, _.findWhere(upgradeDataWithoutPrices, { id: mysticCurio.id }));

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
    ores = mergeDataByKey(ores, allUpgradesAndPrices, 'id');
    ingots = mergeDataByKey(ingots, allUpgradesAndPrices, 'id');
    scraps = mergeDataByKey(scraps, allUpgradesAndPrices, 'id');
    bolts = mergeDataByKey(bolts, allUpgradesAndPrices, 'id');
    sections = mergeDataByKey(sections, allUpgradesAndPrices, 'id');
    squares = mergeDataByKey(squares, allUpgradesAndPrices, 'id');
    logs = mergeDataByKey(logs, allUpgradesAndPrices, 'id');
    planks = mergeDataByKey(planks, allUpgradesAndPrices, 'id');
    //ascendedMats = mergeDataByKey(ascendedMats, allUpgradesAndPrices, 'id');
    globOfEctoplasm = _.extend(globOfEctoplasm, _.findWhere(allUpgradesAndPrices, { id: globOfEctoplasm.id }));
    mysticCurio = _.extend(mysticCurio, _.findWhere(allUpgradesAndPrices, { id: mysticCurio.id }));

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
    $('#basic-refinement-section').html('');
    $('#ecto-salvage-section').html('');
    $('#mystic-curio-section').html('');
    //$('#ascended-refinement-section').html('');
};

var buildTables = function () {
    buildRareTable();
    buildFineTable();
    buildMaterialRefinementTable();
    buildEctoSalvageTable();
    //buildAscendedMaterialRefinementTable();
    buildMysticCurioTable();
};

var buildRareTable = function () {
    var rareCraftingTableHTML = '<table>';
    for (var i = 0; i < rareCraftingMats.length - 1; i++) {

        rareCraftingTableHTML += '<tr><th class="header-title" colspan="12">Rare Mystic Forge Materials T' + (rareCraftingMats.length - (i + 1)) + ' &rarr; T' + (rareCraftingMats.length - (i)) + '</th></tr>';
        rareCraftingTableHTML += '<tr><th class="upgradeElement">' + rareCraftingMats[i + 1][0].name.split(' ')[1] + '</th><th></th><th class="upgradeElement">Dust</th><th></th><th class="upgradeElement">Elonian Wine</th><th></th><th class="upgradeElement">Mystic Crystal</th><th></th><th class="upgradeElement">' + rareCraftingMats[i][0].name.split(' ')[1] + '</th><th>Value Change If Converted</th><th>Profit</th></tr>';

        var tier = rareCraftingMats[i];
        for (var j = 0; j < tier.length; j++) {
            var material = tier[j];
            var lesserMaterial = rareCraftingMats[i + 1][j];
            var dust = fineCraftingMats[i][7];

            var valueOfMats = (lesserMaterial[componentBuySell].unit_price * 2) + dust[componentBuySell].unit_price;
            var valueOfWine = elonianWine.price;
            var valueOfMatsByResultBuySell = (lesserMaterial[resultBuySell].unit_price * 2) + dust[resultBuySell].unit_price
            var valueOfMatsAfterTax = valueOfMatsByResultBuySell - (valueOfMatsByResultBuySell * tax);
            var valueOfResult = material[resultBuySell].unit_price;
            var valueOfResultAfterTax = valueOfResult - (valueOfResult * tax);
            var profit = valueOfResultAfterTax - valueOfMats - valueOfWine;
            var delta = valueOfResultAfterTax - valueOfMatsAfterTax - valueOfWine;

            rareCraftingTableHTML += '<tr class="upgradeRow">';
            rareCraftingTableHTML += '<td><div class="multiplied-image"><img class="material-image" title="' + lesserMaterial.name + '" src="' + lesserMaterial.icon + '"><span>x2</span></div></td>';
            rareCraftingTableHTML += '<td>+</td>';
            rareCraftingTableHTML += '<td><img class="material-image" title="' + dust.name + '" src="' + dust.icon + '"></td>';
            rareCraftingTableHTML += '<td>+</td>';
            rareCraftingTableHTML += '<td><img class="material-image" title="' + elonianWine.name + '" src="' + elonianWine.icon + '"></td>';
            rareCraftingTableHTML += '<td>+</td>';
            rareCraftingTableHTML += '<td><img class="material-image" title="' + mysticCrystal.name + '" src="' + mysticCrystal.icon + '"></td>';
            rareCraftingTableHTML += '<td>=</td>';
            rareCraftingTableHTML += '<td><img class="material-image" title="' + material.name + '" src="' + material.icon + '"></td>';
            rareCraftingTableHTML += '<td style="min-width:175px;" ' + (delta < 0 ? 'class="negative-currency"' : '') + '>' + convertValueToGoldHtmlString({ unit_price: delta }, 0) + '</td>';
            rareCraftingTableHTML += '<td style="min-width:175px;" ' + (profit < 0 ? 'class="negative-currency"' : '') + '>' + convertValueToGoldHtmlString({ unit_price: profit }, 0) + '</td>';
            rareCraftingTableHTML += '</tr>';
        }
    }
    rareCraftingTableHTML += '</table>';

    $('#rare-promotion-section').prepend(rareCraftingTableHTML);
};

var buildFineTable = function () {
    var fineCraftingTableHTML = '<table>';
    for (var i = 0; i < fineCraftingMats.length - 1; i++) {
        fineCraftingTableHTML += '<tr><th class="header-title" colspan="16">Fine Mystic Forge Materials T' + (fineCraftingMats.length - (i + 1)) + ' &rarr; T' + (fineCraftingMats.length - i) + '</th></tr>';
        fineCraftingTableHTML += '<tr><th class="upgradeElement">T' + (fineCraftingMats.length - (i + 1)) + '</th><th></th><th class="upgradeElement">T' + (fineCraftingMats.length - i) + '</th><th></th><th class="upgradeElement">Dust</th><th></th><th class="upgradeElement">Philosopher\'s Stone</th><th></th><th class="upgradeElement">T' + (fineCraftingMats.length - i) + '</th><th>Value Change If Converted</th><th>Profit</th></tr>';
        var altMatCount = (fineCraftingMats.length - (i + 1));

        var tier = fineCraftingMats[i];
        for (var j = 0; j < tier.length - 1; j++) {
            var material = tier[j];
            var lesserMaterial = fineCraftingMats[i + 1][j];
            var dust = fineCraftingMats[i][7];
            var returnMultiplier = i == 0 ? fineCraftingT6Return : fineCraftingReturn;

            var valueOfMats = (lesserMaterial[componentBuySell].unit_price * 50) + material[componentBuySell].unit_price + (dust[componentBuySell].unit_price * 5);
            var valueOfMatsByResultBuySell = (lesserMaterial[resultBuySell].unit_price * 50) + material[resultBuySell].unit_price + (dust[resultBuySell].unit_price * 5);
            var valueOfMatsAfterTax = valueOfMatsByResultBuySell - (valueOfMatsByResultBuySell * tax);
            var valueOfResult = material[resultBuySell].unit_price * returnMultiplier;
            var valueOfResultAfterTax = valueOfResult - (valueOfResult * tax);
            var profit = valueOfResultAfterTax - valueOfMats;
            var delta = valueOfResultAfterTax - valueOfMatsAfterTax;

            fineCraftingTableHTML += '<tr class="upgradeRow">';
            fineCraftingTableHTML += '<td><div class="multiplied-image"><img class="material-image" title="' + lesserMaterial.name + '" src="' + lesserMaterial.icon + '"><span>x50</span></div></td>';
            fineCraftingTableHTML += '<td>+</td>';
            fineCraftingTableHTML += '<td><img class="material-image" title="' + material.name + '" src="' + material.icon + '"></td>';
            fineCraftingTableHTML += '<td>+</td>';
            fineCraftingTableHTML += '<td><div class="multiplied-image"><img class="material-image" title="' + dust.name + '" src="' + dust.icon + '"><span>x5</span></div></td>';
            fineCraftingTableHTML += '<td>+</td>';
            fineCraftingTableHTML += '<td><div class="multiplied-image"><img class="material-image" title="' + stone.name + '" src="' + stone.icon + '"><span>x' + altMatCount + '</span></div></td>';
            fineCraftingTableHTML += '<td>&#8771;</td>';
            fineCraftingTableHTML += '<td><div class="multiplied-image"><img class="material-image" title="' + material.name + '" src="' + material.icon + '"><span>x' + returnMultiplier + '</span></div></td>';
            fineCraftingTableHTML += '<td style="min-width:175px;" ' + (delta < 0 ? 'class="negative-currency"' : '') + '>' + convertValueToGoldHtmlString({ unit_price: delta }, 0) + '</td>';
            fineCraftingTableHTML += '<td style="min-width:175px;" ' + (profit < 0 ? 'class="negative-currency"' : '') + '>' + convertValueToGoldHtmlString({ unit_price: profit }, 0) + '</td>';
            fineCraftingTableHTML += '</tr>';
        }
    }

    fineCraftingTableHTML += '</table>';

    fineCraftingTableHTML += '<table>';
    fineCraftingTableHTML += '<tr><th class="header-title" colspan="15">Dusts</th></tr>';
    fineCraftingTableHTML += '<tr><th class="upgradeElement">Lower Tier Dust</th><th></th><th class="upgradeElement">Higher Tier Dust</th><th></th><th class="upgradeElement">Mystic Crystal</th><th></th><th class="upgradeElement">Philosopher\'s Stone</th><th></th><th class="upgradeElement">T' + (fineCraftingMats.length - i) + '</th><th>Value Change If Converted</th><th>Profit</th></tr>';

    for (var i = 0; i < fineCraftingMats.length - 1; i++) {
        var tier = fineCraftingMats[i];
        var material = tier[7];
        var lesserMaterial = fineCraftingMats[i + 1][j];
        var returnMultiplier = i == 0 ? dustCraftingT6Return : dustCraftingReturn;
        altMatCount = (fineCraftingMats.length - (i + 1));

        var valueOfMats = (lesserMaterial[componentBuySell].unit_price * 250) + material[componentBuySell].unit_price;
        var valueOfMatsByResultBuySell = (lesserMaterial[resultBuySell].unit_price * 250) + material[resultBuySell].unit_price;
        var valueOfMatsAfterTax = valueOfMatsByResultBuySell - (valueOfMatsByResultBuySell * tax);
        var valueOfResult = material[resultBuySell].unit_price * returnMultiplier;
        var valueOfResultAfterTax = valueOfResult - (valueOfResult * tax);
        var profit = valueOfResultAfterTax - valueOfMats;
        var delta = valueOfResultAfterTax - valueOfMatsAfterTax;

        fineCraftingTableHTML += '<tr class="upgradeRow">';
        fineCraftingTableHTML += '<td><div class="multiplied-image"><img class="material-image" title="' + lesserMaterial.name + '" src="' + lesserMaterial.icon + '"><span>x250</span></div></td>';
        fineCraftingTableHTML += '<td>+</td>';
        fineCraftingTableHTML += '<td><img class="material-image" title="' + material.name + '" src="' + material.icon + '"></td>';
        fineCraftingTableHTML += '<td>+</td>';
        fineCraftingTableHTML += '<td><div class="multiplied-image"><img class="material-image" title="' + mysticCrystal.name + '" src="' + mysticCrystal.icon + '"><span>x' + altMatCount + '</span></div></td>';
        fineCraftingTableHTML += '<td>+</td>';
        fineCraftingTableHTML += '<td><div class="multiplied-image"><img class="material-image" title="' + stone.name + '" src="' + stone.icon + '"><span>x' + altMatCount + '</span></div></td>';
        fineCraftingTableHTML += '<td>&#8771;</td>';
        fineCraftingTableHTML += '<td><div class="multiplied-image"><img class="material-image" title="' + material.name + '" src="' + material.icon + '"><span>x' + returnMultiplier + '</span></div></td>';
        fineCraftingTableHTML += '<td style="min-width:175px;" ' + (delta < 0 ? 'class="negative-currency"' : '') + '>' + convertValueToGoldHtmlString({ unit_price: delta }, 0) + '</td>';
        fineCraftingTableHTML += '<td style="min-width:175px;" ' + (profit < 0 ? 'class="negative-currency"' : '') + '>' + convertValueToGoldHtmlString({ unit_price: profit }, 0) + '</td>';
        fineCraftingTableHTML += '</tr>';
    }

    fineCraftingTableHTML += '</table>';

    $('#fine-promotion-section').prepend(fineCraftingTableHTML);
};

var buildMaterialRefinementTable = function () {
    var basicRefinementTableHTML = '<table>';
    for (var i = 0; i < greaterRefinementMats.length; i++) {

        var lesserWords = lesserRefinementMats[i][0].name.split(' ');
        var greaterWords = greaterRefinementMats[i][0].name.split(' ');

        basicRefinementTableHTML += '<tr><th class="header-title" colspan="12">Basic Refinement Materials ' + lesserWords[lesserWords.length - 1] + ' &rarr; ' + (i == 1 ? 'Bolt' : greaterWords[greaterWords.length - 1]) + '</th></tr>';
        basicRefinementTableHTML += '<tr><th class="upgradeElement">' + lesserWords[lesserWords.length - 1] + '</th><th></th><th class="upgradeElement">Alt Material</th><th></th><th class="upgradeElement">' + (i == 1 ? 'Bolt' : greaterWords[greaterWords.length - 1]) + '</th><th>Value Change If Refined</th><th>Profit</th></tr>';

        var category = greaterRefinementMats[i];
        for (var j = 0; j < category.length; j++) {
            var material = category[j];
            var lesserMaterial = lesserRefinementMats[i][j];
            var altMaterial = material.altMaterial;
            var materialOutputAmount = material.resultAmount ? material.resultAmount : 1;

            var valueOfMats = lesserMaterial[componentBuySell].unit_price * material.lesserMatReq;
            var valueOfAltMats = altMaterial ? altMaterial.price : 0;
            var valueOfMatsByResultBuySell = lesserMaterial[resultBuySell].unit_price * material.lesserMatReq;
            var valueOfMatsAfterTax = valueOfMatsByResultBuySell - (valueOfMatsByResultBuySell * tax);
            var valueOfResult = material[resultBuySell].unit_price * materialOutputAmount;
            var valueOfResultAfterTax = valueOfResult - (valueOfResult * tax);
            var profit = valueOfResultAfterTax - valueOfMats - valueOfAltMats;
            var delta = valueOfResultAfterTax - valueOfMatsAfterTax - valueOfAltMats;

            basicRefinementTableHTML += '<tr class="upgradeRow">';
            basicRefinementTableHTML += '<td><div class="multiplied-image"><img class="material-image" title="' + lesserMaterial.name + '" src="' + lesserMaterial.icon + '"><span>x' + material.lesserMatReq + '</span></div></td>';
            basicRefinementTableHTML += '<td>+</td>';
            basicRefinementTableHTML += '<td>' + (altMaterial ? '<img class="material-image" title="' + altMaterial.name + '" src="' + altMaterial.icon + '">' : 'N/A') + '</td>';
            basicRefinementTableHTML += '<td>=</td>';
            basicRefinementTableHTML += '<td><div class="multiplied-image"><img class="material-image" title="' + material.name + '" src="' + material.icon + '"><span>x' + materialOutputAmount + '</span></div></td>';
            basicRefinementTableHTML += '<td style="min-width:175px;" ' + (delta < 0 ? 'class="negative-currency"' : '') + '>' + convertValueToGoldHtmlString({ unit_price: delta }, 0) + '</td>';
            basicRefinementTableHTML += '<td style="min-width:175px;" ' + (profit < 0 ? 'class="negative-currency"' : '') + '>' + convertValueToGoldHtmlString({ unit_price: profit }, 0) + '</td>';
            basicRefinementTableHTML += '</tr>';
        }
    }
    basicRefinementTableHTML += '</table>';

    $('#basic-refinement-section').prepend(basicRefinementTableHTML);
};

var buildEctoSalvageTable = function () {
    var ectoSalvageTableHTML = '<table>';
    var dust = t6fine[7];

    ectoSalvageTableHTML += '<tr><th class="header-title" colspan="12">Salvage Globs of Ectoplasm</th></tr>';
    ectoSalvageTableHTML += '<tr><th class="upgradeElement">Ecto</th><th></th><th class="upgradeElement">Kit</th><th></th><th class="upgradeElement" >Dust</th><th>Value Change If Salvaged</th><th>Profit</th></tr>';

    for (var i = 0; i < salvageTools.length; i++) {

        var tool = salvageTools[i];
        var materialOutputAmount = tool.output;

        var valueOfMats = globOfEctoplasm[componentBuySell].unit_price;
        var valueOfMatsByResultBuySell = globOfEctoplasm[resultBuySell].unit_price;
        var valueOfMatsAfterTax = valueOfMatsByResultBuySell - (valueOfMatsByResultBuySell * tax);
        var valueOfResult = dust[resultBuySell].unit_price * materialOutputAmount;
        var valueOfResultAfterTax = valueOfResult - (valueOfResult * tax);
        var profit = valueOfResultAfterTax - tool.price - valueOfMats;
        var delta = valueOfResultAfterTax - tool.price - valueOfMatsAfterTax;

        ectoSalvageTableHTML += '<tr class="upgradeRow">';
        ectoSalvageTableHTML += '<td><img class="material-image" title="' + globOfEctoplasm.name + '" src="' + globOfEctoplasm.icon + '"></td>';
        ectoSalvageTableHTML += '<td>+</td>';
        ectoSalvageTableHTML += '<td><img class="material-image" title="' + tool.name + '" src="' + tool.icon + '"></td>';
        ectoSalvageTableHTML += '<td>&#8771;</td>';
        ectoSalvageTableHTML += '<td><div class="multiplied-image"><img class="material-image" title="' + dust.name + '" src="' + dust.icon + '"><span>x' + materialOutputAmount + '</span></div></td>';
        ectoSalvageTableHTML += '<td style="min-width:175px;" ' + (delta < 0 ? 'class="negative-currency"' : '') + '>' + convertValueToGoldHtmlString({ unit_price: delta }, 0) + '</td>';
        ectoSalvageTableHTML += '<td style="min-width:175px;" ' + (profit < 0 ? 'class="negative-currency"' : '') + '>' + convertValueToGoldHtmlString({ unit_price: profit }, 0) + '</td>';
        ectoSalvageTableHTML += '</tr>';
    }
    ectoSalvageTableHTML += '</table>';

    $('#ecto-salvage-section').prepend(ectoSalvageTableHTML);
};

var buildMysticCurioTable = function () {
  var mysticCurioTableHTML = '<table>';

  var mithrilIngot = ingots[8];
  var elderwoodPlank = planks[4];

  var valueOfIngots = mithrilIngot[componentBuySell].unit_price * 15;
  var valueOfPlanks = elderwoodPlank[componentBuySell].unit_price * 10;
  var valueOfIngotsResultBuySell = mithrilIngot[resultBuySell].unit_price * 15;
  var valueOfPlanksResultBuySell = elderwoodPlank[resultBuySell].unit_price * 10;

  mysticCurioTableHTML += '<tr><th class="header-title" colspan="11">Mystic Curios</th></tr>';
  mysticCurioTableHTML += '<tr><th class="upgradeElement">Trophy</th><th></th><th class="upgradeElement">Mithril Ingots</th><th></th><th class="upgradeElement">Elder Wood Planks</th><th></th><th class="upgradeElement">Mystic Curio</th><th>Value Change If Made</th><th>Profit</th><th>Cost To Make</th><th>Cost To Buy</th></tr>';

  for (var i = 0; i < mysticCurioMats.length; i++) {

      var material = mysticCurioMats[i];

      var valueOfTrophies = material[componentBuySell].unit_price * 35;
      var valueOfTrophiesResultBuySell = material[resultBuySell].unit_price * 35;

      var valueOfMats = valueOfTrophies + valueOfIngots + valueOfPlanks;
      var valueOfMatsByResultBuySell = valueOfTrophiesResultBuySell + valueOfIngotsResultBuySell + valueOfPlanksResultBuySell;
      var valueOfMatsAfterTax = valueOfMatsByResultBuySell - (valueOfMatsByResultBuySell * tax);
      var valueOfResult = mysticCurio[resultBuySell].unit_price;
      var valueOfResultAfterTax = valueOfResult - (valueOfResult * tax);
      var profit = valueOfResultAfterTax - valueOfMats;
      var delta = valueOfResultAfterTax - valueOfMatsAfterTax;

      mysticCurioTableHTML += '<tr class="upgradeRow">';
      mysticCurioTableHTML += '<td><div class="multiplied-image"><img class="material-image" title="' + material.name + '" src="' + material.icon + '"><span>x' + 35 + '</span></div></td>';
      mysticCurioTableHTML += '<td>+</td>';
      mysticCurioTableHTML += '<td><div class="multiplied-image"><img class="material-image" title="' + mithrilIngot.name + '" src="' + mithrilIngot.icon + '"><span>x' + 15 + '</span></div></td>';
      mysticCurioTableHTML += '<td>+</td>';
      mysticCurioTableHTML += '<td><div class="multiplied-image"><img class="material-image" title="' + elderwoodPlank.name + '" src="' + elderwoodPlank.icon + '"><span>x' + 10 + '</span></div></td>';
      mysticCurioTableHTML += '<td>&#8771;</td>';
      mysticCurioTableHTML += '<td><img class="material-image" title="' + mysticCurio.name + '" src="' + mysticCurio.icon + '"></td>';
      mysticCurioTableHTML += '<td style="min-width:175px;" ' + (delta < 0 ? 'class="negative-currency"' : '') + '>' + convertValueToGoldHtmlString({ unit_price: delta }, 0) + '</td>';
      mysticCurioTableHTML += '<td style="min-width:175px;" ' + (profit < 0 ? 'class="negative-currency"' : '') + '>' + convertValueToGoldHtmlString({ unit_price: profit }, 0) + '</td>';
      mysticCurioTableHTML += '<td style="min-width:175px;" ' + (valueOfMats < 0 ? 'class="negative-currency"' : '') + '>' + convertValueToGoldHtmlString({ unit_price: valueOfMats }, 0) + '</td>';
      mysticCurioTableHTML += '<td style="min-width:175px;" ' + (valueOfResult < 0 ? 'class="negative-currency"' : '') + '>' + convertValueToGoldHtmlString({ unit_price: valueOfResult }, 0) + '</td>';
      mysticCurioTableHTML += '</tr>';
  }
  mysticCurioTableHTML += '</table>';

  $('#mystic-curio-section').prepend(mysticCurioTableHTML);
};

//var buildAscendedMaterialRefinementTable = function () {
//    var asencedRefinementTableHTML = '<table>';
//    asencedRefinementTableHTML += '<tr><th class="header-title" colspan="12">Ascended Refinement</th></tr>';
//    asencedRefinementTableHTML += '<tr></tr>';

//    for (var i = 0; i < ascendedMats.length-3; i++) {
//        var material = ascendedMats[i];
//        var t2Material = material['t2'].material;
//        var t2Lesser = material['t2'].lesser;
//        var t2AltMat = t2Material.altMaterial;
//        var t3Material = material['t3'].material;
//        var t3Lesser = material['t3'].lesser;
//        var t3AltMat = t3Material.altMaterial;
//        var t4Material = material['t4'].material;
//        var t4Lesser = material['t4'].lesser;
//        var t4AltMat = t4Material.altMaterial;
//        var t5Material = material['t5'].material;
//        var t5Lesser = material['t5'].lesser;

//        //var valueOfMats = lesserMaterial[componentBuySell].unit_price * material.lesserMatReq;
//        //var valueOfAltMats = altMaterial ? altMaterial.price : 0;
//        //var valueOfMatsByResultBuySell = lesserMaterial[resultBuySell].unit_price * material.lesserMatReq;
//        //var valueOfMatsAfterTax = valueOfMatsByResultBuySell - (valueOfMatsByResultBuySell * tax);
//        //var valueOfResult = material[resultBuySell].unit_price * materialOutputAmount;
//        //var valueOfResultAfterTax = valueOfResult - (valueOfResult * tax);
//        var profit = 0;//valueOfResultAfterTax - valueOfMats - valueOfAltMats;
//        var delta = 0;//valueOfResultAfterTax - valueOfMatsAfterTax - valueOfAltMats;

//        asencedRefinementTableHTML += '<tr class="upgradeRow">';
//        asencedRefinementTableHTML += '<td style="padding-right:0;"><img class="material-image" src="' + t2Lesser.icon + '"></td>';
//        asencedRefinementTableHTML += '<td style="padding-left:0;">x' + t2Material.lesserMatReq + '</td>';
//        asencedRefinementTableHTML += '<td>+</td>';
//        asencedRefinementTableHTML += '<td>' + (t2AltMat ? '<img class="material-image" src="' + t2AltMat.icon + '">' : 'N/A') + '</td>';
//        asencedRefinementTableHTML += '<td>+</td>';
//        asencedRefinementTableHTML += '<td style="padding-right:0;"><img class="material-image" src="' + t3Lesser.icon + '"></td>';
//        asencedRefinementTableHTML += '<td style="padding-left:0;">x' + t3Material.lesserMatReq + '</td>';
//        asencedRefinementTableHTML += '<td>+</td>';
//        asencedRefinementTableHTML += '<td>' + (t3AltMat ? '<img class="material-image" src="' + t3AltMat.icon + '">' : 'N/A') + '</td>';
//        asencedRefinementTableHTML += '<td>+</td>';
//        asencedRefinementTableHTML += '<td style="padding-right:0;"><img class="material-image" src="' + t4Lesser.icon + '"></td>';
//        asencedRefinementTableHTML += '<td style="padding-left:0;">x' + t4Material.lesserMatReq + '</td>';
//        asencedRefinementTableHTML += '<td>+</td>';
//        asencedRefinementTableHTML += '<td>' + (t4AltMat ? '<img class="material-image" src="' + t4AltMat.icon + '">' : 'N/A') + '</td>';
//        asencedRefinementTableHTML += '<td>+</td>';
//        asencedRefinementTableHTML += '<td style="padding-right:0;"><img class="material-image" src="' + t5Lesser.icon + '"></td>';
//        asencedRefinementTableHTML += '<td style="padding-left:0;">x' + t5Material.lesserMatReq + '</td>';
//        asencedRefinementTableHTML += '<td>+</td>';
//        asencedRefinementTableHTML += '<td>=</td>';
//        asencedRefinementTableHTML += '<td style="padding-right:0;"><img class="material-image" src="' + material.icon + '"></td>';
//        asencedRefinementTableHTML += '<td style="min-width:175px;" ' + (delta < 0 ? 'class="negative-currency"' : '') + '>' + convertValueToGoldHtmlString({ unit_price: delta }, 0) + '</td>';
//        asencedRefinementTableHTML += '<td style="min-width:175px;" ' + (profit < 0 ? 'class="negative-currency"' : '') + '>' + convertValueToGoldHtmlString({ unit_price: profit }, 0) + '</td>';
//        asencedRefinementTableHTML += '</tr>';
//    }
//    asencedRefinementTableHTML += '</table>';

//    $('#ascended-refinement-section').prepend(asencedRefinementTableHTML);
//};

var toggleSection = function (section) {
    $('#' + section + '-section').slideToggle();
    if ($('#' + section + '-expander').html() == '+') {
        $('#' + section + '-expander').html(' - ');
    } else {
        $('#' + section + '-expander').html('+');
    }
};

var toggleLeftSelector = function () {
    $('#left-selector-expander').animate({ 'left': leftSelectorsExpanded ? '8px' : '250px', 'width': '20px' });
    $('.left-selectors').animate({ 'margin-left': leftSelectorsExpanded ? '-300px' : '0' });
    $('.right-content').animate({ 'margin-left': leftSelectorsExpanded ? '20px' : '300px' });
    $('#left-selector-expander').html(leftSelectorsExpanded ? '>' : '<');

    leftSelectorsExpanded = !leftSelectorsExpanded;
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
};

var lumpOfTin = {
    "name": "Lump of Tin",
    "price": 8,
    "icon": "https://render.guildwars2.com/file/B2705275944046734E4079651E6BB0CC0EEB3943/65932.png"
};

var lumpOfCoal = {
    "name": "Lump of Coal",
    "price": 16,
    "icon": "https://render.guildwars2.com/file/3728DC6E10FA4DADCD3B0918A70FAE9DEA96BDD4/65962.png"
};

var lumpOfPrimordium = {
    "name": "Lump of Primordium",
    "price": 48,
    "icon": "https://render.guildwars2.com/file/3728DC6E10FA4DADCD3B0918A70FAE9DEA96BDD4/65962.png"
};

var globOfEctoplasm = {
    "name": "Glob of Ectoplasm",
    "id": 19721,
    "icon": "https://render.guildwars2.com/file/18CE5D78317265000CF3C23ED76AB3CEE86BA60E/65941.png"
};

var mysticCurio = {
  "name": "Mystic Curio",
  "id": 79410,
  "icon": "https://render.guildwars2.com/file/A9C0E631560D98A6045E5D2B93E4DEEFA521A40B/1493222.png"
};

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

var ores = [
  {
      "id": 19697,
      "name": "Copper Ore"
  },
  {
      "id": 19697,
      "name": "Copper Ore"
  },
  {
      "id": 19703,
      "name": "Silver Ore"
  },
  {
      "id": 19698,
      "name": "Gold Ore"
  },
  {
      "id": 19699,
      "name": "Iron Ore"
  },
  {
      "id": 19699,
      "name": "Iron Ore"
  },
  {
      "id": 19702,
      "name": "Platinum Ore"
  },
  {
      "id": 19702,
      "name": "Platinum Ore"
  },
  {
      "id": 19700,
      "name": "Mithril Ore"
  },
  {
      "id": 19701,
      "name": "Orichalcum Ore"
  }
];

var ingots = [
  {
      "id": 19680,
      "name": "Copper Ingot",
      "lesserMatReq": 2
  },
  {
      "id": 19679,
      "name": "Bronze Ingot",
      "lesserMatReq": 10,
      "altMaterial": lumpOfTin,
      "resultAmount": 5
  },
  {
      "id": 19687,
      "name": "Silver Ingot",
      "lesserMatReq": 2
  },
  {
      "id": 19682,
      "name": "Gold Ingot",
      "lesserMatReq": 2
  },
  {
      "id": 19683,
      "name": "Iron Ingot",
      "lesserMatReq": 3
  },
  {
      "id": 19688,
      "name": "Steel Ingot",
      "lesserMatReq": 3,
      "altMaterial": lumpOfCoal
  },
  {
      "id": 19686,
      "name": "Platinum Ingot",
      "lesserMatReq": 2
  },
  {
      "id": 19681,
      "name": "Darksteel Ingot",
      "lesserMatReq": 2,
      "altMaterial": lumpOfPrimordium
  },
  {
      "id": 19684,
      "name": "Mithril Ingot",
      "lesserMatReq": 2
  },
  {
      "id": 19685,
      "name": "Orichalcum Ingot",
      "lesserMatReq": 2
  }
];

var scraps = [
  {
      "id": 19718,
      "name": "Jute Scrap"
  },
  {
      "id": 19739,
      "name": "Wool Scrap"
  },
  {
      "id": 19741,
      "name": "Cotton Scrap"
  },
  {
      "id": 19743,
      "name": "Linen Scrap"
  },
  {
      "id": 19748,
      "name": "Silk Scrap"
  },
  {
      "id": 19745,
      "name": "Gossamer Scrap"
  }
];

var bolts = [
  {
      "id": 19720,
      "name": "Bolt of Jute",
      "lesserMatReq": 2
  },
  {
      "id": 19740,
      "name": "Bolt of Wool",
      "lesserMatReq": 2
  },
  {
      "id": 19742,
      "name": "Bolt of Cotton",
      "lesserMatReq": 2
  },
  {
      "id": 19744,
      "name": "Bolt of Linen",
      "lesserMatReq": 2
  },
  {
      "id": 19747,
      "name": "Bolt of Silk",
      "lesserMatReq": 3
  },
  {
      "id": 19746,
      "name": "Bolt of Gossamer",
      "lesserMatReq": 2
  }
];

var sections = [
  {
      "id": 19719,
      "name": "Rawhide Leather Section"
  },
  {
      "id": 19728,
      "name": "Thin Leather Section"
  },
  {
      "id": 19730,
      "name": "Coarse Leather Section"
  },
  {
      "id": 19731,
      "name": "Rugged Leather Section"
  },
  {
      "id": 19729,
      "name": "Thick Leather Section"
  },
  {
      "id": 19732,
      "name": "Hardened Leather Section"
  }
];

var squares = [
  {
      "id": 19738,
      "name": "Stretched Rawhide Leather Square",
      "lesserMatReq": 2
  },
  {
      "id": 19733,
      "name": "Cured Thin Leather Square",
      "lesserMatReq": 2
  },
  {
      "id": 19734,
      "name": "Cured Coarse Leather Square",
      "lesserMatReq": 2
  },
  {
      "id": 19736,
      "name": "Cured Rugged Leather Square",
      "lesserMatReq": 2
  },
  {
      "id": 19735,
      "name": "Cured Thick Leather Square",
      "lesserMatReq": 4
  },
  {
      "id": 19737,
      "name": "Cured Hardened Leather Square",
      "lesserMatReq": 3
  }
];

var logs = [
  {
      "id": 19723,
      "name": "Green Wood Log"
  },
  {
      "id": 19726,
      "name": "Soft Wood Log"
  },
  {
      "id": 19727,
      "name": "Seasoned Wood Log"
  },
  {
      "id": 19724,
      "name": "Hard Wood Log"
  },
  {
      "id": 19722,
      "name": "Elder Wood Log"
  },
  {
      "id": 19725,
      "name": "Ancient Wood Log"
  }
];

var planks = [
  {
      "id": 19710,
      "name": "Green Wood Plank",
      "lesserMatReq": 3
  },
  {
      "id": 19713,
      "name": "Soft Wood Plank",
      "lesserMatReq": 2
  },
  {
      "id": 19714,
      "name": "Seasoned Wood Plank",
      "lesserMatReq": 3
  },
  {
      "id": 19711,
      "name": "Hard Wood Plank",
      "lesserMatReq": 3
  },
  {
      "id": 19709,
      "name": "Elder Wood Plank",
      "lesserMatReq": 3
  },
  {
      "id": 19712,
      "name": "Ancient Wood Plank",
      "lesserMatReq": 3
  }
];

var ascendedMats = [
  {
      "id": 46738,
      "name": "Deldrimor Steel Ingot",
      "t2": {
          "material": ingots[4],
          "lesser": ores[4]
      },
      "t3": {
          "material": ingots[5],
          "lesser": ores[5]
      },
      "t4": {
          "material": ingots[7],
          "lesser": ores[7]
      },
      "t5": {
          "material": ingots[8],
          "lesser": ores[8]
      }
  },
  {
      "id": 46739,
      "name": "Elonian Leather Square",
      "t2": ingots[1],
      "t3": ingots[2],
      "t4": ingots[3],
      "t5": ingots[4]
  },
  {
      "id": 46736,
      "name": "Spiritwood Plank",
      "t2": ingots[1],
      "t3": ingots[2],
      "t4": ingots[3],
      "t5": ingots[4]
  },
  {
      "id": 46741,
      "name": "Bolt of Damask",
      "t2": ingots[1],
      "t3": ingots[2],
      "t4": ingots[3],
      "t5": ingots[4]
  }
];

var mysticCurioMats = [
  t5fine[0],
  t5fine[1],
  t5fine[2],
  t5fine[3],
  t5fine[4],
  t5fine[5],
  t5fine[6]
];

var salvageTools = [
    {
        "name": "Crude Salvage Kit",
        "price": 32 / 15,
        "output": 1.46,
        "icon": "https://render.guildwars2.com/file/9F09ACD431CE4906631E271E650ABB0454F90705/63123.png"
    },
    {
        "name": "Basic Salvage Kit",
        "price": 88 / 25,
        "output": 1.62,
        "icon": "https://render.guildwars2.com/file/F0B4025A23D3D1ADE0466FFEAA7023D8EFD8422C/66765.png"
    },
    {
        "name": "Copper-Fed Salvage-o-Matic",
        "price": 3,
        "output": 1.62,
        "icon": "https://render.guildwars2.com/file/CC2004000FFDFCEF346AAE296FD0E858C0990548/619581.png"
    },
    {
        "name": "Fine Salvage Kit",
        "price": 288 / 25,
        "output": 1.74,
        "icon": "https://render.guildwars2.com/file/CA01D91B20EB19359FFF313C6DC5C2480A0872B0/66766.png"
    },
    {
        "name": "Master's Salvage Kit",
        "price": 1536 / 25,
        "output": 1.85,
        "icon": "https://render.guildwars2.com/file/75FB93F7EA0D3CFC0E023D1C72BE205457F905F7/66768.png"
    },
    {
        "name": "Mystic Salvage Kit",
        "price": 2624 / 250,
        "output": 1.85,
        "icon": "https://render.guildwars2.com/file/9F09ACD431CE4906631E271E650ABB0454F90705/63123.png"
    },
    {
        "name": "Silver-Fed Salvage-o-Matic",
        "price": 60,
        "output": 1.85,
        "icon": "https://render.guildwars2.com/file/53BE1B65A817091427E30319C2B2B3777C27A319/855379.png"
    },
    {
        "name": "Black Lion Salvage Kit",
        "price": 0,
        "output": 2.00,
        "icon": "https://render.guildwars2.com/file/2204EE5D7B1F7BEE9261CBAE3BF1DB5B027EE607/66551.png"
    },
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

var lesserRefinementMats = [
    ores,
    scraps,
    sections,
    logs
];

var greaterRefinementMats = [
    ingots,
    bolts,
    squares,
    planks
];
