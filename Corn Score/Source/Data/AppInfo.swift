//================================================================================//

// Imports.
import Foundation

//================================================================================//

// Description: Singleton object to keep track or manage any app info.
class AppInfo
{
    static let shared = AppInfo()
    private let defaults = UserDefaults.standard
    private let firstLaunchKey = "IsAppLaunched"
    private let appVersionStoredKey = "AppVersion"
    private let appLaunchCountKey = "AppNumberLaunchCount"
    
    // Private constructor to prevent multiple instances.
    private init() { }
    
    // Description: Method to get the current app version.
    public func getAppVersion() -> String
    {
        return (Bundle.main.infoDictionary!["CFBundleShortVersionString"] as? String)!
    }
    
    // Description: Method to return the currently stored app version.
    public func getStoredAppVersion() -> String
    {
        return (UserDefaults.standard.string(forKey: self.appVersionStoredKey))!
    }
    
    // Description: Method to get the current app launch count.
    public func getAppLaunchCount() -> Int
    {
        return self.defaults.integer(forKey: self.appLaunchCountKey)
    }
    
    // Description: Method to check the current app versioning and modify as needed.
    public func checkCurrentAppVersioning()
    {
        if(self.isAppLaunched())
        {
            let currentAppVersion = self.getAppVersion()
            let storedAppVersion = self.getStoredAppVersion()
            if (currentAppVersion != storedAppVersion)
            {
                self.resetAppLaunchCount()
                self.defaults.set(self.getAppVersion(), forKey: self.appVersionStoredKey)
            }
        }
        else
        {
            self.defaults.set(true, forKey: self.firstLaunchKey)
            self.defaults.set(self.getAppVersion(), forKey: self.appVersionStoredKey)
        }
        self.incrementAppLaunchCount()
    }
    
    // Description: Method to return if the app has been launched before.
    public func isAppLaunched() -> Bool
    {
        return self.defaults.bool(forKey: self.firstLaunchKey)
    }
    
    // Description: Method to increment the app launch count.
    private func incrementAppLaunchCount()
    {
        let launchCount = self.defaults.integer(forKey: self.appLaunchCountKey)
        self.defaults.set(launchCount + 1, forKey: self.appLaunchCountKey)
    }
    
    // Description: Method to reset the app launch count.
    public func resetAppLaunchCount()
    {
        self.defaults.set(0, forKey: self.appLaunchCountKey)
    }
}

//================================================================================//
