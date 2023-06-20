//================================================================================//

// Imports.
import StoreKit

//================================================================================//

// Description: Data object to manage when a in app rating prompt should occur.
class RatingManager
{
    // Description: Method to return if the app should display a rating prompt.
    private func shouldDisplayRatingPrompt() -> Bool 
    {
        let launchCount = AppInfo.shared.getAppLaunchCount()
        return launchCount >= 3
    }
    
    // Description: Method to call the request review app rating.
    private func requestAppRating() 
    {
        if #available(iOS 10.3, *)
        {
            if let scene = UIApplication.shared.connectedScenes.first as? UIWindowScene
            {
                SKStoreReviewController.requestReview(in: scene)
            }
        }
        AppInfo.shared.resetAppLaunchCount()
    }
    
    // Description: Method to check for app rating manually.
    public func checkForAppRating()
    {
        if(self.shouldDisplayRatingPrompt())
        {
            self.requestAppRating()
        }
    }
}

//================================================================================//



