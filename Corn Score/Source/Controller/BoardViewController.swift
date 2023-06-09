//================================================================================//

// Imports.
import UIKit
import SafariServices
import Foundation

//================================================================================//

// Description: View Controller that manages the corn hole score board views & data.
class BoardViewController: UIViewController
{
    private var alerts = BaseAlertControllers()
    private var board: BoardView!
    private var keeper = ScoreKeeper()
    private var request = GithubRequest()
    private var rating = RatingManager()
   
    // Method called when the base view is loaded.
    override func viewDidLoad()
    {
        super.viewDidLoad()
        self.setupBoard()
        self.setupNavigationBar()
        self.sync()
    }
    
    // Method to set up the teams and their colors for their respective sides.
    private func setupBoard()
    {
        let team1TapGesture = UITapGestureRecognizer(target: self, action: #selector(self.handleViewTap(_:)))
        let team2TapGesture = UITapGestureRecognizer(target: self, action: #selector(self.handleViewTap(_:)))
        team1TapGesture.name = "Team 1"
        team2TapGesture.name = "Team 2"
        
        self.board = BoardView(frame: self.view.frame)
        self.board.team1View.addGestureRecognizer(team1TapGesture)
        self.board.team2View.addGestureRecognizer(team2TapGesture)
        self.view.addSubview(self.board)
    }
    
    // Method to setup all the menus / buttons in the navigation bar.
    private func setupNavigationBar()
    {
        self.navigationController!.navigationBar.tintColor = .white
        let restartButton = UIBarButtonItem(barButtonSystemItem: .refresh, target: self, action: #selector(self.handleRestartTap))
        let settingsButton = UIBarButtonItem(image: UIImage(systemName: "gearshape"), style: .plain, target: self, action: nil)

        let reportBugAction = UIAction(title: "Report a Bug", image: UIImage(systemName: "ladybug")) { _ in self.reportABug() }
        let requestFeatureAction = UIAction(title: "Request a New Feature", image: UIImage(systemName: "lightbulb")) { _ in self.requestAFeature() }
        let sourceCodeAction = UIAction(title: "Source Code", image: UIImage(systemName: "curlybraces")) { _ in self.showSourceCode() }
        let getInvolvedMenu = UIMenu(title: "Get Involved", options: .displayInline, children: [reportBugAction, requestFeatureAction, sourceCodeAction])
        
        let smallTipAction = UIAction(title: "Buy Me A Coffee" , image: UIImage(systemName: "cup.and.saucer")) { _ in self.showTipLink() }
        let tipMenu = UIMenu(title: "Support", options: .displayInline, children: [smallTipAction])
        
        let appVersionAction = UIAction(title: "v. \(AppInfo.shared.getAppVersion())", image: UIImage(systemName: "info.circle")) { _ in }
        let appInfoMenu = UIMenu(title: "App Info", options: .displayInline, children: [appVersionAction])
        
        settingsButton.menu = UIMenu(title: "", children: [getInvolvedMenu, tipMenu, appInfoMenu])
        
        self.navigationItem.leftBarButtonItem = restartButton
        self.navigationItem.rightBarButtonItem = settingsButton
    }
    
    // Method to syn app info changes and present an first launch alert if needed.
    private func sync()
    {
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.05)
        {
            if(!AppInfo.shared.isAppLaunched())
            {
                self.firstLaunchTipAlert()
            }
            AppInfo.shared.checkCurrentAppVersioning()
        }
    }
    
    // Method to increase a team's score by 1.
    private func increaseScore(team: String)
    {
        if(team == "Team 1")
        {
            self.keeper.team1Score = self.keeper.team1Score + 1
            self.board.team1ScoreLabel.text = String(self.keeper.team1Score)
            if(self.keeper.team1Score == self.keeper.winningScore) { self.showWinAlert(team: team) }
        }
        else
        {
            self.keeper.team2Score = self.keeper.team2Score + 1
            self.board.team2ScoreLabel.text = String(self.keeper.team2Score)
            if(self.keeper.team2Score == self.keeper.winningScore) { self.showWinAlert(team: team) }
        }
    }
    
    // Description: Method to decrease a team's score by 1.
    private func decreaseScore(team: String)
    {
        if(team == "Team 1")
        {
            if(self.keeper.team1Score > 0)
            {
                self.keeper.team1Score -= 1
                self.board.team1ScoreLabel.text = String(self.keeper.team1Score)
            }
        }
        else
        {
            if(self.keeper.team2Score > 0)
            {
                self.keeper.team2Score -= 1
                self.board.team2ScoreLabel.text = String(self.keeper.team2Score)
            }
        }
    }
        
    // Description: Method to build & show an alert when one of the user wins.
    private func showWinAlert(team: String)
    {
        let confettiView = SAConfettiView(frame: self.view.bounds)
        confettiView.type = .confetti
        confettiView.intensity = 1.0
        confettiView.colors = [UIColor.red, UIColor.blue, UIColor.green]
        self.view.addSubview(confettiView)
        
        let alertController = UIAlertController(title: "Game Over 🥊", message: "\(team) wins!", preferredStyle: .alert)
        let okAction = UIAlertAction(title: "OK", style: .default)
        { _ in
            self.newGame()
            confettiView.stopConfetti()
            DispatchQueue.main.asyncAfter(deadline: .now() + 0.25)
            {
                confettiView.removeFromSuperview()
                self.rating.checkForAppRating()
            }
        }
        alertController.addAction(okAction)
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.25)
        {
            self.present(alertController, animated: true)
            confettiView.startConfetti()
        }
    }
    
    // Description: Method to be called when the user presses the OK button on win alert.
    // Restarts game properties.
    private func newGame()
    {
        self.keeper.team1Score = 0
        self.keeper.team2Score = 0
        self.board.team1ScoreLabel.text = String(self.keeper.team1Score)
        self.board.team2ScoreLabel.text = String(self.keeper.team2Score)
    }
    
    // Description: Method to handle taps on any of the views within the board.
    @objc func handleViewTap(_ gestureRecognizer: UITapGestureRecognizer)
    {
        let tapLocation = gestureRecognizer.location(in: gestureRecognizer.view)
        if gestureRecognizer.state == .ended
        {
            if(gestureRecognizer.name == "Team 1")
            {
                if(tapLocation.y < self.view.bounds.height / 2) { self.increaseScore(team: gestureRecognizer.name!) }
                else { self.decreaseScore(team: gestureRecognizer.name!) }
            }
            else if(gestureRecognizer.name == "Team 2")
            {
                if(tapLocation.y < self.view.bounds.height / 2) { self.increaseScore(team: gestureRecognizer.name!) }
                else { self.decreaseScore(team: gestureRecognizer.name!) }
            }
        }
    }
    
    // Description: Method called when the user wants to restart the game score.
    @objc private func handleRestartTap()
    {
        self.newGame()
    }
    
    // Description: Method called to show a first launch tip to give simple tap instructions.
    private func firstLaunchTipAlert()
    {
        let alertController = self.alerts.firstLaunchTipAlertController()
        self.present(alertController, animated: true)
    }
    
    // Description: Method to show a report a bug prompt.
    private func reportABug()
    {
        let alertController = self.alerts.reportABugAlertController()
        let submitAction = UIAlertAction(title: "Submit", style: .default)
        { _ in
            var willBeSent = true
            guard let title = alertController.textFields?[0].text,
            let body = alertController.textFields?[1].text,
            let email = alertController.textFields?[2].text
            else { return}
            
            if(!InputValidator.shared.isStringEmpty(text: title)) { willBeSent = false }
            if(!InputValidator.shared.isStringEmpty(text: body)) { willBeSent = false }
            if(!InputValidator.shared.isEmailStringValid(email: email)) { willBeSent = false }
    
            if(willBeSent)
            {
                ProgressHUD.animationType = .systemActivityIndicator
                ProgressHUD.show()
                self.request.createIssue(title: title, body: "BUG REPORT: " + body + " --  BY: \(email)", type: "bug")
            }
            else { ProgressHUD.showFailed("Invalid response in textfield.") }
        }
        alertController.addAction(submitAction)
        self.present(alertController, animated: true)
    }
    
    // Description: Method to show a request a feature prompt.
    private func requestAFeature()
    {
        let alertController = self.alerts.requestAFeatureAlertController()
        let submitAction = UIAlertAction(title: "Submit", style: .default)
        { _ in
            var willBeSent = true
            guard let title = alertController.textFields?[0].text,
            let body = alertController.textFields?[1].text,
            let email = alertController.textFields?[2].text
            else { return}
            
            if(!InputValidator.shared.isStringEmpty(text: title)) { willBeSent = false }
            if(!InputValidator.shared.isStringEmpty(text: body)) { willBeSent = false }
            if(!InputValidator.shared.isEmailStringValid(email: email)) { willBeSent = false }
    
            if(willBeSent)
            {
                ProgressHUD.animationType = .systemActivityIndicator
                ProgressHUD.show()
                self.request.createIssue(title: title, body: "IN APP REQUEST: " + body + " --  BY: \(email)", type: "enhancement")
            }
            else { ProgressHUD.showFailed("Invalid response in textfield.") }
        }
        alertController.addAction(submitAction)
        self.present(alertController, animated: true)
    }
    
    // Description: Method to display the source code in a SafariViewController.
    private func showSourceCode()
    {
        let url = URL(string: "https://github.com/cobocombo/Corn-Score")!
        let safariViewController = SFSafariViewController(url: url)
        self.present(safariViewController, animated: true, completion: nil)
    }
    
    // Description: Method to display my buy me a coffee link in a SafariViewController.
    private func showTipLink()
    {
        let url = URL(string: "https://www.buymeacoffee.com/cobocombo")!
        let safariViewController = SFSafariViewController(url: url)
        self.present(safariViewController, animated: true, completion: nil)
    }
}

//================================================================================//
