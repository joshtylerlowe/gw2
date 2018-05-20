var allItems;

$.getJSON('/assets/data/allItemIdsAndNames_4.13.18.json', function (response) {
    allItems = response;
    $('.full-page-loading-spinner-container').hide();
});