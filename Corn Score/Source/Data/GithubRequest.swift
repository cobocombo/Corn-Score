// Imports.
import Foundation

// Description: Object to create Github issues for different types based on labels.
class GithubRequest
{
    // Description: Method to call Github API to create an issue for this app.
    public func createIssue(title: String, body: String, type: String)
    {
        let endpoint = "https://api.github.com/repos/cobocombo/Corn-Score/issues"
        let issueData = [ "title": title, "body": body, "labels": [type] ] as [String : Any] as [String : Any]
        
        guard let url = URL(string: endpoint) else 
        {
            print("Invalid URL")
            ProgressHUD.showFailed("Invalid URL.")
            return
        }
        
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("token \(GITHUB_ISSUES_ACCESS_TOKEN)", forHTTPHeaderField: "Authorization")
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        
        do 
        {
            let jsonData = try JSONSerialization.data(withJSONObject: issueData, options: [])
            request.httpBody = jsonData
        } 
        catch 
        {
            print("Error serializing issue data: \(error)")
            ProgressHUD.showFailed("Error serializing issue data: \(error)")
            return
        }
        
        let task = URLSession.shared.dataTask(with: request) 
        { (data, response, error) in
            if let error = error 
            {
                print("Error creating GitHub issue: \(error)")
                ProgressHUD.showFailed("Error creating GitHub issue: \(error)")
                return
            }
            
            if let httpResponse = response as? HTTPURLResponse, httpResponse.statusCode == 201 {
                print("GitHub issue created successfully.")
                ProgressHUD.dismiss()
                DispatchQueue.main.asyncAfter(deadline: .now() + 0.25) 
                {
                    ProgressHUD.showSucceed()
                }
                
            } else {
                print("Failed to create GitHub issue.")
                ProgressHUD.dismiss()
                DispatchQueue.main.asyncAfter(deadline: .now() + 0.25) 
                {
                    ProgressHUD.showFailed()
                }
            }
        }
        task.resume()
    }
}


