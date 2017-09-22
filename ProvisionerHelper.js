var buySellValue = 'buy';
var prices = [];

$(document).ready(function () {
    generateProvisionerTable();

    $('#gw2efficiencyButton').click(function () {
        selectedProvisioners = [];

        $('input:checkbox:not("#allProvisionersCheckbox")').each(function () {
            var $this = $(this);

            if ($this.is(':checked')) {
                selectedProvisioners.push($this.attr('value'));
            }
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
});

var generateProvisionerTable = function () {
    $('#provisionerList').find("tr:gt(0)").remove();

    for (var i = 0; i < provisioners.length; i++) {
        var provisionerItems = provisioners[i].items;
        var provisionerItemIds = provisionerItems.map(function (item) {
            return item.id;
        });

        if (!prices[i]) {
            prices[i] = gw2ApiCall("v2/commerce/prices", [{ ids: provisionerItemIds.toString() }]);
        }

        _.map(provisionerItems, function (item) {
            return _.extend(item, _.findWhere(prices[i], { id: item.id }));
        });

        provisionerItems.sort(function (a, b) {
            if (buySellValue == 'buy') {
                return a.buys.unit_price - b.buys.unit_price;
            } else if (buySellValue == 'sell') {
                return a.sells.unit_price - b.sells.unit_price;
            }
        });
    }

    $.each(provisioners, function (key, value) {

        var buy = convertValueToGoldHtmlString(value.items[0].buys);
        var sell = convertValueToGoldHtmlString(value.items[0].sells);

        $('#provisionerList tr:last').after(
            '<tr>' +
            '<td><input class="selectableProvisioner" type="checkbox" waypoint="' + value.waypoint + '" value="' + value.items[0].id + ' ' + value.items[0].name + '" onclick="updateWaypoints()" /></td>' +
            '<td>' + value.name + '</td>' +
            '<td>' + value.items[0].name + '</td>' +
            '<td style="text-align:right;">' + buy + '</td>' +
            '<td style="text-align:right;">' + sell + '</td>' +
            '<td>' + value.description + '</td>' +
            '</tr>'
            );
    });

    updateWaypoints();
    $('.full-page-loading-spinner-container').hide();
}

var updateWaypoints = function () {
    var waypoints = [];

    $('input:checkbox:not("#allProvisionersCheckbox")').each(function () {
        var $this = $(this);

        if ($this.is(':checked')) {
            waypoints.push($this.attr('waypoint'));
        }
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
    var isChecked = $('#allProvisionersCheckbox').is(':checked');

    $('input:checkbox:not("#allProvisionersCheckbox")').each(function () {
        var $this = $(this);

        $this.prop('checked', isChecked);
    });
    
    updateWaypoints();
}

var selectedProvisioners = [];

var natomi = [
  {
      "name": "Assassin's Krait Machete",
      "id": 46281
  },
  {
      "name": "Assassin's Krait Shooter",
      "id": 46186
  },
  {
      "name": "Assassin's Krait Star",
      "id": 46040
  },
  {
      "name": "Assassin's Gladiator Legplates",
      "id": 45622
  },
  {
      "name": "Assassin's Noble Pants",
      "id": 45765
  },
  {
      "name": "Assassin's Masquerade Leggings",
      "id": 45731
  }
];
var kani = [
  {
      "name": "Carrion Krait Slayer",
      "id": 15465
  },
  {
      "name": "Carrion Krait Short Bow",
      "id": 14469
  },
  {
      "name": "Carrion Krait Wand",
      "id": 13924
  },
  {
      "name": "Carrion Gladiator Boots",
      "id": 10702
  },
  {
      "name": "Carrion Noble Boots",
      "id": 11876
  },
  {
      "name": "Carrion Masquerade Boots",
      "id": 11121
  }
];
var vec = [
  {
      "name": "Valkyrie Krait Shell",
      "id": 15394
  },
  {
      "name": "Valkyrie Krait Whelk",
      "id": 14517
  },
  {
      "name": "Valkyrie Krait Crook",
      "id": 13895
  },
  {
      "name": "Valkyrie Gladiator Chestplate",
      "id": 10722
  },
  {
      "name": "Valkyrie Noble Coat",
      "id": 11798
  },
  {
      "name": "Valkyrie Masquerade Raiments",
      "id": 11295
  }
];
var ival = [
  {
      "name": "Apothecary's Krait Ripper",
      "id": 36779
  },
  {
      "name": "Apothecary's Krait Recurve Bow",
      "id": 36750
  },
  {
      "name": "Apothecary's Krait Crook",
      "id": 36813
  },
  {
      "name": "Apothecary's Gladiator Pauldrons",
      "id": 36746
  },
  {
      "name": "Apothecary's Noble Shoulders",
      "id": 36891
  },
  {
      "name": "Apothecary's Masquerade Mantle",
      "id": 36892
  }
];
var katren = [
  {
      "name": "Cleric's Krait Warhammer",
      "id": 15508
  },
  {
      "name": "Cleric's Krait Handgun",
      "id": 14596
  },
  {
      "name": "Cleric's Krait Star",
      "id": 13974
  },
  {
      "name": "Cleric's Gladiator Gauntlets",
      "id": 10710
  },
  {
      "name": "Cleric's Noble Gloves",
      "id": 11835
  },
  {
      "name": "Cleric's Masquerade Gloves",
      "id": 11248
  }
];
var azzi = [
  {
      "name": "Giver's Mithril Mace",
      "id": 38336
  },
  {
      "name": "Giver's Krait Recurve Bow",
      "id": 38367
  },
  {
      "name": "Giver's Krait Wand",
      "id": 38415
  },
  {
      "name": "Giver's Gladiator Helm",
      "id": 38179
  },
  {
      "name": "Giver's Noble Mask",
      "id": 38264
  },
  {
      "name": "Giver's Masquerade Mask",
      "id": 38228
  }
];
var rakatin = [
  {
      "name": "Rampager's Krait Battleaxe",
      "id": 15427
  },
  {
      "name": "Rampager's Krait Shooter",
      "id": 14648
  },
  {
      "name": "Rampager's Krait Wand",
      "id": 13928
  },
  {
      "name": "Rampager's Gladiator Legplates",
      "id": 10699
  },
  {
      "name": "Rampager's Noble Pants",
      "id": 11754
  },
  {
      "name": "Rampager's Masquerade Leggings",
      "id": 11167
  }
];
var polly = [
  {
      "name": "Valkyrie Krait Morning Star",
      "id": 15352
  },
  {
      "name": "Valkyrie Krait Brazier",
      "id": 14566
  },
  {
      "name": "Valkyrie Krait Crook",
      "id": 13895
  },
  {
      "name": "Valkyrie Gladiator Chestplate",
      "id": 10722
  },
  {
      "name": "Valkyrie Noble Coat",
      "id": 11798
  },
  {
      "name": "Valkyrie Masquerade Raiments",
      "id": 11295
  }
];
var huanya = [
  {
      "name": "Knight's Krait Warhammer",
      "id": 15512
  },
  {
      "name": "Knight's Krait Whelk",
      "id": 14516
  },
  {
      "name": "Knight's Krait Crook",
      "id": 13894
  },
  {
      "name": "Knight's Gladiator Boots",
      "id": 10707
  },
  {
      "name": "Knight's Noble Boots",
      "id": 11881
  },
  {
      "name": "Knight's Masquerade Boots",
      "id": 11126
  }
];
var jatt = [
  {
      "name": "Carrion Krait Battleaxe",
      "id": 15423
  },
  {
      "name": "Carrion Krait Recurve Bow",
      "id": 14428
  },
  {
      "name": "Carrion Krait Star",
      "id": 13973
  },
  {
      "name": "Carrion Gladiator Gauntlets",
      "id": 10709
  },
  {
      "name": "Carrion Noble Gloves",
      "id": 11834
  },
  {
      "name": "Carrion Masquerade Gloves",
      "id": 11247
  }
];
var assistant = [
  {
      "name": "Berserker's Krait Shell",
      "id": 15391
  },
  {
      "name": "Berserker's Krait Brazier",
      "id": 14563
  },
  {
      "name": "Berserker's Krait Star",
      "id": 13976
  },
  {
      "name": "Berserker's Gladiator Pauldrons",
      "id": 10691
  },
  {
      "name": "Berserker's Noble Shoulders",
      "id": 11921
  },
  {
      "name": "Berserker's Masquerade Mantle",
      "id": 11341
  }
];
var tinkerclaw = [
  {
      "name": "Apothecary's Krait Ripper",
      "id": 36779
  },
  {
      "name": "Apothecary's Krait Shooter",
      "id": 36812
  },
  {
      "name": "Apothecary's Krait Wand",
      "id": 36780
  },
  {
      "name": "Apothecary's Gladiator Helm",
      "id": 36806
  },
  {
      "name": "Apothecary's Noble Mask",
      "id": 36842
  },
  {
      "name": "Apothecary's Masquerade Mask",
      "id": 36844
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