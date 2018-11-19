var allItems;

$.getJSON('/assets/data/allItemIdsAndNames_11.19.18.json', function (response) {
    allItems = response;
    $('.full-page-loading-spinner-container').hide();
});
