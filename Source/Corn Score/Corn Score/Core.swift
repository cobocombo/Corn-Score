//=======================================================//
// CORE VERSION: 1.1
// RELEASE DATE: 6/29/25
//=======================================================//

import UIKit
import WebKit
import SafariServices

//=======================================================//
// MAIN CORE CONTROLLER
//=======================================================//

class ScriptitCoreController: UIViewController, WKScriptMessageHandler
{
  var webView: WKWebView!
  var router: JavascriptMessageRouter!
  
  override func viewDidLoad()
  {
    super.viewDidLoad();
    
    self.router = JavascriptMessageRouter();
    self.router.registerHandler(ConsoleMessageManager(), forMessageName: "consoleMessageManager");
    self.router.registerHandler(BrowserMessageManager(), forMessageName: "browserMessageManager");
    self.router.registerHandler(DeviceMessageManager(), forMessageName: "deviceMessageManager");
    
    let preferences = WKPreferences();
    preferences.setValue(true, forKey: "developerExtrasEnabled");
    
    let userContentController = WKUserContentController();
    userContentController.add(self, name: "consoleMessageManager");
    userContentController.add(self, name: "browserMessageManager");
    userContentController.add(self, name: "deviceMessageManager");
    
    let webViewConfiguration = WKWebViewConfiguration();
    webViewConfiguration.preferences = preferences;
    webViewConfiguration.userContentController = userContentController;
    
    self.webView = WKWebView(frame: view.bounds, configuration: webViewConfiguration);
    self.webView.autoresizingMask = [ .flexibleWidth, .flexibleHeight];
    
    if let htmlPath = Bundle.main.path(forResource: "app", ofType: "html")
    {
      let fileURL = URL(fileURLWithPath: htmlPath);
      let fileDirectory = fileURL.deletingLastPathComponent();
      self.webView.loadFileURL(fileURL, allowingReadAccessTo: fileDirectory);
      self.view.addSubview(self.webView);
    }
  }
  
  func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage)
  {
    self.router.routeMessage(message, webView: self.webView);
  }
}

//=======================================================//
// MESSAGE MANAGER / ROUTER
//=======================================================//

protocol JavascriptMessageManager
{
  func handleMessage(_ message: WKScriptMessage, webView: WKWebView)
}

class JavascriptMessageRouter
{
  private var handlers: [String: JavascriptMessageManager] = [:]
  
  func registerHandler(_ handler: JavascriptMessageManager, forMessageName name: String)
  {
    handlers[name] = handler;
  }
  
  func routeMessage(_ message: WKScriptMessage, webView: WKWebView )
  {
    if let handler = handlers[message.name] { handler.handleMessage(message, webView: webView); }
    else { print("No handler found for message: \(message.name)"); }
  }
}

//=======================================================//
// MESSAGE MANAGERS
//=======================================================//

class ConsoleMessageManager: JavascriptMessageManager
{
  func handleMessage(_ message: WKScriptMessage, webView: WKWebView)
  {
    if let messageBody = message.body as? String { print(messageBody); }
  }
}

//=============================================//

class BrowserMessageManager: NSObject, JavascriptMessageManager
{
  func handleMessage(_ message: WKScriptMessage, webView: WKWebView)
  {
    let dict = message.body as? [String: Any];
    let urlString = (dict?["url"] as? String)!;
    let url = URL(string: urlString);
    
    let inApp = dict?["inApp"] as? Bool ?? false;
    let animated = dict?["animated"] as? Bool ?? true;
    
    let rootViewController = (UIApplication.shared.connectedScenes.first { $0.activationState == .foregroundActive } as? UIWindowScene)?.keyWindow?.rootViewController
    
    if(inApp == true)
    {
      let safariVC = SFSafariViewController(url: url!);
      safariVC.modalPresentationStyle = .overFullScreen;
      rootViewController?.present(safariVC, animated: animated, completion: nil);
    }
    else { UIApplication.shared.open(url!, options: [:], completionHandler: nil); }
  }
}

//=============================================//

class DeviceMessageManager: JavascriptMessageManager
{
  func handleMessage(_ message: WKScriptMessage, webView: WKWebView)
  {
    UIDevice.current.isBatteryMonitoringEnabled = true;
    
    let systemName = UIDevice.current.systemName;
    let systemVersion = UIDevice.current.systemVersion;
    let batteryLevel = UIDevice.current.batteryLevel;
    let batteryState: String;

    switch UIDevice.current.batteryState
    {
      case .charging: batteryState = "charging"
      case .full: batteryState = "full"
      case .unplugged: batteryState = "unplugged"
      case .unknown: fallthrough
      @unknown default: batteryState = "unknown"
    }

    let deviceInfo: [String: Any] = [
      "systemName": systemName,
      "systemVersion": systemVersion,
      "batteryLevel": batteryLevel,
      "batteryState": batteryState
    ]

    if let jsonData = try? JSONSerialization.data(withJSONObject: deviceInfo, options: []),
       let jsonString = String(data: jsonData, encoding: .utf8)
      {
        let jsCallback = "device.receive(\(jsonString));"
        webView.evaluateJavaScript(jsCallback, completionHandler: nil)
      }
  }
}

//=======================================================//
