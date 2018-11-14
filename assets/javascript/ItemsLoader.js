var allItems;

$.getJSON('/assets/data/allItemIdsAndNames_11.5.18.json', function (response) {
    allItems = response;
    $('.full-page-loading-spinner-container').hide();
});
