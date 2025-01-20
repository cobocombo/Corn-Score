//////////////////////// GLOBAL ///////////////////////////

/**
 * Updates the text content of the "whats-new-app-version-header" element
 * to display the current application version when the page is initialized.
 * 
 * This function listens for the 'init' event on the `document` and modifies
 * the specified DOM element to show the app version dynamically.
 * 
 * @listens Document#init - The event triggered when the page is initialized.
 * @global
 */
document.addEventListener('init', function()
{
  const versionDiv = document.getElementById("whats-new-app-version-header");
  versionDiv.textContent = `Version: ${APP_VERSION}`;
});

///////////////////////////////////////////////////////////