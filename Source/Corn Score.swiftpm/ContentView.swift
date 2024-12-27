import SwiftUI
import UIKit

struct ContentView: UIViewControllerRepresentable 
{
    func makeUIViewController(context: Context) -> UIViewController 
    {
        let viewController = WebViewController()
        return viewController
    }
    
    func updateUIViewController(_ uiViewController: UIViewController, context: Context) 
    {
        // No update logic needed
    }
}
