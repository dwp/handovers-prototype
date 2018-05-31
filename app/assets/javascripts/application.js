/* global $ */
/* global GOVUK */

// Warn about using the kit in production
if (window.console && window.console.info) {
  window.console.info('GOV.UK Prototype Kit - do not use for production')
}

$(document).ready(function () {
  // Use GOV.UK shim-links-with-button-role.js to trigger a link styled to look like a button,
  // with role="button" when the space key is pressed.
  GOVUK.shimLinksWithButtonRole.init()

  // Show and hide toggled content
  // Where .multiple-choice uses the data-target attribute
  // to toggle hidden content
  var showHideContent = new GOVUK.ShowHideContent()
  showHideContent.init()
})


// check for hash in url and open that tab if its there
var hash = window.location.hash;
if (hash) {
  $('.tabs__link[href="' + hash +'"]').click();
}


$("#clear").click(function () {
  
  $('#clearHandover').css('display','block');
 });

 $(".cancel").click(function () {
  $('#clearHandover').css('display','none');
 });

 $("#reallocate").click(function () {
  
  $('#reallocateHandover').css('display','block');
 });

 $(".cancel").click(function () {
  $('#reallocateHandover').css('display','none');
 });


