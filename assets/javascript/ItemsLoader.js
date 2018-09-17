var allItems;

$.getJSON('/assets/data/allItemIdsAndNames_9.13.18.json', function (response) {
    allItems = response;
    $('.full-page-loading-spinner-container').hide();
});
