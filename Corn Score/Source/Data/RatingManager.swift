// Imports.
import StoreKit

// Description: Data object to manage when a in app rating prompt should occur.
class RatingManager
{
    private let firstLaunchKey = "IsFirstLaunch"
    private let appVersionStoredKey = "AppVersion"
    private let appLaunchCountKey = "AppNumberLaunchCount"
    
    // Description: Method to return the current app version.
    public func getAppVersion() -> String
    {
        return (Bundle.main.infoDictionary!["CFBundleShortVersionString"] as? String)!
    }
    
    // Description: Method to return the currently stored app version.
    public func getStoredAppVersion() -> String
    {
        return (UserDefaults.standard.string(forKey: self.appVersionStoredKey))!
    }
    
    // Description: Method to increment the app launch count.
    private func incrementAppLaunchCount() 
    {
        let userDefaults = UserDefaults.standard
        let launchCount = userDefaults.integer(forKey: self.appLaunchCountKey)
        userDefaults.set(launchCount + 1, forKey: self.appLaunchCountKey)
    }
    
    // Description: Method to return if the app should display a rating prompt.
    private func shouldDisplayRatingPrompt() -> Bool 
    {
        let userDefaults = UserDefaults.standard
        let launchCount = userDefaults.integer(forKey: self.appLaunchCountKey)
        return launchCount >= 3
    }
    
    // Description: Method to reset the app launch count.
    private func resetAppLaunchCount() 
    {
        let userDefaults = UserDefaults.standard
        userDefaults.set(0, forKey: self.appLaunchCountKey)
    }
    
    
    // Description: Method to call the request review app rating.
    private func requestAppRating() 
    {
        SKStoreReviewController.requestReview()
        self.resetAppLaunchCount()
    }
    
    // Description: Method to check the current app versioning and modify as needed.
    public func checkCurrentAppVersioning()
    {
        let userDefaults = UserDefaults.standard
        if(userDefaults.bool(forKey: self.firstLaunchKey))
        {
            let currentAppVersion = self.getAppVersion()
            let storedAppVersion = self.getStoredAppVersion()
            if (currentAppVersion != storedAppVersion) 
            {
                self.resetAppLaunchCount()
                userDefaults.set(self.getAppVersion(), forKey: self.appVersionStoredKey)
            }
        }
        else
        {
            userDefaults.set(true, forKey: self.firstLaunchKey)
            userDefaults.set(self.getAppVersion(), forKey: self.appVersionStoredKey)
        }
        self.incrementAppLaunchCount()
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



