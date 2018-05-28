var allItems;

$.getJSON('/assets/data/allItemIdsAndNames_4.22.18.json', function (response) {
    allItems = response;
    $('.full-page-loading-spinner-container').hide();
});