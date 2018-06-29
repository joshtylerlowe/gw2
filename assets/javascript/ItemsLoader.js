var allItems;

$.getJSON('/assets/data/allItemIdsAndNames_6.29.18.json', function (response) {
    allItems = response;
    $('.full-page-loading-spinner-container').hide();
});
