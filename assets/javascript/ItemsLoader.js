var allItems;

$.getJSON('/assets/data/allItemIdsAndNames_6.18.18.json', function (response) {
    allItems = response;
    $('.full-page-loading-spinner-container').hide();
});
