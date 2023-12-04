///////////////////////////////////////////////////////////////////

import UIKit
import WebKit
import SafariServices

///////////////////////////////////////////////////////////////////

class WebViewController: UIViewController
{
    // Method called when the view is done loading.
    override func viewDidLoad()
    {
        super.viewDidLoad();
        
        let userContentController = WKUserContentController();
        userContentController.add(WebKitMessageHandler(), name: "openSafariViewController");
        userContentController.add(WebKitMessageHandler(), name: "rateApp");
        
        let webViewConfig = WKWebViewConfiguration();
        webViewConfig.userContentController = userContentController;
        
        let webView = WKWebView(frame: view.bounds, configuration: webViewConfig);
        webView.autoresizingMask = [ .flexibleWidth, .flexibleHeight];
        
        let htmlPath = Bundle.main.path(forResource: "Web/index", ofType: "html")!;
        let fileURL = URL(fileURLWithPath: htmlPath);
        let request = URLRequest(url: fileURL);
        
        webView.load(request);
        self.view.addSubview(webView);
    }
    
    // Overriden status bar style.
    override var preferredStatusBarStyle: UIStatusBarStyle
    {
        return .lightContent
    }
}

///////////////////////////////////////////////////////////////////

class WebKitMessageHandler: NSObject, WKScriptMessageHandler
{
    // Method called when the webkit message handler is invoked.
    func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage)
    {
        if message.name == "openSafariViewController", let urlString = message.body as? String
        {
            let url = URL(string: urlString);
            let safariViewController = SFSafariViewController(url: url!);
            let connectedScenes = UIApplication.shared.connectedScenes
                        .filter { $0.activationState == .foregroundActive }
                        .compactMap { $0 as? UIWindowScene };
            let window = connectedScenes.first?
                        .windows
                        .first { $0.isKeyWindow };
            let rootViewController = window?.rootViewController;
            rootViewController!.present(safariViewController, animated: true, completion: nil);
        }
        
        if message.name == "rateApp", let urlString = message.body as? String
        {
            let url = URL(string: urlString);
            if #available(iOS 10.0, *)
            {
                UIApplication.shared.open(url!, options: [:], completionHandler: nil);
            }
            else
            {
                UIApplication.shared.openURL(url!);
            }
        }
    }
}

///////////////////////////////////////////////////////////////////
