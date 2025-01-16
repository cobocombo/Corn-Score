//////////////////////// GLOBAL ///////////////////////////

const SOURCE_CODE_URL = 'https://github.com/cobocombo/Corn-Score';
const APP_STORE_URL = 'https://itunes.apple.com/app/id6446418989?action=write-review';

/**
 * Adds an event listener to handle the initialization of pages in the app.
 * Executes specific logic based on the `id` of the page being initialized:
 * 
 * - For the 'board' page:
 *   - Sets up the click event for the settings button to navigate to the 'settings.html' page.
 * 
 * - For the 'settings' page:
 *   - Sets up click events for list items to navigate to the 'whats-new.html' and 'privacy-policy.html' pages.
 * 
 * @listens Document#init - Triggered when a new page is initialized in the app.
 * @param {Event} event - The event object containing details about the initialized page.
 */
document.addEventListener('init', function(event) 
{
    var page = event.target;
    if(page.id === 'board') 
    {
      page.querySelector('#settings-button').onclick = function() 
      {
        document.querySelector('#navigator').pushPage('settings.html');
      };
    } 
    else if(page.id === 'settings')
    {
      page.querySelector('#whats-new-list-item').onclick = function()
      {
        document.querySelector('#navigator').pushPage('whats-new.html');
      };
      page.querySelector('#privacy-policy-list-item').onclick = function()
      {
        document.querySelector('#navigator').pushPage('privacy-policy.html');
      };
    }
});

/////////////////////// FUNCTIONS /////////////////////////

/**
 * Pops the current page from the navigation stack, returning to the previous page.
 * Typically used to navigate back in the app's page hierarchy.
 */
function popPage()
{
  document.querySelector('#navigator').popPage();
}

/**
 * Displays a modal dialog by its ID.
 * This function is used to show modals, such as popups or overlays, in the app.
 * 
 * @param {string} id - The ID of the modal element to be displayed.
 */
function showModal(id) 
{
  document.getElementById(id).show();
}

/**
 * Hides a modal dialog by its ID.
 * This function is used to close modals, such as popups or overlays, in the app.
 * 
 * @param {string} id - The ID of the modal element to be hidden.
 */
function hideModal(id) 
{
  document.getElementById(id).hide();
}

/**
 * Handles the event when the user taps the "Source Code" list item.
 * Opens the source code URL in a new window or using the Safari View Controller, depending on the platform.
 * 
 * - For WKWebView (iOS), opens the source code URL using the Safari View Controller.
 * - For other platforms, opens the source code URL in a new browser tab.
 * 
 * @fires window.open - Opens the source code URL in a new tab for non-WKWebView platforms.
 * @fires window.webkit.messageHandlers.openSafariViewController.postMessage - Opens the source code URL in Safari View Controller for WKWebView on iOS.
 */
function sourceCodeTapped()
{
  if(ons.platform.isWKWebView())
  {
    window.webkit.messageHandlers.openSafariViewController.postMessage(SOURCE_CODE_URL);
  }
  else
  {
    window.open(SOURCE_CODE_URL, '_blank');
  }
}

/**
 * Handles the event when the user taps the "Rate Corn Score" list item.
 * Directs the user to the appropriate store listing based on the platform.
 * 
 * - For WKWebView (iOS), opens the rate app URL using the appropriate native handler.
 * - For other platforms, opens the rate app URL in a new browser tab.
 * 
 * @fires window.open - Opens the store listing in a new tab for non-WKWebView platforms.
 * @fires window.webkit.messageHandlers.rateApp.postMessage - Opens the store listing for rating the app using native handler for WKWebView on iOS.
 */
function rateCornScoreTapped()
{
  if(ons.platform.isWKWebView())
  {
    window.webkit.messageHandlers.rateApp.postMessage(APP_STORE_URL);
  }
  else
  {
    window.open(APP_STORE_URL, '_blank');
  }
}

///////////////////////////////////////////////////////////