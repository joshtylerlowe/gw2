var buySellValue = 'buy';
var prices = [];
var craftTypesToShow = [];
var allChecked = false;

$(document).ready(function () {
    generateProvisionerTable();

    $('#gw2efficiencyButton').click(function () {
        selectedProvisioners = [];

        $('input:checkbox[class^="selectableProvisioner"]:checked').each(function () {
            selectedProvisioners.push($(this).attr('value'));
        });

        window.open('https://gw2efficiency.com/crafting/calculator/' + selectedProvisioners.toString().replace(/\s+/g, '-'), '_blank').focus();
    });

    $('#waypointsButton').click(function () {
        try {
            var $temp = $('<input>');
            $('body').append($temp);
            $temp.val($('#waypointsList').val()).select();
            document.execCommand('copy');
            $temp.remove();
            alert('copied to clipboard');
        } catch (err) {
            alert('error while trying to copy to clipboard');
        }
    });

    $('input[name=buySellSelection]').click(function () {
        buySellValue = $('input[name=buySellSelection]:checked').val();
        generateProvisionerTable();
    });

    $('input[class^="craftTypeFilterOption"]').click(function () {
        updateCraftType();
    });
});

var generateProvisionerTable = function () {
    craftTypesToShow = [];
    $('input[class^="craftTypeFilterOption"]:checked').each(function () {
        craftTypesToShow.push($(this).attr('value'));
    });

    $('#provisionerList').find("tr:gt(0)").remove();

    var tempProvisioners = $.extend(true, [], provisioners);

    for (var i = 0; i < provisioners.length; i++) {
        var provisionerItems = $.extend(true, [], tempProvisioners[i].items);
        var provisionerItemIds = provisionerItems.map(function (item) {
            return item.id;
        });

        if (!prices[i]) {
            prices[i] = gw2ApiCall("v2/commerce/prices", [{ ids: provisionerItemIds.toString() }]);
        }

        _.map(provisionerItems, function (item) {
            return _.extend(item, _.findWhere(prices[i], { id: item.id }));
        });

        provisionerItems = _.filter(provisionerItems, function (item) {
            return craftTypesToShow.includes(item.craftType);
        });

        tempProvisioners[i].items = provisionerItems.sort(function (a, b) {
            if (buySellValue == 'buy') {
                return a.buys.unit_price - b.buys.unit_price;
            } else if (buySellValue == 'sell') {
                return a.sells.unit_price - b.sells.unit_price;
            }
        });
    }


    if (!tempProvisioners[0].items[0]) {
        $('#provisionerList tr:last').after(
          '<tr><td colspan="7">no items match filter</td></tr>'
        );
    } else {
        $.each(tempProvisioners, function (key, value) {
            var buy = convertValueToGoldHtmlString(value.items[0].buys);
            var sell = convertValueToGoldHtmlString(value.items[0].sells);

            $('#provisionerList tr:last').after(
                '<tr>' +
                '<td style="text-align:center;"><input class="selectableProvisioner" type="checkbox" waypoint="' + value.waypoint + '" value="' + value.items[0].id + ' ' + value.items[0].name + '" onclick="updateWaypoints()" /></td>' +
                '<td>' + value.name + '</td>' +
                '<td style="text-align:center;">' + getCraftTypeIconHTML(value.items[0].craftType) + '</td>' +
                '<td>' + value.items[0].name + '</td>' +
                '<td style="text-align:right;">' + buy + '</td>' +
                '<td style="text-align:right;">' + sell + '</td>' +
                '<td>' + value.description + '</td>' +
                '</tr>'
                );
        });
    }

    updateWaypoints();
    $('.full-page-loading-spinner-container').hide();
}

var updateCraftType = function () {
    allChecked = false;
    generateProvisionerTable();
    updateWaypoints();
}

var updateWaypoints = function () {
    var waypoints = [];

    $('input:checkbox[class^="selectableProvisioner"]:checked').each(function () {
        waypoints.push($(this).attr('waypoint'));
    });

    if (waypoints.length > 0) {
        $('#waypointsContainer').show();
        $('#waypointsList').val(waypoints.toString());
    } else {
        $('#waypointsContainer').hide();
        $('#waypointsList').val('');
    }
};

var toggleAllProvisioners = function () {
    allChecked = !allChecked;

    $('input:checkbox[class^="selectableProvisioner"]').each(function () {
        $(this).prop('checked', allChecked);
    });

    updateWaypoints();
}

var getCraftTypeIconHTML = function (craftType) {
    var imageHTML = ''
    switch (craftType) {
        case 'weaponsmith':
            imageHTML = '<img src="/assets/images/weaponsmith.png">';
            break;
        case 'huntsman':
            imageHTML = '<img src="/assets/images/huntsman.png">';
            break;
        case 'artificer':
            imageHTML = '<img src="/assets/images/artificer.png">';
            break;
        case 'armorsmith':
            imageHTML = '<img src="/assets/images/armorsmith.png">';
            break;
        case 'leatherworker':
            imageHTML = '<img src="/assets/images/leatherworker.png">';
            break;
        case 'tailor':
            imageHTML = '<img src="/assets/images/tailor.png">';
            break;
    }

    return imageHTML;
}

var selectedProvisioners = [];

var natomi = [
  {
      "name": "Assassin's Krait Machete",
      "id": 46281,
      "craftType": "weaponsmith"
  },
  {
      "name": "Assassin's Krait Shooter",
      "id": 46186,
      "craftType": "huntsman"
  },
  {
      "name": "Assassin's Krait Star",
      "id": 46040,
      "craftType": "artificer"
  },
  {
      "name": "Assassin's Gladiator Legplates",
      "id": 45622,
      "craftType": "armorsmith"
  },
  {
      "name": "Assassin's Noble Pants",
      "id": 45765,
      "craftType": "leatherworker"
  },
  {
      "name": "Assassin's Masquerade Leggings",
      "id": 45731,
      "craftType": "tailor"
  }
];
var kani = [
  {
      "name": "Carrion Krait Slayer",
      "id": 15465,
      "craftType": "weaponsmith"
  },
  {
      "name": "Carrion Krait Short Bow",
      "id": 14469,
      "craftType": "huntsman"
  },
  {
      "name": "Carrion Krait Wand",
      "id": 13924,
      "craftType": "artificer"
  },
  {
      "name": "Carrion Gladiator Boots",
      "id": 10702,
      "craftType": "armorsmith"
  },
  {
      "name": "Carrion Noble Boots",
      "id": 11876,
      "craftType": "leatherworker"
  },
  {
      "name": "Carrion Masquerade Boots",
      "id": 11121,
      "craftType": "tailor"
  }
];
var vec = [
  {
      "name": "Valkyrie Krait Shell",
      "id": 15394,
      "craftType": "weaponsmith"
  },
  {
      "name": "Valkyrie Krait Whelk",
      "id": 14517,
      "craftType": "huntsman"
  },
  {
      "name": "Valkyrie Krait Crook",
      "id": 13895,
      "craftType": "artificer"
  },
  {
      "name": "Valkyrie Gladiator Chestplate",
      "id": 10722,
      "craftType": "armorsmith"
  },
  {
      "name": "Valkyrie Noble Coat",
      "id": 11798,
      "craftType": "leatherworker"
  },
  {
      "name": "Valkyrie Masquerade Raiments",
      "id": 11295,
      "craftType": "tailor"
  }
];
var ival = [
  {
      "name": "Apothecary's Krait Ripper",
      "id": 36779,
      "craftType": "weaponsmith"
  },
  {
      "name": "Apothecary's Krait Recurve Bow",
      "id": 36750,
      "craftType": "huntsman"
  },
  {
      "name": "Apothecary's Krait Crook",
      "id": 36813,
      "craftType": "artificer"
  },
  {
      "name": "Apothecary's Gladiator Pauldrons",
      "id": 36746,
      "craftType": "armorsmith"
  },
  {
      "name": "Apothecary's Noble Shoulders",
      "id": 36891,
      "craftType": "leatherworker"
  },
  {
      "name": "Apothecary's Masquerade Mantle",
      "id": 36892,
      "craftType": "tailor"
  }
];
var katren = [
  {
      "name": "Cleric's Krait Warhammer",
      "id": 15508,
      "craftType": "weaponsmith"
  },
  {
      "name": "Cleric's Krait Handgun",
      "id": 14596,
      "craftType": "huntsman"
  },
  {
      "name": "Cleric's Krait Star",
      "id": 13974,
      "craftType": "artificer"
  },
  {
      "name": "Cleric's Gladiator Gauntlets",
      "id": 10710,
      "craftType": "armorsmith"
  },
  {
      "name": "Cleric's Noble Gloves",
      "id": 11835,
      "craftType": "leatherworker"
  },
  {
      "name": "Cleric's Masquerade Gloves",
      "id": 11248,
      "craftType": "tailor"
  }
];
var azzi = [
  {
      "name": "Giver's Mithril Mace",
      "id": 38336,
      "craftType": "weaponsmith"
  },
  {
      "name": "Giver's Krait Recurve Bow",
      "id": 38367,
      "craftType": "huntsman"
  },
  {
      "name": "Giver's Krait Wand",
      "id": 38415,
      "craftType": "artificer"
  },
  {
      "name": "Giver's Gladiator Helm",
      "id": 38179,
      "craftType": "armorsmith"
  },
  {
      "name": "Giver's Noble Mask",
      "id": 38264,
      "craftType": "leatherworker"
  },
  {
      "name": "Giver's Masquerade Mask",
      "id": 38228,
      "craftType": "tailor"
  }
];
var rakatin = [
  {
      "name": "Rampager's Krait Battleaxe",
      "id": 15427,
      "craftType": "weaponsmith"
  },
  {
      "name": "Rampager's Krait Shooter",
      "id": 14648,
      "craftType": "huntsman"
  },
  {
      "name": "Rampager's Krait Wand",
      "id": 13928,
      "craftType": "artificer"
  },
  {
      "name": "Rampager's Gladiator Legplates",
      "id": 10699,
      "craftType": "armorsmith"
  },
  {
      "name": "Rampager's Noble Pants",
      "id": 11754,
      "craftType": "leatherworker"
  },
  {
      "name": "Rampager's Masquerade Leggings",
      "id": 11167,
      "craftType": "tailor"
  }
];
var polly = [
  {
      "name": "Valkyrie Krait Morning Star",
      "id": 15352,
      "craftType": "weaponsmith"
  },
  {
      "name": "Valkyrie Krait Brazier",
      "id": 14566,
      "craftType": "huntsman"
  },
  {
      "name": "Valkyrie Krait Crook",
      "id": 13895,
      "craftType": "artificer"
  },
  {
      "name": "Valkyrie Gladiator Chestplate",
      "id": 10722,
      "craftType": "armorsmith"
  },
  {
      "name": "Valkyrie Noble Coat",
      "id": 11798,
      "craftType": "leatherworker"
  },
  {
      "name": "Valkyrie Masquerade Raiments",
      "id": 11295,
      "craftType": "tailor"
  }
];
var huanya = [
  {
      "name": "Knight's Krait Warhammer",
      "id": 15512,
      "craftType": "weaponsmith"
  },
  {
      "name": "Knight's Krait Whelk",
      "id": 14516,
      "craftType": "huntsman"
  },
  {
      "name": "Knight's Krait Crook",
      "id": 13894,
      "craftType": "artificer"
  },
  {
      "name": "Knight's Gladiator Boots",
      "id": 10707,
      "craftType": "armorsmith"
  },
  {
      "name": "Knight's Noble Boots",
      "id": 11881,
      "craftType": "leatherworker"
  },
  {
      "name": "Knight's Masquerade Boots",
      "id": 11126,
      "craftType": "tailor"
  }
];
var jatt = [
  {
      "name": "Carrion Krait Battleaxe",
      "id": 15423,
      "craftType": "weaponsmith"
  },
  {
      "name": "Carrion Krait Recurve Bow",
      "id": 14428,
      "craftType": "huntsman"
  },
  {
      "name": "Carrion Krait Star",
      "id": 13973,
      "craftType": "artificer"
  },
  {
      "name": "Carrion Gladiator Gauntlets",
      "id": 10709,
      "craftType": "armorsmith"
  },
  {
      "name": "Carrion Noble Gloves",
      "id": 11834,
      "craftType": "leatherworker"
  },
  {
      "name": "Carrion Masquerade Gloves",
      "id": 11247,
      "craftType": "tailor"
  }
];
var assistant = [
  {
      "name": "Berserker's Krait Shell",
      "id": 15391,
      "craftType": "weaponsmith"
  },
  {
      "name": "Berserker's Krait Brazier",
      "id": 14563,
      "craftType": "huntsman"
  },
  {
      "name": "Berserker's Krait Star",
      "id": 13976,
      "craftType": "artificer"
  },
  {
      "name": "Berserker's Gladiator Pauldrons",
      "id": 10691,
      "craftType": "armorsmith"
  },
  {
      "name": "Berserker's Noble Shoulders",
      "id": 11921,
      "craftType": "leatherworker"
  },
  {
      "name": "Berserker's Masquerade Mantle",
      "id": 11341,
      "craftType": "tailor"
  }
];
var tinkerclaw = [
  {
      "name": "Apothecary's Krait Ripper",
      "id": 36779,
      "craftType": "weaponsmith"
  },
  {
      "name": "Apothecary's Krait Shooter",
      "id": 36812,
      "craftType": "huntsman"
  },
  {
      "name": "Apothecary's Krait Wand",
      "id": 36780,
      "craftType": "artificer"
  },
  {
      "name": "Apothecary's Gladiator Helm",
      "id": 36806,
      "craftType": "armorsmith"
  },
  {
      "name": "Apothecary's Noble Mask",
      "id": 36842,
      "craftType": "leatherworker"
  },
  {
      "name": "Apothecary's Masquerade Mask",
      "id": 36844,
      "craftType": "tailor"
  }
];

var provisioners = [
    {
        name: 'Quartermaster Natomi',
        description: 'Next to Shipwreck Peak Waypoint',
        waypoint: '[&BN4HAAA=]',
        items: natomi
    },
    {
        name: 'Supplymaster Kani',
        description: 'Next to the Jaka Itzel waypoint',
        waypoint: '[&BOAHAAA=]',
        items: kani
    },
    {
        name: 'Quartermaster Vec',
        description: 'Next to the Pact Encampment waypoint',
        waypoint: '[&BAgIAAA=]',
        items: vec
    },
    {
        name: 'Quartermaster Ival',
        description: 'Next to the Mellaggan\'s Valor waypoint',
        waypoint: '[&BNUHAAA=]',
        items: ival
    },
    {
        name: 'Steward Katren',
        description: 'Next to the Faren\'s Flyer waypoint',
        waypoint: '[&BO8HAAA=]',
        items: katren
    },
    {
        name: 'Supplymaster Azzi',
        description: 'In the Northwatch Priory Camp after clearing the area',
        waypoint: '[&BN0HAAA=]',
        items: azzi
    },
    {
        name: 'Scavenger Rakatin',
        description: 'Between the waypoint and the skritt town',
        waypoint: '[&BAYIAAA=]',
        items: rakatin
    },
    {
        name: 'Forager Polly',
        description: 'Next to the waypoint after clearing the area',
        waypoint: '[&BAIIAAA=]',
        items: polly
    },
    {
        name: 'Supplier Huanya',
        description: 'Near the repair merchant in the tree above the waypoint',
        waypoint: '[&BAwIAAA=]',
        items: huanya
    },
    {
        name: 'Jatt',
        description: 'By the Rata Novus waypoint, after unlocking the waypoint by completing the first chain of the Outpost: Rata Novus meta event',
        waypoint: '[&BAMIAAA=]',
        items: jatt
    },
    {
        name: 'Supply Assistant',
        description: 'Just north from the Ogre Camp waypoint',
        waypoint: '[&BMwHAAA=]',
        items: assistant
    },
    {
        name: 'Terrill Tinkerclaw',
        description: 'In the camp near the waypoint. Outpost events must be completed and chak gerent may not be in progress.',
        waypoint: '[&BAAIAAA=]',
        items: tinkerclaw
    },
];
