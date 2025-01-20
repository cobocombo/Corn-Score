//////////////////////// GLOBAL ///////////////////////////

let TEAM_1_SCORE = 0;
let TEAM_2_SCORE = 0;
let TIMER = new easytimer.Timer();
let PROGRAMMED_MINUTES = 0;
let PROGRAMMED_SECONDS = 30;

/**
 * Initializes the timer by updating the timer text when the 'init' event is fired.
 * 
 * This event listener triggers the updateTimerText function with the 'start' event to display the initial timer state.
 */
document.addEventListener('init', function()
{
  updateTimerText('start');
});

/**
 * Listens for the 'secondsUpdated' event from the TIMER object and updates the timer text.
 * 
 * This event listener triggers the updateTimerText function with the 'update' event whenever the TIMER object
 * updates the seconds, ensuring the timer display is kept in sync.
 */
TIMER.addEventListener('secondsUpdated', function(e) 
{
  updateTimerText('update');
});

/**
 * Listens for the 'targetAchieved' event from the TIMER object and triggers a toast notification.
 * 
 * This event listener is activated when the timer reaches its target. It shows a toast notification
 * with the message "Times Up!" and updates the timer text to indicate the timer has ended.
 */
TIMER.addEventListener('targetAchieved', function(e) 
{
  ons.notification.toast('Times Up!', { timeout: 2500, animation: 'ascend' });
  updateTimerText('ended');
});

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

/**
 * Updates the timer display text based on the specified event.
 *
 * @param {string} event - The event triggering the update. Valid values are:
 *   - `'update'`: Updates the timer text to the current values from `TIMER`.
 *   - `'start'` or `'ended'`: Resets the timer text to the programmed values.
 *   - `'change'`: Updates the programmed timer values from the slider inputs,
 *     updates the timer display, hides the timer edit dialog, and stops the timer.
 */
function updateTimerText(event)
{
  const mainTimerFabButton =  document.getElementById('main-timer-fab-button');
  if(event == 'update')
  {
    mainTimerFabButton.textContent = TIMER.getTimeValues().toString(["minutes", "seconds"]);
  }
  else if(event == 'start' || event == 'ended')
  {
    mainTimerFabButton.textContent = `${String(PROGRAMMED_MINUTES).padStart(2, '0')}:${String(PROGRAMMED_SECONDS).padStart(2, '0')}`;
  }
  else if(event == 'change')
  {
    const minutesValue = document.getElementById('minutes-value').textContent;
    const secondsValue = document.getElementById('seconds-value').textContent;
    PROGRAMMED_MINUTES = Number(minutesValue);
    PROGRAMMED_SECONDS = Number(secondsValue);
    mainTimerFabButton.textContent = `${String(PROGRAMMED_MINUTES).padStart(2, '0')}:${String(PROGRAMMED_SECONDS).padStart(2, '0')}`;
    hideDialog('timer-edit-dialog');
    timerStop();
  }
}

/**
 * Handles the event when the timer play button is tapped.
 * 
 * Starts the timer in countdown mode using the programmed 
 * minutes and seconds as the starting values.
 */
function timerPlayButtonTapped()
{
  TIMER.start({countdown: true, startValues: { minutes: PROGRAMMED_MINUTES, seconds: PROGRAMMED_SECONDS}});
}

/**
 * Handles the event when the timer pause button is tapped.
 * 
 * Pauses the currently running timer.
 */
function timerPauseButtonTapped()
{
  TIMER.pause();
}

/**
 * Stops the timer and resets its state.
 * 
 * Stops the currently running timer and clears any active countdown.
 */
function timerStop()
{
  TIMER.stop();
}

/**
 * Restarts the timer with the programmed minutes and seconds values.
 * 
 * Resets the timer to its initial programmed values and begins a countdown.
 */
function timerRestartButtonTapped()
{
  TIMER.reset({ countdown: true, startValues: { minutes: PROGRAMMED_MINUTES, seconds: PROGRAMMED_SECONDS} });
}

/**
 * Opens the timer edit dialog and initializes its content.
 * 
 * Loads the dialog content from the specified file and triggers initialization for the dialog.
 */
function timerEditButtonTapped()
{
  showDialog('timer-edit-dialog', 'timer-edit-dialog.html', initializeTimerDialog);
}

///////////////////////////////////////////////////////////