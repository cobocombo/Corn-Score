/////////////////////// FUNCTIONS /////////////////////////

/**
 * Initializes the timer edit dialog by setting up event listeners for the minute and second sliders.
 * 
 * This function is responsible for updating the minute and second values dynamically as the user adjusts
 * the sliders in the timer edit dialog. The event listeners update the corresponding value text elements
 * whenever the slider input changes.
 */
function initializeTimerDialog()
{
  const minutesSlider = document.getElementById('minutes-slider');
  const minutesValue = document.getElementById('minutes-value');
  const secondsSlider = document.getElementById('seconds-slider');
  const secondsValue = document.getElementById('seconds-value');
  minutesSlider.addEventListener('input', () => { minutesValue.textContent = minutesSlider.value; });
  secondsSlider.addEventListener('input', () => { secondsValue.textContent = secondsSlider.value; });
}

///////////////////////////////////////////////////////////