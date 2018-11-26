var allItems;

$.getJSON('/assets/data/allItemIdsAndNames_11.26.18.json', function (response) {
    allItems = response;
    $('.full-page-loading-spinner-container').hide();
});
