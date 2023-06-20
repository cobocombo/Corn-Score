//================================================================================//

// Imports.
import Foundation

//================================================================================//

// Description: Singleton object with functions to validate various scenarios of user input for
// textfields / forms.
class InputValidator
{
    static let shared = InputValidator()
    
    // Private constructor to prevent multiple instances.
    private init() {}
    
    // Description: Method to check if a string contains only empty characters or not.
    public func isStringEmpty(text: String) -> Bool
    {
        let trimmedText = text.trimmingCharacters(in: .whitespacesAndNewlines)
        return !trimmedText.isEmpty
    }
    
    // Description: Method to check if an email string is valid or not.
    public func isEmailStringValid(email: String) -> Bool
    {
        let emailRegex = "[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}"
        let emailPredicate = NSPredicate(format: "SELF MATCHES %@", emailRegex)
        return emailPredicate.evaluate(with: email)
    }
}

//================================================================================//
