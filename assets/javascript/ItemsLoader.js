var allItems;

$.getJSON('/assets/data/allItemIdsAndNames_2.9.19.json', function (response) {
    allItems = response;
    $('.full-page-loading-spinner-container').hide();
});
