var allItems;

$.getJSON('/assets/data/allItemIdsAndNames_8.31.18.json', function (response) {
    allItems = response;
    $('.full-page-loading-spinner-container').hide();
});
