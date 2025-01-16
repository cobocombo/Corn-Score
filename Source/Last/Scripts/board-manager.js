//////////////////////// GLOBAL ///////////////////////////

let TEAM_1_SCORE = 0;
let TEAM_2_SCORE = 0;

/////////////////////// FUNCTIONS /////////////////////////

/**
 * Updates the score for a given team based on a click event.
 * Increments or decrements the team's score depending on where the element was clicked.
 * If the score reaches 21, the team is declared the winner.
 * 
 * @param {string} team - The ID of the team whose score is being updated (e.g., 'team-1' or 'team-2').
 * @param {MouseEvent} event - The mouse event triggered by the click on the score element.
 */
function changeScore(team, event) 
{
  const scoreElement = document.getElementById(`${team}-score`);
  const rect = scoreElement.getBoundingClientRect();
  const clickY = event.clientY - rect.top;

  if(clickY < rect.height / 2) 
  {
    if(team === 'team-1') 
    {
      TEAM_1_SCORE++;
      if(TEAM_1_SCORE == 21)
      {
        teamWins(team);
      }
    } 
    else if(team === 'team-2') 
    {
      TEAM_2_SCORE++;
      if(TEAM_2_SCORE == 21)
      {
        teamWins(team);
      }
    }
  } 
  else 
  {
    if(team === 'team-1' && TEAM_1_SCORE > 0) 
    {
      TEAM_1_SCORE--;
    } 
    else if(team === 'team-2' && TEAM_2_SCORE > 0) 
    {
      TEAM_2_SCORE--;
    }
  }
  updateScores();
}

/**
 * Handles the event when a team reaches 21 points, signaling the end of the game.
 * Displays a game-over alert showing the winning team's name and triggers confetti animation.
 * Once the alert is acknowledged, the game is restarted, and the confetti stops.
 * 
 * @param {string} team - The ID of the winning team (e.g., 'team-1' or 'team-2').
 */
function teamWins(team)
{
  confetti.start();
  const winningTeam = document.getElementById(`${team}-name`).textContent;
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

/**
 * Resets the team scores to zero and updates the score display.
 * This function is typically called to restart the game after a team wins.
 */
function restartGame()
{
    TEAM_1_SCORE = 0;
    TEAM_2_SCORE = 0;
    updateScores();
}

/**
 * Updates the score labels for both teams on the user interface.
 * Reflects the current values of TEAM_1_SCORE and TEAM_2_SCORE.
 */
function updateScores()
{
    document.getElementById('team-1-score').innerText = TEAM_1_SCORE;
    document.getElementById('team-2-score').innerText = TEAM_2_SCORE;
}

/**
 * Handles the event when the user taps the restart button.
 * If either team's score is greater than zero, a confirmation dialog is displayed to warn the user 
 * that all score data will be lost. If the user confirms, the game is restarted.
 */
function restartButtonTapped() 
{
  if(TEAM_1_SCORE > 0 || TEAM_2_SCORE > 0) 
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
        if(index === 1) 
        {
          restartGame();
        }
      }
    });
  }
}

///////////////////////////////////////////////////////////