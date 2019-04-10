var allItems;

$.getJSON('/assets/data/allItemIdsAndNames_4.10.19.json', function (response) {
    allItems = response;
    $('.full-page-loading-spinner-container').hide();
});
