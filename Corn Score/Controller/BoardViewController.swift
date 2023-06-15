// Imports.
import UIKit
import SafariServices

// Description: View Controller that manages the corn hole score board views & data.
class BoardViewController: UIViewController
{
    private var team1View: UIView!
    private var team2View: UIView!
    private var team1ScoreLabel: UILabel!
    private var team2ScoreLabel: UILabel!
    private var team1Score = 0
    private var team2Score = 0
    private var request = GithubRequest()
    private var rating = RatingManager()
   
    // Method called when the base view is loaded.
    override func viewDidLoad()
    {
        super.viewDidLoad()
        self.setupTeamColors()
        self.setupNavigationBar()
        self.rating.checkCurrentAppVersioning()
    }
    
    // Method to set up the teams and their colors for their respective sides.
    private func setupTeamColors()
    {
        self.team1View = UIView()
        self.team2View = UIView()
        self.team1View.backgroundColor = .red
        self.team2View.backgroundColor = .blue
        
        self.view.addSubview(self.team1View)
        self.view.addSubview(self.team2View)
        
        self.team1View.translatesAutoresizingMaskIntoConstraints = false
        self.team2View.translatesAutoresizingMaskIntoConstraints = false
        NSLayoutConstraint.activate([
            self.team1View.leadingAnchor.constraint(equalTo: self.view.leadingAnchor),
            self.team1View.topAnchor.constraint(equalTo: self.view.topAnchor),
            self.team1View.bottomAnchor.constraint(equalTo: self.view.bottomAnchor),
            self.team1View.widthAnchor.constraint(equalTo: self.view.widthAnchor, multiplier: 0.5),
            self.team2View.trailingAnchor.constraint(equalTo: self.view.trailingAnchor),
            self.team2View.topAnchor.constraint(equalTo: self.view.topAnchor),
            self.team2View.bottomAnchor.constraint(equalTo: self.view.bottomAnchor),
            self.team2View.widthAnchor.constraint(equalTo: self.view.widthAnchor, multiplier: 0.5)
        ])
        
        let team1TapGesture = UITapGestureRecognizer(target: self, action: #selector(self.handleViewTap(_:)))
        let team2TapGesture = UITapGestureRecognizer(target: self, action: #selector(self.handleViewTap(_:)))
        team1TapGesture.name = "Team 1"
        team2TapGesture.name = "Team 2"
        self.team1View.addGestureRecognizer(team1TapGesture)
        self.team2View.addGestureRecognizer(team2TapGesture)
        self.setupScoreLabels()
    }
    
    // Description: Method to setup each team's score label.
    private func setupScoreLabels()
    {
        self.team1ScoreLabel = UILabel()
        self.team1ScoreLabel.text = String(self.team1Score)
        self.team1ScoreLabel.textColor = .white
        self.team1ScoreLabel.font = UIFont.systemFont(ofSize: 90)
        self.team1ScoreLabel.textAlignment = .center
        
        self.team2ScoreLabel = UILabel()
        self.team2ScoreLabel.text = String(self.team2Score)
        self.team2ScoreLabel.textColor = .white
        self.team2ScoreLabel.font = UIFont.systemFont(ofSize: 90)
        self.team2ScoreLabel.textAlignment = .center
        
        self.team1View.addSubview(self.team1ScoreLabel)
        self.team2View.addSubview(self.team2ScoreLabel)
        self.team1ScoreLabel.translatesAutoresizingMaskIntoConstraints = false
        self.team2ScoreLabel.translatesAutoresizingMaskIntoConstraints = false
        NSLayoutConstraint.activate([
            self.team1ScoreLabel.centerXAnchor.constraint(equalTo: self.team1View.centerXAnchor),
            self.team1ScoreLabel.centerYAnchor.constraint(equalTo: self.team1View.centerYAnchor),
            self.team2ScoreLabel.centerXAnchor.constraint(equalTo: team2View.centerXAnchor),
            self.team2ScoreLabel.centerYAnchor.constraint(equalTo: team2View.centerYAnchor)
        ])
    }
    
    // Method to setup all the buttons in the navigation bar.
    private func setupNavigationBar()
    {
        self.navigationController!.navigationBar.tintColor = .white
        let restartButton = UIBarButtonItem(barButtonSystemItem: .refresh, target: self, action: #selector(self.handleRestartTap))
        self.navigationItem.leftBarButtonItem = restartButton
        let settingsButton = UIBarButtonItem(image: UIImage(systemName: "gearshape"), style: .plain, target: self, action: nil)
        let reportBugAction = UIAction(title: "Report a Bug", image: UIImage(systemName: "ladybug"), handler:
        { _ in
            self.reportABug()
        })
        let requestFeatureAction = UIAction(title: "Request a New Feature", image: UIImage(systemName: "lightbulb"), handler:
        { _ in
            self.requestAFeature()
        })
        let sourceCodeAction = UIAction(title: "Source Code", image: UIImage(systemName: "curlybraces"), handler:
        { _ in
            self.sourceCode()
        })
        let getInvolvedMenu = UIMenu(title: "Get Involved", options: .displayInline, children: [reportBugAction, requestFeatureAction, sourceCodeAction])
        let appVersionAction = UIAction(title: "v. \(self.rating.getAppVersion())", handler: { _ in })
        let smallTipAction = UIAction(title: "Small Tip - $.99", handler: { _ in })
        let mediumTipAction = UIAction(title: "Medium Tip - $2.99", handler: { _ in })
        let largeTipAction = UIAction(title: "Large Tip - $4.99", handler: { _ in })
        let appInfoMenu = UIMenu(title: "App Info", options: .displayInline, children: [appVersionAction])
        let tipMenu = UIMenu(title: "Leave A Tip", options: .displayInline, children: [smallTipAction, mediumTipAction, largeTipAction])
        settingsButton.menu = UIMenu(title: "", children: [getInvolvedMenu, tipMenu, appInfoMenu])
        self.navigationItem.rightBarButtonItem = settingsButton
    }
    
    // Method to increase a teams score by 1.
    private func increaseScore(team: String)
    {
        if(team == "Team 1")
        {
            self.team1Score = self.team1Score + 1
            self.team1ScoreLabel.text = String(self.team1Score)
            if(self.team1Score == 21)
            {
                self.showWinAlert(team: team)
            }
        }
        else
        {
            self.team2Score = self.team2Score + 1
            self.team2ScoreLabel.text = String(self.team2Score)
            if(self.team2Score == 21)
            {
                self.showWinAlert(team: team)
            }
        }
    }
    
    // Description: Method to decrease a teams score by 1.
    private func decreaseScore(team: String)
    {
        if(team == "Team 1")
        {
            if(self.team1Score > 0)
            {
                self.team1Score -= 1
                self.team1ScoreLabel.text = String(self.team1Score)
            }
        }
        else
        {
            if(self.team2Score > 0)
            {
                self.team2Score -= 1
                self.team2ScoreLabel.text = String(self.team2Score)
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
        let alertView = SwiftAlertView(title: "Game Over 🥊", message: "\(team) wins!", buttonTitles: "OK")
        alertView.style = .auto
        alertView.onButtonClicked
        { _, index in
            self.newGame()
            confettiView.stopConfetti()
            DispatchQueue.main.asyncAfter(deadline: .now() + 0.25)
            {
                confettiView.removeFromSuperview()
                self.rating.checkForAppRating()
            }
        }
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.25)
        {
            alertView.show()
            confettiView.startConfetti()
        }
    }
    
    // Description: Method to be called when the user presses the OK button on win alert.
    // Restarts game properties.
    private func newGame()
    {
        self.team1Score = 0
        self.team2Score = 0
        self.team1ScoreLabel.text = String(self.team1Score)
        self.team2ScoreLabel.text = String(self.team2Score)
    }
    
    // Description: Method to handle taps on any of the views within the board.
    @objc func handleViewTap(_ gestureRecognizer: UITapGestureRecognizer)
    {
        let tapLocation = gestureRecognizer.location(in: gestureRecognizer.view)
        if gestureRecognizer.state == .ended
        {
            if(gestureRecognizer.name == "Team 1")
            {
                if(tapLocation.y < self.view.bounds.height / 2)
                {
                    self.increaseScore(team: gestureRecognizer.name!)
                }
                else
                {
                    self.decreaseScore(team: gestureRecognizer.name!)
                }
            }
            else if(gestureRecognizer.name == "Team 2")
            {
                if(tapLocation.y < self.view.bounds.height / 2)
                {
                    self.increaseScore(team: gestureRecognizer.name!)
                }
                else
                {
                    self.decreaseScore(team: gestureRecognizer.name!)
                }
            }
        }
    }
    
    // Description: Method called when the user wants to restart the game score.
    @objc func handleRestartTap()
    {
        self.newGame()
    }
    
    // Description: Method to show a report a bug prompt.
    @objc func reportABug()
    {
        let alertView = SwiftAlertView(title: "Report A Bug 🐞", message: "Send screenshots to coltonboyd503@icloud.com", buttonTitles: "Cancel", "Submit")
        alertView.style = .auto
        alertView.isDismissOnActionButtonClicked = false
        alertView.isEnabledValidationLabel = true
        alertView.addTextField
        { textField in
            textField.placeholder = "Bug title..."
        }
        alertView.addTextField
        { textField in
            textField.placeholder = "Short description of bug..."
        }
        alertView.addTextField
        { textField in
            textField.placeholder = "Email..."
            textField.keyboardType = .emailAddress
            textField.autocapitalizationType = .none
            textField.autocorrectionType = .no
        }
        alertView.onActionButtonClicked
        { alert , index in
            let title = alert.textField(at: 0)
            let body = alert.textField(at: 1)
            let email = alert.textField(at: 2)
            var canSend = true
            if(!self.isTextFieldValid(title!))
            {
                alert.validationLabel.text = "Title cannot be empty."
                canSend = false
            }
            if(!self.isTextFieldValid(body!))
            {
                alert.validationLabel.text = "Description cannot be empty."
                canSend = false
            }
            if(!self.isValidEmail(email!.text!))
            {
                alert.validationLabel.text = "Invalid email format."
                canSend = false
            }
            if(canSend)
            {
                alert.dismiss()
                ProgressHUD.animationType = .systemActivityIndicator
                ProgressHUD.show()
                self.request.createIssue(title: title!.text!, body: "BUG REPORT: " + body!.text! + " --  BY: \(email!.text!)", type: "bug")
            }
        }
        alertView.show()
    }
    
    // Description: Method to show a request a feature prompt.
    @objc func requestAFeature()
    {
        let alertView = SwiftAlertView(title: "Request A Feature 💡", message: "Send additional info to coltonboyd503@icloud.com", buttonTitles: "Cancel", "Submit")
        alertView.style = .auto
        alertView.isDismissOnActionButtonClicked = false
        alertView.isEnabledValidationLabel = true
        alertView.addTextField
        { textField in
            textField.placeholder = "Feature title..."
        }
        alertView.addTextField
        { textField in
            textField.placeholder = "Short description of feature..."
        }
        alertView.addTextField
        { textField in
            textField.placeholder = "Email..."
            textField.keyboardType = .emailAddress
            textField.autocapitalizationType = .none
            textField.autocorrectionType = .no
        }
        alertView.onActionButtonClicked
        { alert , index in
            let title = alert.textField(at: 0)
            let body = alert.textField(at: 1)
            let email = alert.textField(at: 2)
            var canSend = true
            if(!self.isTextFieldValid(title!))
            {
                alert.validationLabel.text = "Title cannot be empty."
                canSend = false
            }
            if(!self.isTextFieldValid(body!))
            {
                alert.validationLabel.text = "Description cannot be empty."
                canSend = false
            }
            if(!self.isValidEmail(email!.text!))
            {
                alert.validationLabel.text = "Invalid email format."
                canSend = false
            }
            if(canSend)
            {
                alert.dismiss()
                ProgressHUD.animationType = .systemActivityIndicator
                ProgressHUD.show()
                self.request.createIssue(title: title!.text!, body: "IN APP REQUEST: " + body!.text! + " --  BY: \(email!.text!)", type: "enhancement")
            }
        }
        alertView.show()
    }
    
    // Description: Method to display the source code in a SafariViewController.
    private func sourceCode()
    {
        let url = URL(string: "https://github.com/cobocombo/Corn-Score")!
        let safariViewController = SFSafariViewController(url: url)
        self.present(safariViewController, animated: true, completion: nil)
    }
    
    // Description: Method to check if a textfield is empty or not.
    private func isTextFieldValid(_ textField: UITextField) -> Bool
    {
        guard let text = textField.text else
        {
            return false
        }
        let trimmedText = text.trimmingCharacters(in: .whitespacesAndNewlines)
        return !trimmedText.isEmpty
    }
    
    // Description: Method to check if an email string is valid or not.
    private func isValidEmail(_ email: String) -> Bool
    {
        let emailRegex = "[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}"
        let emailPredicate = NSPredicate(format: "SELF MATCHES %@", emailRegex)
        return emailPredicate.evaluate(with: email)
    }
}

