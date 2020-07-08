var allItems;

$.getJSON('/assets/data/allItemIdsAndNames_6.7.20.json', function (response) {
    allItems = response;
    $('.full-page-loading-spinner-container').hide();
});
