///////////////////////////////////////////////////////////////////

// Method used to make the github api call and create the Github issue directly.
async function createIssue(title, body, label)
{
    let apiEndpoint = 'https://api.github.com/repos/cobocombo/Corn-Score/issues';
    let accessToken = githubAPIKey;
    let issueData = 
    {
      title: title,
      body: body,
      labels: [label]
    };
  
    try 
    {
        let response = await fetch(apiEndpoint, 
        {
            method: 'POST',
            headers: 
            {
                'Authorization': `token ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(issueData)
      });
    } 
    catch (error) 
    {
      console.error('Error creating GitHub issue:', error);
    }
} 

///////////////////////////////////////////////////////////////////