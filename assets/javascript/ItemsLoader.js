﻿var allItems;

$.getJSON('/assets/data/allItemIdsAndNames_4.29.18.json', function (response) {
    allItems = response;
    $('.full-page-loading-spinner-container').hide();
});
