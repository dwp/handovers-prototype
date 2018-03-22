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

// as JS is working, add 'tabs' class, which will style tabs and allow taken from https://home-office-digital-patterns.herokuapp.com/components/tabs
// functionality
$('.js-tabs').addClass('tabs');

// hide all of the tab content for now
$('.tab-content').hide();
//show the first tab and content
$('.tabs').each(function(){
  $(this).find('.tab-content:first').show();
  $(this).find('ul li:first').addClass('active');
});

// click function for tabs
$('.tabs__link').click(function(e){
  e.preventDefault();

  var tabs = $(this).parents('.tabs');
  var link = $(this);
  var currentTab = link.attr('href');

  // remove active class from nav and add to newly selected tab
  tabs.find('li').removeClass('active');
  link.parent('li').addClass('active');

  // hide all of the tab content and show newly selected then update hash in URL
  tabs.find('.tab-content').hide();
  $(currentTab).show();
  history.pushState({}, '', currentTab);
});

// check for hash in url and open that tab if its there
var hash = window.location.hash;
if (hash) {
  $('.tabs__link[href="' + hash +'"]').click();
}