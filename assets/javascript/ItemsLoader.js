var allItems;

$.getJSON('/assets/data/allItemIdsAndNames_4.5.22.json', function (response) {
    allItems = response;
    $('.full-page-loading-spinner-container').hide();
});
