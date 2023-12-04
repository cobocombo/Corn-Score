///////////////////////////////////////////////////////////////////

// Setup.
document.addEventListener('init', function()
{
    updateSettingsComponents();
});

///////////////////////////////////////////////////////////////////

// Function to set and update the UI components used to change customization settings.
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
        localStorage.setItem(StorageKeys.team1Name, team1NameInput.value);
        updateTeamNames();
    });
    team2NameInput.addEventListener('input', function() 
    {
        localStorage.setItem(StorageKeys.team2Name, team2NameInput.value);
        updateTeamNames();
    });
    team1ColorInput.addEventListener('input', function()
    {
        localStorage.setItem(StorageKeys.team1Color, team1ColorInput.value);
        updateTeamColors();
    });
    team2ColorInput.addEventListener('input', function()
    {
        localStorage.setItem(StorageKeys.team2Color, team2ColorInput.value);
        updateTeamColors();
    });
    textColorInput.addEventListener('input', function()
    {
        localStorage.setItem(StorageKeys.textColor, textColorInput.value);
        updateTextColor();
    });
    textSizeSelector.addEventListener('change', function() 
    {
        localStorage.setItem(StorageKeys.textSize, textSizeSelector.value);
        updateTextSize();
    });

    if(localStorage.getItem(StorageKeys.team1Name) != null && localStorage.getItem(StorageKeys.team2Name) != null)
    {
        team1NameInput.value = localStorage.getItem(StorageKeys.team1Name);
        team2NameInput.value = localStorage.getItem(StorageKeys.team2Name);
    }

    if(localStorage.getItem(StorageKeys.team1Color) != null && localStorage.getItem(StorageKeys.team2Color) != null)
    {
        team1ColorInput.value = localStorage.getItem(StorageKeys.team1Color);
        team2ColorInput.value = localStorage.getItem(StorageKeys.team2Color);
    }

    if(localStorage.getItem(StorageKeys.textColor) != null)
    {
        textColorInput.value = localStorage.getItem(StorageKeys.textColor);
    }

    if(localStorage.getItem(StorageKeys.textSize) != null)
    {
        let optionIndex = Array.from(textSizeSelector.options).findIndex(function(option) 
        {
            return option.value === localStorage.getItem(StorageKeys.textSize);
        });
        textSizeSelector.selectedIndex = optionIndex;
    }
}

///////////////////////////////////////////////////////////////////

// Function to set default settings. 
function setDefaults()
{
    localStorage.setItem(StorageKeys.hasUserVisitedBefore, 'true');
    localStorage.setItem(StorageKeys.team1Name, 'Team 1');
    localStorage.setItem(StorageKeys.team2Name, 'Team 2');
    localStorage.setItem(StorageKeys.team1Color, '#FF0000');
    localStorage.setItem(StorageKeys.team2Color, '#0000FF');
    localStorage.setItem(StorageKeys.textColor, '#FFFFFF');
    localStorage.setItem(StorageKeys.textSize, TextSizes.small);
}

///////////////////////////////////////////////////////////////////

// Function called when the user taps the save button on the settings page. 
// It removes the settings page from the stack.
function popPage()
{
    document.querySelector('#navigator').popPage();
}

///////////////////////////////////////////////////////////////////

// Method to update the team name text for each team side as the names are being saved in localStorage.
function updateTeamNames()
{
    if(localStorage.getItem(StorageKeys.team1Name) != null && localStorage.getItem(StorageKeys.team2Name) != null)
    {
        document.getElementById('team-1-name').textContent = localStorage.getItem(StorageKeys.team1Name);
        document.getElementById('team-2-name').textContent = localStorage.getItem(StorageKeys.team2Name);
    }
}

///////////////////////////////////////////////////////////////////

// Method to update the team color for each team side as the colors are being saved in localStorage.
function updateTeamColors()
{
    if(localStorage.getItem(StorageKeys.team1Color) != null && localStorage.getItem(StorageKeys.team2Color) != null)
    {
        document.getElementById('team-1-side').style.backgroundColor = localStorage.getItem(StorageKeys.team1Color);
        document.getElementById('team-2-side').style.backgroundColor = localStorage.getItem(StorageKeys.team2Color);
    }
}

///////////////////////////////////////////////////////////////////

// Method to update the text color for the board as it is being saved in localStorage.
function updateTextColor()
{
    if(localStorage.getItem(StorageKeys.textColor) != null)
    {
        document.getElementById('team-1-name').style.color = localStorage.getItem(StorageKeys.textColor);
        document.getElementById('team-2-name').style.color = localStorage.getItem(StorageKeys.textColor);
        document.getElementById('team-1-score').style.color = localStorage.getItem(StorageKeys.textColor);
        document.getElementById('team-2-score').style.color = localStorage.getItem(StorageKeys.textColor);
    }
}
///////////////////////////////////////////////////////////////////

// Method to update the text size for the board as it is being saved in localStorage.
function updateTextSize()
{
    if(localStorage.getItem(StorageKeys.textSize) != null)
    {
        switch(localStorage.getItem(StorageKeys.textSize)) 
        {
            case TextSizes.medium:
                document.getElementById('team-1-name').style.fontSize = '2.25em';
                document.getElementById('team-2-name').style.fontSize = '2.25em';
                document.getElementById('team-1-score').style.fontSize = '8em';
                document.getElementById('team-2-score').style.fontSize = '8em';
                break;
            case TextSizes.large:
                document.getElementById('team-1-name').style.fontSize = '3em';
                document.getElementById('team-2-name').style.fontSize = '3em';
                document.getElementById('team-1-score').style.fontSize = '12em';
                document.getElementById('team-2-score').style.fontSize = '12em';
                break;
            default:
                document.getElementById('team-1-name').style.fontSize = '1.5em';
                document.getElementById('team-2-name').style.fontSize = '1.5em';
                document.getElementById('team-1-score').style.fontSize = '6em';
                document.getElementById('team-2-score').style.fontSize = '6em';
        }
    }
}

///////////////////////////////////////////////////////////////////

// Function called when the user taps the source code list item. Its opens the source code link based on platform.
function sourceCodeTapped()
{
    let url = 'https://github.com/cobocombo/Corn-Score';
    if(ons.platform.isWKWebView())
    {
        window.webkit.messageHandlers.openSafariViewController.postMessage(url);
    }
    else if(ons.platform.isAndroid())
    {
        const isWebView = /(wv|i)\b/.test(navigator.userAgent);
        if (isWebView) 
        {
            androidMessageHandler.openInCustomTabs(url);
        } 
        else
        {
            window.open(url, '_blank');
        }
    }
    else
    {
        window.open(url, '_blank');
    }
}

///////////////////////////////////////////////////////////////////

// Function called when the user taps an element that is intended to trigger a modal page.
function showModal(id) 
{
    document.getElementById(id).show();
}

/////////////////////////////////////////////////////////////////// 

// Function called when the user taps an element that is intended to remove a modal page.
function hideModal(id) 
{
    document.getElementById(id).hide();
}

///////////////////////////////////////////////////////////////////

// Function called when the user presses the send button on the report a bug modal. 
// Creates a bug github issue on the repository.
function submitBugReport()
{
    let title = document.getElementById("report-a-bug-title").value;
    let description = document.getElementById("report-a-bug-description").value;
    let email = document.getElementById("report-a-bug-email").value;

    if(isStringEmpty(title))
    {
        ons.notification.alert(
        {
            title: 'Invalid input',
            message: 'Title cannot be empty'
        });
        return;
    }
    if(isStringEmpty(description))
    {
        ons.notification.alert(
        {
            title: 'Invalid input',
            message: 'Description cannot be empty'
        });
        return;
    }
    if(!isValidEmail(email))
    {
        ons.notification.alert(
        {
            title: 'Invalid input',
            message: 'Email must be in the correct form'
        });
        return;
    }

    const submitReportABugRequest = async () => 
    {
        showModal('loading-modal');
        let body = 
        `BUG REPORT:
        - App Version: ${appVersion}
        - Operating System: ${getCurrentPlatform()}
        - Description: ${description} 
        ` 
        try 
        {
            await createIssue(title, body, "bug");
            hideModal('report-a-bug-modal');
            hideModal('loading-modal');
            document.getElementById("report-a-bug-title").value = "";
            document.getElementById("report-a-bug-description").value = "";
            document.getElementById("report-a-bug-email").value = "";
            setTimeout(() => 
            {
                ons.notification.alert(
                {
                    title: 'Success!',
                    message: 'Bug report sent'
                });
            }, "1000"); 
        } 
        catch (error) 
        {
            hideModal('loading-modal');
            setTimeout(() => 
            {
                console.log("FAIL!!")
                ons.notification.alert(
                {
                    title: 'Failure!',
                    message: 'There was an error sending the bug report'
                });
            }, "1000");
        }
    };

    submitReportABugRequest();
}   

///////////////////////////////////////////////////////////////////

// Function called to send a new feature request to the github project.
function submitNewFeatureRequest()
{
    let title = document.getElementById("request-a-feature-title").value;
    let description = document.getElementById("request-a-feature-description").value;
    let email = document.getElementById("request-a-feature-email").value;

    if(isStringEmpty(title))
    {
        ons.notification.alert(
        {
            title: 'Invalid input',
            message: 'Title cannot be empty'
        });
        return;
    }
    if(isStringEmpty(description))
    {
        ons.notification.alert(
        {
            title: 'Invalid input',
            message: 'Description cannot be empty'
        });
        return;
    }
    if(!isValidEmail(email))
    {
        ons.notification.alert(
        {
            title: 'Invalid input',
            message: 'Email must be in the correct form'
        });
        return;
    }

    const submitNewFeatureRequest = async () => 
    {
        showModal('loading-modal');
        let body = 
        `NEW FEATURE REQUEST::
        - App Version: ${appVersion}
        - Operating System: ${getCurrentPlatform()}
        - Description: ${description} 
        ` 
        try 
        {
            await createIssue(title, body, "enhancement");
            hideModal('request-a-feature-modal');
            hideModal('loading-modal');
            document.getElementById("request-a-feature-title").value = "";
            document.getElementById("request-a-feature-description").value = "";
            document.getElementById("request-a-feature-email").value = "";
            setTimeout(() => 
            {
                ons.notification.alert(
                {
                    title: 'Success!',
                    message: 'New feature request sent'
                });
            }, "1000"); 
        } 
        catch (error) 
        {
            hideModal('loading-modal');
            setTimeout(() => 
            {
                ons.notification.alert(
                {
                    title: 'Failure!',
                    message: 'There was an error sending the new feature request'
                });
            }, "1000");
        }
    };

    submitNewFeatureRequest();
}

///////////////////////////////////////////////////////////////////

// Function called when the user taps the Reset To Default list item.
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
          if (index === 1) 
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

///////////////////////////////////////////////////////////////////

// Function called when the user taps the rate corn score list item. Directs the user to the appropriate store listing.
function rateCornScoreTapped()
{
    let appStoreUrl = "https://itunes.apple.com/app/id6446418989?action=write-review";
    let googlePlayUrl = 'https://play.google.com/store/apps/details?id=com.cobo.cornscore';

    if(ons.platform.isWKWebView())
    {
        window.webkit.messageHandlers.rateApp.postMessage(appStoreUrl);
    }
    else if(ons.platform.isAndroid())
    {
        const isWebView = /(wv|i)\b/.test(navigator.userAgent);
        if (isWebView) 
        {
            androidMessageHandler.openInCustomTabs(googlePlayUrl);
        } 
    }
}

///////////////////////////////////////////////////////////////////