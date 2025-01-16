/////////////////////// FUNCTIONS /////////////////////////

/**
 * Checks if the provided string is empty after trimming any leading or trailing whitespace.
 * 
 * @param {string} string - The string to check.
 * @returns {boolean} - Returns `true` if the string is empty, `false` otherwise.
 */
function isStringEmpty(string)
{
  return string.trim() === '';
}

/**
 * Validates the format of an email address using regular expressions.
 * 
 * @param {string} email - The email address to validate.
 * @returns {boolean} - Returns `true` if the email format is valid, `false` otherwise.
 */
function isValidEmail(email) 
{
    let emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
}

///////////////////////////////////////////////////////////