//////////////////////// GLOBAL ///////////////////////////

const CORN_SCORE_API_ENDPOINT = 'https://api.github.com/repos/cobocombo/Corn-Score/issues';

/////////////////////// FUNCTIONS /////////////////////////

/**
 * Creates a GitHub issue by making an API call to the GitHub repository's issue endpoint.
 * 
 * This method uses the GitHub API to submit an issue with a title, body, and label.
 * It sends a POST request with the necessary authentication token and data.
 * If an error occurs during the API call, it is caught and logged to the console.
 * 
 * @param {string} title - The title of the GitHub issue.
 * @param {string} body - The body content of the GitHub issue.
 * @param {string} label - The label to be applied to the GitHub issue.
 * 
 * @async
 * @throws {Error} Throws an error if the API call fails.
 */
async function createIssue(title, body, label)
{
  let issueData = 
  {
    title: title,
    body: body,
    labels: [label]
  };
  
  try 
  {
    let response = await fetch(CORN_SCORE_API_ENDPOINT, 
    {
      method: 'POST',
      headers: 
      {
        'Authorization': `token ${CORN_SCORE_GITHUB_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(issueData)
    });
  } 
  catch(error) 
  {
    console.error('Error creating GitHub issue:', error);
  }
}

/**
 * Handles the process of submitting a bug report from the user.
 * 
 * This function validates the bug report's title, description, and email input. 
 * If all inputs are valid, it constructs the bug report body and creates a GitHub issue 
 * with the provided information. Upon successful submission, it shows a success notification.
 * If there is an error, a failure notification is shown. 
 * The user inputs are cleared after submission.
 */
function submitBugReport()
{
  let title = document.getElementById("report-a-bug-title").value;
  let description = document.getElementById("report-a-bug-description").value;
  let email = document.getElementById("report-a-bug-email").value;

  if(isStringEmpty(title))
  {
    ons.notification.alert(
    {
      title: 'Invalid input',
      message: 'Title cannot be empty'
    });
    return;
  }
  if(isStringEmpty(description))
  {
    ons.notification.alert(
    {
     title: 'Invalid input',
     message: 'Description cannot be empty'
    });
    return;
  }
  if(!isValidEmail(email))
  {
    ons.notification.alert(
    {
      title: 'Invalid input',
      message: 'Email must be in the correct form'
    });
    return;
  }

  const submitReportABugRequest = async () => 
  {
    showModal('loading-modal', 'loading.html');
    let body = 
    `BUG REPORT:
      - App Version: ${APP_VERSION}
      - Operating System: ${getCurrentPlatform()}
      - Description: ${description} 
      - Email: ${email}
    ` 
    try 
    {
      await createIssue(title, body, "bug");
      hideModal('report-a-bug-modal');
      hideModal('loading-modal');
      document.getElementById("report-a-bug-title").value = "";
      document.getElementById("report-a-bug-description").value = "";
      document.getElementById("report-a-bug-email").value = "";
      setTimeout(() => 
      {
        ons.notification.alert(
        {
         title: 'Success!',
         message: 'Bug report sent'
        });
      }, "1000"); 
    } 
    catch(error) 
    {
      hideModal('loading-modal');
      setTimeout(() => 
      {
        ons.notification.alert(
        {
          title: 'Failure!',
          message: 'There was an error sending the bug report'
        });
      }, "1000");
    }
  };
  submitReportABugRequest();
}   

/**
 * Handles the submission of a new feature request to the GitHub project.
 * 
 * This function validates the title, description, and email inputs for the feature request. 
 * If all inputs are valid, it constructs the feature request body and creates a GitHub issue 
 * with the provided information. After submission, the user is notified of success or failure, 
 * and the input fields are cleared. 
 */
function submitNewFeatureRequest()
{
  let title = document.getElementById("request-a-feature-title").value;
  let description = document.getElementById("request-a-feature-description").value;
  let email = document.getElementById("request-a-feature-email").value;

  if(isStringEmpty(title))
  {
    ons.notification.alert(
    {
      title: 'Invalid input',
      message: 'Title cannot be empty'
    });
    return;
  }
  if(isStringEmpty(description))
  {
    ons.notification.alert(
    {
      title: 'Invalid input',
      message: 'Description cannot be empty'
    });
    return;
  }
  if(!isValidEmail(email))
  {
    ons.notification.alert(
    {
      title: 'Invalid input',
      message: 'Email must be in the correct form'
    });
    return;
  }

  const submitNewFeatureRequest = async () => 
  {
    showModal('loading-modal', 'loading.html');
    let body = 
      `NEW FEATURE REQUEST::
        - App Version: ${APP_VERSION}
        - Operating System: ${getCurrentPlatform()}
        - Description: ${description} 
        - Email: ${email}
        ` 
    try 
    {
      await createIssue(title, body, "enhancement");
      hideModal('request-a-feature-modal');
      hideModal('loading-modal');
      document.getElementById("request-a-feature-title").value = "";
      document.getElementById("request-a-feature-description").value = "";
      document.getElementById("request-a-feature-email").value = "";
      setTimeout(() => 
      {
        ons.notification.alert(
        {
          title: 'Success!',
          message: 'New feature request sent'
        });
      }, "1000"); 
    } 
    catch(error) 
    {
      hideModal('loading-modal');
      setTimeout(() => 
      {
        ons.notification.alert(
        {
          title: 'Failure!',
          message: 'There was an error sending the new feature request'
        });
      }, "1000");
    }
  };
  submitNewFeatureRequest();
}

///////////////////////////////////////////////////////////