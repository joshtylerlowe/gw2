var allItems;

$.getJSON('allItemIdsAndNames.json', function (response) {
    allItems = response;
    $('.full-page-loading-spinner-container').hide();
});