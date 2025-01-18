//////////////////////// GLOBAL ///////////////////////////

const APP_VERSION = '1.5';
const PLATFORMS = 
{
  iOS: "iOS",
  Web: "Web"
}
const STORAGE_KEYS = 
{
  hasUserVisitedBefore: "hasUserVisitedBefore",
  team1Name: "team1Name",
  team2Name: "team2Name",
  team1Color: "team1Color",
  team2Color: "team2Color", 
  textColor: "textColor",
  textSize: "textSize"
}
const TEXT_SIZES = 
{
  small: 
  {
    label: "Small",
    teamName: "1.5em",
    teamScore: "6em" 
  },
  medium: 
  {
    label: "Medium",
    teamName: "2.0em",
    teamScore: "8em"
  },
  large: 
  {
    label: "Large",
    teamName: "2.50em",
    teamScore: "10em"
  }
};

/**
 * Adds an event listener to handle the initialization of the app.
 * Checks if the user has visited the app before and applies the necessary updates:
 * 
 * - If the user has visited before:
 *   - Updates team names, colors, text color, and text size based on stored preferences.
 * 
 * - If the user is new:
 *   - Sets default values and displays a tip about score management.
 * 
 * Regardless of the user's visit history, updates the settings components.
 * 
 * @listens Document#init - Triggered when the app initializes.
 */
document.addEventListener('init', function()
{
  if(localStorage.getItem(STORAGE_KEYS.hasUserVisitedBefore))
  {
    updateTeamNames();
    updateTeamColors();
    updateTextColor();
    updateTextSize();
  }
  else
  {
    setDefaults();
    ons.notification.alert(
    {
      title: 'App Tip',
      message: 'Press above the number to increase the score and below to decrease',
    });
  }
  updateSettingsComponents();
});

/////////////////////// FUNCTIONS /////////////////////////

/**
 * Sets up and updates UI components for customization settings.
 * The function listens for changes in the input fields (team names, team colors, text color, and text size) 
 * and stores the updated values in localStorage. It also updates the UI to reflect the stored settings.
 * 
 * - Sets up input listeners for team names, team colors, text color, and text size.
 * - Stores updated values in localStorage.
 * - Initializes the input fields with values from localStorage if available.
 * 
 * @fires localStorage - Stores team names, team colors, text color, and text size preferences.
 */
function updateSettingsComponents()
{
  let team1NameInput = document.getElementById('team-1-name-input');
  let team2NameInput = document.getElementById('team-2-name-input');
  let team1ColorInput = document.getElementById('team-1-color-picker');
  let team2ColorInput = document.getElementById('team-2-color-picker');
  let textColorInput = document.getElementById('text-color-picker');
  let textSizeSelector = document.getElementById('text-size-select');
  
  team1NameInput.addEventListener('input', function() 
  {
    localStorage.setItem(STORAGE_KEYS.team1Name, team1NameInput.value);
    updateTeamNames();
  });
  team2NameInput.addEventListener('input', function() 
  {
    localStorage.setItem(STORAGE_KEYS.team2Name, team2NameInput.value);
    updateTeamNames();
  });
  team1ColorInput.addEventListener('input', function()
  {
    localStorage.setItem(STORAGE_KEYS.team1Color, team1ColorInput.value);
    updateTeamColors();
  });
  team2ColorInput.addEventListener('input', function()
  {
    localStorage.setItem(STORAGE_KEYS.team2Color, team2ColorInput.value);
    updateTeamColors();
  });
  textColorInput.addEventListener('input', function()
  {
    localStorage.setItem(STORAGE_KEYS.textColor, textColorInput.value);
    updateTextColor();
  });
  textSizeSelector.addEventListener('change', function() 
  {
    localStorage.setItem(STORAGE_KEYS.textSize, textSizeSelector.value);
    updateTextSize();
  });

  if(localStorage.getItem(STORAGE_KEYS.team1Name) != null && localStorage.getItem(STORAGE_KEYS.team2Name) != null)
  {
    team1NameInput.value = localStorage.getItem(STORAGE_KEYS.team1Name);
    team2NameInput.value = localStorage.getItem(STORAGE_KEYS.team2Name);
  }

  if(localStorage.getItem(STORAGE_KEYS.team1Color) != null && localStorage.getItem(STORAGE_KEYS.team2Color) != null)
  {
    team1ColorInput.value = localStorage.getItem(STORAGE_KEYS.team1Color);
    team2ColorInput.value = localStorage.getItem(STORAGE_KEYS.team2Color);
  }

  if(localStorage.getItem(STORAGE_KEYS.textColor) != null)
  {
    textColorInput.value = localStorage.getItem(STORAGE_KEYS.textColor);
  }

  if(localStorage.getItem(STORAGE_KEYS.textSize) != null)
  {
    const optionIndex = Array.from(textSizeSelector.options).findIndex(function(option) 
    {
      return option.value === localStorage.getItem(STORAGE_KEYS.textSize);
    });
    textSizeSelector.selectedIndex = optionIndex;
  }

  const versionDiv = document.getElementById("settings-app-version-list-item");
  versionDiv.textContent = `Version: ${APP_VERSION}`;
}

/**
 * Sets the default settings for the app.
 * This function stores default values for team names, team colors, text color, text size, 
 * and a flag indicating whether the user has visited the app before in localStorage.
 * 
 * - Sets default values for team 1 and team 2 names, colors, text color, and text size.
 * - Marks the user as having visited the app before.
 * 
 * @fires localStorage - Stores default settings in localStorage.
 */
function setDefaults()
{
  localStorage.setItem(STORAGE_KEYS.hasUserVisitedBefore, 'true');
  localStorage.setItem(STORAGE_KEYS.team1Name, 'Team 1');
  localStorage.setItem(STORAGE_KEYS.team2Name, 'Team 2');
  localStorage.setItem(STORAGE_KEYS.team1Color, '#FF0000');
  localStorage.setItem(STORAGE_KEYS.team2Color, '#0000FF');
  localStorage.setItem(STORAGE_KEYS.textColor, '#FFFFFF');
  localStorage.setItem(STORAGE_KEYS.textSize, TEXT_SIZES.small.label);
}

/**
 * Updates the team name text for each team side based on the values stored in localStorage.
 * This method retrieves the team names from localStorage and updates the respective HTML elements 
 * displaying the team names on the page.
 * 
 * - Updates the team name elements for Team 1 and Team 2 with values from localStorage.
 * 
 * @fires localStorage - Retrieves team names from localStorage.
 */
function updateTeamNames()
{
  if(localStorage.getItem(STORAGE_KEYS.team1Name) != null && localStorage.getItem(STORAGE_KEYS.team2Name) != null)
  {
    document.getElementById('team-1-name').textContent = localStorage.getItem(STORAGE_KEYS.team1Name);
    document.getElementById('team-2-name').textContent = localStorage.getItem(STORAGE_KEYS.team2Name);
  }
}

/**
 * Updates the team color for each team side based on the values stored in localStorage.
 * This method retrieves the team colors from localStorage and updates the background color 
 * of the respective team sides on the page.
 * 
 * - Updates the background color of Team 1 and Team 2 elements with values from localStorage.
 * 
 * @fires localStorage - Retrieves team colors from localStorage.
 */
function updateTeamColors()
{
  if(localStorage.getItem(STORAGE_KEYS.team1Color) != null && localStorage.getItem(STORAGE_KEYS.team2Color) != null)
  {
    document.getElementById('team-1-side').style.backgroundColor = localStorage.getItem(STORAGE_KEYS.team1Color);
    document.getElementById('team-2-side').style.backgroundColor = localStorage.getItem(STORAGE_KEYS.team2Color);
  }
}

/**
 * Updates the text color for the team names and scores based on the value stored in localStorage.
 * This method retrieves the text color from localStorage and applies it to the team name and score 
 * elements for both teams on the page.
 * 
 * - Updates the text color of the team names and scores for Team 1 and Team 2 with the color from localStorage.
 * 
 * @fires localStorage - Retrieves the text color from localStorage.
 */
function updateTextColor()
{
  if(localStorage.getItem(STORAGE_KEYS.textColor) != null)
  {
    document.getElementById('team-1-name').style.color = localStorage.getItem(STORAGE_KEYS.textColor);
    document.getElementById('team-2-name').style.color = localStorage.getItem(STORAGE_KEYS.textColor);
    document.getElementById('team-1-score').style.color = localStorage.getItem(STORAGE_KEYS.textColor);
    document.getElementById('team-2-score').style.color = localStorage.getItem(STORAGE_KEYS.textColor);
  }
}

/**
 * Updates the text size for the team names and scores based on the value stored in localStorage.
 * This method retrieves the text size setting from localStorage and applies it to the team name and score 
 * elements for both teams on the page.
 * 
 * - Adjusts the font size of the team names and scores based on the selected text size setting.
 * - Supports small, medium, and large text sizes.
 * 
 * @fires localStorage - Retrieves the text size from localStorage.
 * @fires TEXT_SIZES - Predefined text size values.
 */
function updateTextSize()
{
  if(localStorage.getItem(STORAGE_KEYS.textSize) != null)
  {
    switch(localStorage.getItem(STORAGE_KEYS.textSize)) 
    {
      case TEXT_SIZES.medium.label:
        document.getElementById('team-1-name').style.fontSize = TEXT_SIZES.medium.teamName;
        document.getElementById('team-2-name').style.fontSize = TEXT_SIZES.medium.teamName;
        document.getElementById('team-1-score').style.fontSize = TEXT_SIZES.medium.teamScore;
        document.getElementById('team-2-score').style.fontSize = TEXT_SIZES.medium.teamScore;
        break;
      case TEXT_SIZES.large.label:
        document.getElementById('team-1-name').style.fontSize = TEXT_SIZES.large.teamName;
        document.getElementById('team-2-name').style.fontSize = TEXT_SIZES.large.teamName;
        document.getElementById('team-1-score').style.fontSize = TEXT_SIZES.large.teamScore;
        document.getElementById('team-2-score').style.fontSize = TEXT_SIZES.large.teamScore;
        break;
      default:
        document.getElementById('team-1-name').style.fontSize = TEXT_SIZES.small.teamName;
        document.getElementById('team-2-name').style.fontSize = TEXT_SIZES.small.teamName;
        document.getElementById('team-1-score').style.fontSize = TEXT_SIZES.small.teamScore;
        document.getElementById('team-2-score').style.fontSize = TEXT_SIZES.small.teamScore;
    }
  }
}

/**
 * Handles the event when the user taps the "Reset To Default" list item.
 * Displays a confirmation dialog, and if the user confirms, resets all customization settings to their default values.
 * 
 * - Resets the team names, team colors, text color, and text size to default values.
 * - Calls the `setDefaults()` function to set the default values in localStorage.
 * - Updates the UI components to reflect the default settings.
 * 
 * @fires ons.notification.alert - Displays an alert for confirming the reset action.
 * @fires setDefaults - Resets the settings to default values.
 * @fires updateTeamNames - Updates the team names UI to reflect the new settings.
 * @fires updateTeamColors - Updates the team colors UI to reflect the new settings.
 * @fires updateTextColor - Updates the text color UI to reflect the new settings.
 * @fires updateTextSize - Updates the text size UI to reflect the new settings.
 * @fires updateSettingsComponents - Updates the settings UI components to reflect the new settings.
 */
function resetToDefaultTapped()
{
  ons.notification.alert(
  {
    title: 'Reset To Default?',
    message: 'All customizations will be lost',
    buttonLabels: ['Cancel', 'Reset'],
    primaryButtonIndex: 1,
    callback: function (index) 
    {
      if(index === 1) 
      {
        setDefaults();
        updateTeamNames();
        updateTeamColors();
        updateTextColor();
        updateTextSize();
        updateSettingsComponents();
      }
    }
  });
}

/**
 * Determines the current platform (iOS or Web) based on the user agent string.
 * 
 * @returns {string} - Returns `PLATFORMS.iOS` if the platform is iOS, `PLATFORMS.Web` otherwise.
 */
function getCurrentPlatform()
{
  if(navigator.userAgent.includes("iPhone") || navigator.userAgent.includes("iPad"))
  {
    return PLATFORMS.iOS;
  }
  else
  {
    return PLATFORMS.Web;
  }
}

///////////////////////////////////////////////////////////