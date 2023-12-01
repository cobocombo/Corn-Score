///////////////////////////////////////////////////////////////////

// Function called to verify if an inputted string is empty or not.
function isStringEmpty(string)
{
    return string.trim() === '';
}

///////////////////////////////////////////////////////////////////

// Function called to verify email format using regex.
function isValidEmail(email) 
{
    let emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
}

///////////////////////////////////////////////////////////////////