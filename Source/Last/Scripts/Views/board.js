///////////////////////////////////////////////////////////////////

let team1Score = 0;
let team2Score = 0;

///////////////////////////////////////////////////////////////////

// Setup.
document.addEventListener('init', function(event) 
{
    // Navigation.
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
    

    // Check if the user has visited before.
    if(localStorage.getItem(StorageKeys.hasUserVisitedBefore))
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
});

///////////////////////////////////////////////////////////////////

// Function to change the score labels of team 1 & team 2.
function changeScore(team, event) 
{
    let scoreElement = document.getElementById(`${team}-score`);
    let rect = scoreElement.getBoundingClientRect();
    let clickY = event.clientY - rect.top;

    if (clickY < rect.height / 2) 
    {
        if (team === 'team-1') 
        {
            team1Score++;
            if(team1Score == 21)
            {
                teamWins(team);
            }
        } 
        else if (team === 'team-2') 
        {
            team2Score++;
            if(team2Score == 21)
            {
                teamWins(team);
            }
        }
    } 
    else 
    {
        if (team === 'team-1' && team1Score > 0) 
        {
            team1Score--;
        } 
        else if (team === 'team-2' && team2Score > 0) 
        {
            team2Score--;
        }
    }
    updateScores();
}

///////////////////////////////////////////////////////////////////

// Function called when a team hits 21 points. A game over alert in shown with the winning team.
function teamWins(team)
{
    confetti.start();
    let winningTeam = document.getElementById(`${team}-name`).textContent;
    ons.notification.alert(
    {
        title: 'Game Over!',
        message: `${winningTeam} wins!`,
        callback: function() 
        {
            restartGame();
            confetti.stop();
        }
    });
}

///////////////////////////////////////////////////////////////////

// Function to restart the team score labels.
function restartGame()
{
    team1Score = 0;
    team2Score = 0;
    updateScores();
}

///////////////////////////////////////////////////////////////////

// Function to update the score label text for each team.
function updateScores()
{
    document.getElementById('team-1-score').innerText = team1Score;
    document.getElementById('team-2-score').innerText = team2Score;
}

///////////////////////////////////////////////////////////////////

// Function called when the user taps the restart button. 
// If one of the scores is non-zero a restart confirmation is shown.
function restartButtonTapped() 
{
    if (team1Score > 0 || team2Score > 0) 
    {
      ons.notification.confirm
      ({
        message: 'All score data will be lost',
        title: 'Restart Game?',
        buttonLabels: ['Cancel', 'Restart'],
        primaryButtonIndex: 1,
        modifier: 'destructive',
        callback: function (index) 
        {
          if (index === 1) 
          {
            restartGame();
          }
        }
      });
    }
}
///////////////////////////////////////////////////////////////////