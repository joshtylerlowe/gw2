var baseUrl = 'https://api.guildwars2.com/';

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
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        success: function (ret) {
            result = ret;
        },
        error: function (error) {
            if (error.responseJSON.text != "all ids provided are invalid") {
                alert(error.responseJSON.text);
            }
        }
    });

    return result;
};

var convertValueToGoldHtmlString = function (value, fixedToVal) {
    var returnValue = 'N/A';

    if (value) {
        var amount = value.unit_price;
        var isNegative = false;

        if (amount < 0) {
            amount = amount * -1;
            isNegative = true;
        }

        var gold = 0;
        var silver = 0;
        var copper = 0;

        if (amount > 0) {
            copper = (amount % 100).toFixed(fixedToVal);
            amount = Math.floor(amount / 100);
            if (copper == 100) {
                copper = 0;
                amount++;
            }
        }
        if (amount > 0) {
            silver = amount % 100;
            amount = Math.floor(amount / 100);
            if (silver == 100) {
                silver = 0;
                amount++;
            }
        }
        if (amount > 0) {
            gold = amount
        }

        returnValue = (isNegative ? '-' : '') +
            (gold > 0 ? gold + ' <img class="currency" src="/assets/images/Gold_coin.png"> ' : '') +
            (silver > 0 ? (silver < 10 && gold > 0 ? '0' + silver : silver) + ' <img class="currency" src="/assets/images/Silver_coin.png"> ' : (gold > 0 ? '00 <img class="currency" src="/assets/images/Silver_coin.png"> ' : '')) +
            (copper > 0 ? (copper < 10 && silver > 0 ? '0' + copper : copper) + ' <img class="currency" src="/assets/images/Copper_coin.png">' : (gold > 0 || silver > 0 ? '00 <img class="currency" src="/assets/images/Copper_coin.png"> ' : ''));

        if (returnValue.length < 2) {
            return '0';
        }
    }

    return returnValue;
};

var mergeDataByKey = function (a1, a2, key) {
    return _.map(a1, function (item) {
        return _.extend(item, _.findWhere(a2, { [key]: item[key] }));
    });
};

var secondsTimeSpanToHMS = function (s) {
    var h = Math.floor(s/3600); //Get whole hours
    s -= h*3600;
    var m = Math.floor(s/60); //Get remaining minutes
    s -= m*60;
    return h+":"+(m < 10 ? '0'+m : m)+":"+(s < 10 ? '0'+s : s); //zero padding on minutes and seconds
}

var secondsTimeSpanToMS = function (s) {
    var m = Math.floor(s/60); //Get remaining minutes
    s -= m*60;
    return (m < 10 ? '0'+m : m)+":"+(s < 10 ? '0'+s : s); //zero padding on minutes and seconds
}

Array.prototype.pushArray = function (arr) {
    this.push.apply(this, arr);
};
