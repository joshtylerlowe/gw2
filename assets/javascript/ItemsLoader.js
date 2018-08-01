var allItems;

$.getJSON('/assets/data/allItemIdsAndNames_8.1.18.json', function (response) {
    allItems = response;
    $('.full-page-loading-spinner-container').hide();
});
