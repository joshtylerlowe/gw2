﻿var allItems;

$.getJSON('/assets/data/allItemIdsAndNames_10.19.18.json', function (response) {
    allItems = response;
    $('.full-page-loading-spinner-container').hide();
});
