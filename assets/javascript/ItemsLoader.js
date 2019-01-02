var allItems;

$.getJSON('/assets/data/allItemIdsAndNames_1.2.19.json', function (response) {
    allItems = response;
    $('.full-page-loading-spinner-container').hide();
});
