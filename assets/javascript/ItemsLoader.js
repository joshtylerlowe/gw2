var allItems;

$.getJSON('/assets/data/allItemIdsAndNames_7.30.18.json', function (response) {
    allItems = response;
    $('.full-page-loading-spinner-container').hide();
});
