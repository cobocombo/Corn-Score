//================================================================================//

// Imports.
import UIKit

//================================================================================//

// Description: Object that will build and return base UIAlertControllers when requested, special to this app.
class BaseAlertControllers
{
    // Description: Method to build and return a first launch tip alert.
    public func firstLaunchTipAlertController() -> UIAlertController
    {
        let alertController = UIAlertController(title: "App Tip 💡", message: "Press above the number to increase a team's score, and press below to decrease a team's score.", preferredStyle: .alert)
        let thxAction = UIAlertAction(title: "Thanks!", style: .default)
        alertController.addAction(thxAction)
        return alertController
    }
    
    // Description: Method to build and return a base report a bug alert controller.
    public func reportABugAlertController() -> UIAlertController
    {
        let alertController = UIAlertController(title: "Report A Bug 🐞", message: "Send additional info to coltonboyd503@icloud.com", preferredStyle: .alert)
        alertController.addTextField
        { textField in
            textField.placeholder = "Bug title..."
        }
        alertController.addTextField
        { textField in
            textField.placeholder = "Short description of bug..."
        }
        alertController.addTextField
        { textField in
            textField.placeholder = "Email..."
            textField.keyboardType = .emailAddress
            textField.autocapitalizationType = .none
            textField.autocorrectionType = .no
        }
        let cancelAction = UIAlertAction(title: "Cancel", style: .cancel)
        alertController.addAction(cancelAction)
        return alertController
    }
    
    // Description: Method to build and return a base request a feature alert controller.
    public func requestAFeatureAlertController() -> UIAlertController
    {
        let alertController = UIAlertController(title: "Request A Feature 📢", message: "Send additional info to coltonboyd503@icloud.com", preferredStyle: .alert)
        alertController.addTextField
        { textField in
            textField.placeholder = "Feature title..."
        }
        alertController.addTextField
        { textField in
            textField.placeholder = "Short description of feature..."
        }
        alertController.addTextField
        { textField in
            textField.placeholder = "Email..."
            textField.keyboardType = .emailAddress
            textField.autocapitalizationType = .none
            textField.autocorrectionType = .no
        }
        let cancelAction = UIAlertAction(title: "Cancel", style: .cancel)
        alertController.addAction(cancelAction)
        return alertController
    }
}

//================================================================================//
