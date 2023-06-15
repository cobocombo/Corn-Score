// Imports.
import UIKit

// Description: Default board view that contains both team sides & score labels.
class BoardView: UIView
{
    public var team1View: UIView!
    public var team2View: UIView!
    public var team1ScoreLabel: UILabel!
    public var team2ScoreLabel: UILabel!
    
    // Description: Override frame with frame passed in.
    override init(frame: CGRect)
    {
        super.init(frame: frame)
        self.backgroundColor = .green
        self.setupViews()
        self.setupConstraints()
    }
    
    // Description: Required contructor.
    required init?(coder: NSCoder)
    {
        fatalError("init(coder:) has not been implemented")
    }
    
    // Description: Method to setup applicable subviews.
    private func setupViews()
    {
        self.team1View = UIView()
        self.team2View = UIView()
        self.team1View.backgroundColor = .red
        self.team2View.backgroundColor = .blue
        
        self.addSubview(self.team1View)
        self.addSubview(self.team2View)
        
        self.team1ScoreLabel = UILabel()
        self.team1ScoreLabel.text = "0"
        self.team1ScoreLabel.textColor = .white
        self.team1ScoreLabel.font = UIFont.systemFont(ofSize: 90)
        self.team1ScoreLabel.textAlignment = .center
        
        self.team2ScoreLabel = UILabel()
        self.team2ScoreLabel.text = "0"
        self.team2ScoreLabel.textColor = .white
        self.team2ScoreLabel.font = UIFont.systemFont(ofSize: 90)
        self.team2ScoreLabel.textAlignment = .center
        
        self.team1View.addSubview(self.team1ScoreLabel)
        self.team2View.addSubview(self.team2ScoreLabel)
    }
    
    // Description: Method to set the constraints of the current view & it's subviews.
    private func setupConstraints()
    {
        self.translatesAutoresizingMaskIntoConstraints = false
        self.team1View.translatesAutoresizingMaskIntoConstraints = false
        self.team2View.translatesAutoresizingMaskIntoConstraints = false
        self.team1ScoreLabel.translatesAutoresizingMaskIntoConstraints = false
        self.team2ScoreLabel.translatesAutoresizingMaskIntoConstraints = false
       
        DispatchQueue.main.async
        {
            NSLayoutConstraint.activate([
                self.leadingAnchor.constraint(equalTo: self.superview!.leadingAnchor),
                self.topAnchor.constraint(equalTo: self.superview!.topAnchor),
                self.bottomAnchor.constraint(equalTo: self.superview!.bottomAnchor),
                self.widthAnchor.constraint(equalTo: self.superview!.widthAnchor),
                self.team1View.leadingAnchor.constraint(equalTo: self.leadingAnchor),
                self.team1View.topAnchor.constraint(equalTo: self.topAnchor),
                self.team1View.bottomAnchor.constraint(equalTo: self.bottomAnchor),
                self.team1View.widthAnchor.constraint(equalTo: self.widthAnchor, multiplier: 0.5),
                self.team2View.trailingAnchor.constraint(equalTo: self.trailingAnchor),
                self.team2View.topAnchor.constraint(equalTo: self.topAnchor),
                self.team2View.bottomAnchor.constraint(equalTo: self.bottomAnchor),
                self.team2View.widthAnchor.constraint(equalTo: self.widthAnchor, multiplier: 0.5),
                self.team1ScoreLabel.centerXAnchor.constraint(equalTo: self.team1View.centerXAnchor),
                self.team1ScoreLabel.centerYAnchor.constraint(equalTo: self.team1View.centerYAnchor),
                self.team2ScoreLabel.centerXAnchor.constraint(equalTo: self.team2View.centerXAnchor),
                self.team2ScoreLabel.centerYAnchor.constraint(equalTo: self.team2View.centerYAnchor)
            ])
        }
    }
}
