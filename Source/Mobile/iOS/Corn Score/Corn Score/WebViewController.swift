///////////////////////////////////////////////////////////////////

import UIKit
import WebKit
import SafariServices

///////////////////////////////////////////////////////////////////

class WebViewController: UIViewController
{
    override func viewDidLoad()
    {
        super.viewDidLoad();
        
        let userContentController = WKUserContentController();
        userContentController.add(WebKitMessageHandler(), name: "openSafariViewController");
        
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
}

///////////////////////////////////////////////////////////////////

class WebKitMessageHandler: NSObject, WKScriptMessageHandler
{
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
    }
}

///////////////////////////////////////////////////////////////////
