///////////////////////////////////////////////////////////
// SETTINGS MODULE
///////////////////////////////////////////////////////////

/** Singleton class representing the main SettingsManager object. */
class SettingsManager
{
  #appVersion;
  #errors;
  #links;
  #storageKeys;
  #textSizes;
  static #instance = null;

  /** Creates the settings object. **/
  constructor() 
  {
    this.#appVersion = '1.6';
    this.#errors = 
    {
      singleInstanceError: 'Settings Manager Error: Only one SettingsManager object can exist at a time.',
    };

    this.#storageKeys = 
    {
      team1Name: 'team-1-name',
      team2Name: 'team-2-name',
      team1Color: 'team-1-color',
      team2Color: 'team-2-color', 
      textColor: 'text-color',
      textSize: 'text-size'
    }

    this.#textSizes = 
    {
      small: 
      {
        label: 'Small',
        teamName: '20px',
        teamScore: '90px' 
      },
      medium: 
      {
        label: 'Medium',
        teamName: '30px',
        teamScore: '110px'
      },
      large: 
      {
        label: 'Large',
        teamName: '40px',
        teamScore: '130px'
      }
    }

    this.#links = 
    {
      buyMeACoffeeLink: 'https://www.buymeacoffee.com/cobocombo',
      privacyPolicyLink: 'https://github.com/cobocombo/Corn-Score/blob/main/PRIVACY_POLICY.md',
      rateAppLink: 'https://itunes.apple.com/app/id6446418989?action=write-review',
      rulesLink: 'https://www.playcornhole.org/pages/rules',
      sourceCodeLink: 'https://github.com/cobocombo/Corn-Score',
      sourceCodeGithubIssuesAPILink: 'https://api.github.com/repos/cobocombo/Corn-Score/issues'
    }

    if(SettingsManager.#instance) console.error(this.#errors.singleInstanceError);
    else 
    {
      SettingsManager.#instance = this;
    }
  }

  /** Static method to return a new SettingsManager instance. Allows for Singleton+Module pattern. */
  static getInstance() 
  {
    return new SettingsManager();
  }

  /** Public method to set all of the settings back to their default settings. */
  setDefaults()
  {
    localStorage.setItem(this.#storageKeys.team1Name, 'Team 1');
    localStorage.setItem(this.#storageKeys.team2Name, 'Team 2');
    localStorage.setItem(this.#storageKeys.team1Color, '#FF0000');
    localStorage.setItem(this.#storageKeys.team2Color, '#0000FF');
    localStorage.setItem(this.#storageKeys.textColor, '#FFFFFF');
    localStorage.setItem(this.#storageKeys.textSize, this.#textSizes.medium.label);
  }

  /** Get property to get the current version of the app. */
  get appVersion()
  {
    return this.#appVersion;
  }

  /** Get property to get the links object containing all website links for the app. */
  get links()
  {
    return this.#links;
  }

  /** Get property to get the textSizes object. */
  get textSizes()
  {
    return this.#textSizes;
  }

  /** Get property to get the storageKeys object. */
  get storageKeys()
  {
    return this.#storageKeys;
  }
}

///////////////////////////////////////////////////////////
// PAGES
///////////////////////////////////////////////////////////

/** Class representing the app info page of Corn Score. */
class AppInfoPage extends ui.Page
{
  /** Public method called when the page is initialized. */
  onInit()
  {
    this.setupNavBar();
    this.setupBody();
  }

  /** Public method called when the user taps the privacy policy item. Pushes the privacy policy page onto the _navigator_. */
  privacyPolicyItemTapped()
  {
    browser.open({ url: settings.links.privacyPolicyLink, inApp: true, animated: true });
  }

  /** Public method called to set the body of the app info page. */
  setupBody()
  {
    let appInfoList = new ui.List();
    appInfoList.addItem({ item: new ui.ListItem({ left: new ui.Icon({ icon: 'ion-ios-information-circle', size: '32px' }), center: `Version: ${settings.appVersion}` }) });
    appInfoList.addItem({ item: new ui.ListItem({ left: new ui.Icon({ icon: 'ion-ios-eye', size: '32px' }), center: "Privacy Policy", tappable: true, modifiers: ['chevron'], onTap: this.privacyPolicyItemTapped.bind(this) }) });
    appInfoList.addItem({ item: new ui.ListItem({ left: new ui.Icon({ icon: 'ion-ios-star', size: '32px' }), center: "What's New", tappable: true, modifiers: ['chevron'], onTap: this.whatsNewItemTapped.bind(this) }) });
    this.addComponents({ components: [ appInfoList ]});
  }

  /** Public method called to set the navigation bar of the app info page. */
  setupNavBar()
  {
    this.navigationBarTitle = 'App Info';
    let backButton = new ui.BackBarButton( { onTap: () => { _navigator_.pop({ animated : false }); } });
    this.navigationBarButtonsLeft = [ backButton ];
  }

  /** Public method called when the user taps the what's new item. Pushes the what's new page onto the _navigator_. */
  whatsNewItemTapped()
  {
    _navigator_.push({ page: new WhatsNewPage(), animated: false });
  }
}

/////////////////////////////////////////////////

/** Class representing the customization page of Corn Score. */
class CustomizationPage extends ui.Page
{
  /** Public method called when the page is initialized. */
  onInit()
  {
    this.setupNavBar();
    this.setupBody();
    this.setupAlerts();
  }

  /** Public method called when the user taps the rest to default item. Allows the user to reset their settings. */
  resetToDefaultItemTapped()
  {
    this.resetAlert.present();
  }

  /** Public method called to set up any of the reusable alerts for the customization page. */
  setupAlerts()
  {
    let cancelButton = new ui.AlertDialogButton({ text: 'Cancel' });
    let resetButton = new ui.AlertDialogButton({ text: 'Reset', textColor: 'red' });
    resetButton.onTap = () => 
    {  
      settings.setDefaults();
      this.updateSettings();
    }
    this.resetAlert = new ui.AlertDialog({ title: 'Reset To Default?', rowfooter: true, buttons: [ cancelButton, resetButton ]});
    this.resetAlert.addComponents({ components: [ new ui.Text({ text: 'All customizations will be lost' }) ]});
  }

  /** Public method called to set the body of the customization page. */
  setupBody()
  {
    this.team1Texfield = new ui.Textfield({ onTextChange: (text) => { localStorage.setItem(settings.storageKeys.team1Name, text); } });
    this.team1Texfield.underbar = false;
    this.team2Texfield = new ui.Textfield({ onTextChange: (text) => { localStorage.setItem(settings.storageKeys.team2Name, text); } });
    this.team2Texfield.underbar = false;
    this.team1ColorPicker = new ui.ColorPicker({ onChange: (color) => { localStorage.setItem(settings.storageKeys.team1Color, color); } });
    this.team2ColorPicker = new ui.ColorPicker({ onChange: (color) => { localStorage.setItem(settings.storageKeys.team2Color, color); } });
    this.textColorPicker = new ui.ColorPicker({ onChange: (color) => { localStorage.setItem(settings.storageKeys.textColor, color); } });
    this.textSizeSelctor = new ui.Selector({ options: [ settings.textSizes.small.label, settings.textSizes.medium.label, settings.textSizes.large.label ] });
    this.textSizeSelctor.underbar = false;
    this.textSizeSelctor.onChange = (option) => { localStorage.setItem(settings.storageKeys.textSize, option); }

    this.updateSettings();

    let customizationList = new ui.List();
    customizationList.addItem({ item: new ui.ListItem({ left: new ui.Icon({ icon: 'ion-ios-person', size: '32px' }), center: this.team1Texfield, right: this.team1ColorPicker  }) });
    customizationList.addItem({ item: new ui.ListItem({ left: new ui.Icon({ icon: 'ion-ios-person', size: '32px' }), center: this.team2Texfield, right: this.team2ColorPicker }) });
    customizationList.addItem({ item: new ui.ListItem({ left: new ui.Icon({ icon: 'ion-ios-color-palette', size: '32px' }), center: 'Text Color', right: this.textColorPicker }) });
    customizationList.addItem({ item: new ui.ListItem({ left: new ui.Icon({ icon: 'ion-ios-document', size: '32px' }), center: 'Text Size', right: this.textSizeSelctor }) });
    customizationList.addItem({ item: new ui.ListItem({ left: new ui.Icon({ icon: 'ion-ios-refresh', size: '32px' }), center: 'Reset To Default', tappable: true, onTap: this.resetToDefaultItemTapped.bind(this) }) });
    this.addComponents({ components: [ customizationList ]});
  }

  /** Public method called to set the navigation bar of the customization page. */
  setupNavBar()
  {
    this.navigationBarTitle = 'Customization';
    let backButton = new ui.BackBarButton( { onTap: () => { _navigator_.pop({ animated : false }); } });
    this.navigationBarButtonsLeft = [ backButton ];
  }

  /** Public method called to update all of the customization settings in the list. */
  updateSettings()
  {
    this.team1Texfield.text = localStorage.getItem(settings.storageKeys.team1Name);
    this.team2Texfield.text = localStorage.getItem(settings.storageKeys.team2Name);
    this.team1ColorPicker.color = localStorage.getItem(settings.storageKeys.team1Color);
    this.team2ColorPicker.color = localStorage.getItem(settings.storageKeys.team2Color);
    this.textColorPicker.color = localStorage.getItem(settings.storageKeys.textColor);
    this.textSizeSelctor.selectedOption = localStorage.getItem(settings.storageKeys.textSize);
  }
}

/////////////////////////////////////////////////

/** Class representing the get involved page of Corn Score. */
class GetInvolvedPage extends ui.Page
{
  /** Public method called when the user taps the buy me a coffee item. Opens a browser in app for the user to give a donation.*/
  buyMeACoffeeItemTapped()
  {
    browser.open({ url: settings.links.buyMeACoffeeLink, inApp: true, animated: true });
  }

  /** Public method called when the page is initialized. */
  onInit()
  {
    this.setupNavBar();
    this.setupBody();
  }

  /** Public method called when the user taps the rate corn score item. Opens a browser out of app for the user to rate the app. */
  rateCornScoreItemTapped()
  {
    browser.open({ url: settings.links.rateAppLink, inApp: false, animated: false });
  }

  /** Public method called when the user taps the report a bug item. Pushes the report a bug page onto the _navigator_. */
  reportABugItemTapped()
  {
    _navigator_.push({ page: new ReportABugPage(), animated: false });
  }

  /** Public method called when the user taps the request a feature item. Pushes the request a feature page onto the _navigator_. */
  requestAFeatureItemTapped()
  {
    _navigator_.push({ page: new RequestAFeaturePage(), animated: false });
  }

  /** Public method called to set the body of the get involved page. */
  setupBody()
  {
    let getInvolvedList = new ui.List();
    getInvolvedList.addItem({ item: new ui.ListItem({ left: new ui.Icon({ icon: 'ion-ios-heart', size: '32px' }), center: 'Rate Corn Score', tappable: true, modifiers: ['chevron'], onTap: this.rateCornScoreItemTapped.bind(this) }) });
    getInvolvedList.addItem({ item: new ui.ListItem({ left: new ui.Icon({ icon: 'ion-logo-github', size: '32px' }), center: 'Source Code', tappable: true, modifiers: ['chevron'], onTap: this.sourceCodeItemTapped.bind(this) }) });
    getInvolvedList.addItem({ item: new ui.ListItem({ left: new ui.Icon({ icon: 'ion-ios-bug', size: '32px' }), center: 'Report A Bug', tappable: true, modifiers: ['chevron'], onTap: this.reportABugItemTapped.bind(this) }) });
    getInvolvedList.addItem({ item: new ui.ListItem({ left: new ui.Icon({ icon: 'ion-ios-add-circle', size: '32px' }), center: 'Request A Feature', tappable: true, modifiers: ['chevron'], onTap: this.requestAFeatureItemTapped.bind(this) }) });
    getInvolvedList.addItem({ item: new ui.ListItem({ left: new ui.Icon({ icon: 'ion-ios-cafe', size: '32px' }), center: 'Buy Me A Coffee', tappable: true, modifiers: ['chevron'], onTap: this.buyMeACoffeeItemTapped.bind(this) }) });
    this.addComponents({ components: [ getInvolvedList ]});
  }

  /** Public method called to set the navigation bar of the get involved page. */
  setupNavBar()
  {
    this.navigationBarTitle = 'Get Involved';
    let backButton = new ui.BackBarButton( { onTap: () => { _navigator_.pop({ animated : false }); } });
    this.navigationBarButtonsLeft = [ backButton ];
  }

  /** Public method called when the user taps source code item. Opens a browser in app for the user to view the source code of the project. */
  sourceCodeItemTapped()
  {
    browser.open({ url: settings.links.sourceCodeLink, inApp: true, animated: true });
  }
}

/////////////////////////////////////////////////

/** Class representing the score board page. */
class ScoreBoardPage extends ui.Page
{
  /** 
   * Public method to change the score of the board.
   * @param {String} team - Team to change the score for.
   * @param {Event} event - Tap event.
   */
  changeScore({ team, event } = {})
  {
    let scoreText = null;
    if(team == 'team-1') scoreText = this.team1Score;
    else scoreText = this.team2Score;

    let rect = scoreText.element.getBoundingClientRect();
    let clickY = event.clientY - rect.top;

    if(clickY < rect.height / 2) 
    {
      if(team === 'team-1') 
      {
        this.team1ScoreAmount++;
        if(this.team1ScoreAmount == 21) this.teamWins({ team: 'team-1' });
      } 
      else if(team === 'team-2') 
      {
        this.team2ScoreAmount++;
        if(this.team2ScoreAmount == 21) this.teamWins({ team: 'team-2' });
      }
    }
    else 
    {
      if(team === 'team-1' && this.team1ScoreAmount > 0) this.team1ScoreAmount--;
      else if(team === 'team-2' && this.team2ScoreAmount > 0) this.team2ScoreAmount--;
    }

    this.updateScores();
  }

  /** Public method called when the page is initialized. */
  onInit()
  {
    this.team1ScoreAmount = 0;
    this.team2ScoreAmount = 0;

    this.setupNavBar();
    this.setupBoard();
    this.setupAlerts();
    this.setupAppTour();
  }

  /** Public method called when the page is shown on screen. */
  onShow()
  {
    this.team1Name.text = localStorage.getItem(settings.storageKeys.team1Name);
    this.team2Name.text = localStorage.getItem(settings.storageKeys.team2Name);
    
    switch(localStorage.getItem(settings.storageKeys.textSize)) 
    {
      case settings.textSizes.medium.label:
        this.team1Name.fontSize = settings.textSizes.medium.teamName;
        this.team2Name.fontSize = settings.textSizes.medium.teamName;
        this.team1Score.fontSize = settings.textSizes.medium.teamScore;
        this.team2Score.fontSize = settings.textSizes.medium.teamScore;
        break;
      case settings.textSizes.large.label:
        this.team1Name.fontSize = settings.textSizes.large.teamName;
        this.team2Name.fontSize = settings.textSizes.large.teamName;
        this.team1Score.fontSize = settings.textSizes.large.teamScore;
        this.team2Score.fontSize = settings.textSizes.large.teamScore;
        break;
      default:
        this.team1Name.fontSize = settings.textSizes.small.teamName;
        this.team2Name.fontSize = settings.textSizes.small.teamName;
        this.team1Score.fontSize = settings.textSizes.small.teamScore;
        this.team2Score.fontSize = settings.textSizes.small.teamScore;
    }

    this.team1NameColumn.backgroundColor = localStorage.getItem(settings.storageKeys.team1Color);
    this.team1ScoreColumn.backgroundColor = localStorage.getItem(settings.storageKeys.team1Color);
    this.team1FooterColumn.backgroundColor = localStorage.getItem(settings.storageKeys.team1Color);
    this.team2NameColumn.backgroundColor = localStorage.getItem(settings.storageKeys.team2Color);
    this.team2ScoreColumn.backgroundColor = localStorage.getItem(settings.storageKeys.team2Color);
    this.team2FooterColumn.backgroundColor = localStorage.getItem(settings.storageKeys.team2Color);
    this.team1Name.color = localStorage.getItem(settings.storageKeys.textColor);
    this.team2Name.color = localStorage.getItem(settings.storageKeys.textColor);
    this.team1Score.color = localStorage.getItem(settings.storageKeys.textColor);
    this.team2Score.color = localStorage.getItem(settings.storageKeys.textColor);
  }

  /** Public method called when the user taps the restart button. A restart alert will show if either team has a point. */
  restartButtonTapped()
  {
    if(this.team1ScoreAmount > 0 || this.team2ScoreAmount > 0) this.restartAlert.present();
  }

  /** Public method called to reset the score board. */
  restartGame()
  {
    this.team1ScoreAmount = 0;
    this.team2ScoreAmount = 0;
    this.updateScores();
  }

  /** Public method called to set up any of the reusable alerts for the score board page. */
  setupAlerts()
  {
    let cancelButton = new ui.AlertDialogButton({ text: 'Cancel' });
    let restartButton = new ui.AlertDialogButton({ text: 'Restart', textColor: 'red', onTap: () => { this.restartGame(); }});
    this.restartAlert = new ui.AlertDialog({ title: 'All score data will be lost', rowfooter: true, buttons: [ cancelButton, restartButton ] });
    this.restartAlert.addComponents({ components: [ new ui.Text({ text: 'Restart Game?' }) ]});
  }

  /** Public method called to setup the app tour. */ 
  setupAppTour()
  {
    if(_showTour_ == true)
    {
      let skipButton = new ui.AlertDialogButton({ text: 'Skip', textColor: 'red', onTap: () => {  } });
      let yesButton = new ui.AlertDialogButton({ text: 'Yes', onTap: () => { this.startAppTour(); } });
      let welcomeAlert = new ui.AlertDialog({ title: 'Welcome To Corn Score!', rowfooter: true, buttons: [ skipButton, yesButton ] });
      welcomeAlert.addComponents({ components: [ new ui.Text({ text: 'Would you like to take a quick tour?' }) ]});
      welcomeAlert.present(); 
    }
  }

  /** Public method called to setup the board. */
  setupBoard()
  {
    this.setupNameRow();
    this.setupScoreRow();
    this.setupFooterRow();

    this.rulesFab = new ui.FabButton({ icon: 'ion-ios-clipboard', backgroundColor: 'gold', iconColor: 'black' });
    this.rulesFab.onTap = () => { browser.open({ url: settings.links.rulesLink, inApp: true, animated: true }); };
    this.addComponents({ components: [ this.rulesFab ] })
  }

  /** Public method called to set the footer row of the score board. */
  setupFooterRow()
  {
    this.team1FooterColumn = new ui.Column();
    this.team1FooterColumn.width = '50%';
    this.team1FooterColumn.onTap = (event) => { this.changeScore({ team: 'team-1', event: event })};

    this.team2FooterColumn = new ui.Column();
    this.team2FooterColumn.width = '50%';
    this.team2FooterColumn.onTap = (event) => { this.changeScore({ team: 'team-2', event: event })};

    this.footerRow = new ui.Row();
    this.footerRow.height = '25%';
    this.footerRow.addColumn({ column: this.team1FooterColumn });
    this.footerRow.addColumn({ column: this.team2FooterColumn });

    this.addComponents({ components: [ this.footerRow ]});
  }

  /** Public method called to set the name row of the score board. */
  setupNameRow()
  {
    this.team1Name = new ui.Text({ type: 'header-1' });
    this.team1Name.style.margin = '0px';
    this.team1Name.style.textAlign = 'center';

    this.team2Name = new ui.Text({ type: 'header-1' });
    this.team2Name.style.margin = '0px';
    this.team1Name.style.textAlign = 'center';

    this.team1NameColumn = new ui.Column();
    this.team1NameColumn.width = '50%';
    this.team1NameColumn.onTap = (event) => { this.changeScore({ team: 'team-1', event: event })};
    this.team1NameColumn.addComponents({ components: [ this.team1Name ], center: true });

    this.team2NameColumn = new ui.Column();
    this.team2NameColumn.width = '50%';
    this.team2NameColumn.onTap = (event) => { this.changeScore({ team: 'team-2', event: event })};
    this.team2NameColumn.addComponents({ components: [ this.team2Name ], center: true });

    this.nameRow = new ui.Row();
    this.nameRow.height = '25%';
    this.nameRow.addColumn({ column: this.team1NameColumn });
    this.nameRow.addColumn({ column: this.team2NameColumn });

    this.addComponents({ components: [ this.nameRow ]});
  }

  /** Public method called to set the navigation bar of the score board. */
  setupNavBar()
  {
    this.navigationBarTitle = 'Corn Score';
    this.restartButton = new ui.BarButton({ icon: 'ion-ios-refresh', onTap: this.restartButtonTapped.bind(this) });
    this.settingsButton = new ui.BarButton({ icon: 'ion-ios-cog', onTap: () => { _navigator_.push({ page: new SettingsPage(), animated : false }) }});
    this.navigationBarButtonsLeft = [ this.restartButton ];
    this.navigationBarButtonsRight = [ this.settingsButton ];
  }

  /** Public method called to set the score row of the score board. */
  setupScoreRow()
  {
    this.team1Score = new ui.Text({ type: 'header-1', text: String(this.team1ScoreAmount) });
    this.team1Score.style.margin = '0px';

    this.team2Score = new ui.Text({ type: 'header-1', text: String(this.team2ScoreAmount) });
    this.team2Score.style.margin = '0px';

    this.team1ScoreColumn = new ui.Column();
    this.team1ScoreColumn.width = '50%';
    this.team1ScoreColumn.onTap = (event) => { this.changeScore({ team: 'team-1', event: event })};
    this.team1ScoreColumn.addComponents({ components: [ this.team1Score ], center: true });

    this.team2ScoreColumn = new ui.Column();
    this.team2ScoreColumn.width = '50%';
    this.team2ScoreColumn.onTap = (event) => { this.changeScore({ team: 'team-2', event: event })};
    this.team2ScoreColumn.addComponents({ components: [ this.team2Score ], center: true });

    this.scoreRow = new ui.Row();
    this.scoreRow.height = '50%';
    this.scoreRow.addColumn({ column: this.team1ScoreColumn });
    this.scoreRow.addColumn({ column: this.team2ScoreColumn });

    this.addComponents({ components: [ this.scoreRow ]});
  }

  /** Public method called to start the app tour. */
  startAppTour()
  {
    let increaseScoreText = new ui.Text({ text: 'Tap above the number to increase the score!', marginLeft: '12px', marginRight: '12px', marginTop: '32px' });
    increaseScoreText.style.textAlign = 'center';

    let decreaseScoreText = new ui.Text({ text: 'Tap below the number to decrease the score!', marginLeft: '12px', marginRight: '12px', marginTop: '32px' });
    decreaseScoreText.style.textAlign = 'center';

    let restartGameText = new ui.Text({ text: 'Tap here to restart the game!', marginLeft: '12px', marginRight: '12px', marginTop: '32px' });
    restartGameText.style.textAlign = 'center';

    let settingsText = new ui.Text({ text: 'Go to settings to customize the board, request new features, and rate the app! ', marginLeft: '12px', marginRight: '12px', marginTop: '14px' });
    settingsText.style.textAlign = 'center';

    let rulesText = new ui.Text({ text: 'Tap here to view the offical rules of corn hole! ', marginLeft: '12px', marginRight: '12px', marginTop: '32px' });
    rulesText.style.textAlign = 'center';

    let thankyouText = new ui.Text({ text: 'Thanks for the download and we hope you enjoy Corn Score! ', marginLeft: '12px', marginRight: '12px', marginTop: '24px' });
    thankyouText.style.textAlign = 'center';

    let increaseScoreCheckpoint = new ui.Popover({ direction: 'up' });
    increaseScoreCheckpoint.addComponents({ components: [ increaseScoreText ] });

    let decreaseScoreCheckpoint = new ui.Popover({ direction: 'down' });
    decreaseScoreCheckpoint.addComponents({ components: [ decreaseScoreText ] });

    let restartGameCheckpoint = new ui.Popover({ direction: 'down' });
    restartGameCheckpoint.addComponents({ components: [ restartGameText ] });

    let settingsCheckpoint = new ui.Popover({ direction: 'down' });
    settingsCheckpoint.addComponents({ components: [ settingsText ] });

    let rulesCheckpoint = new ui.Popover({ direction: 'up' });
    rulesCheckpoint.addComponents({ components: [ rulesText ] });

    let thankyouCheckpoint = new ui.Popover({ direction: 'up' });
    thankyouCheckpoint.addComponents({ components: [ thankyouText ] });

    let thankyouComponent = new ui.Rectangle({ width: '50px', height: '50px', alpha: '0.0' });

    this.addComponentToCenter({ component: thankyouComponent });

    setTimeout(() => { increaseScoreCheckpoint.present({ target: this.team1Score }); }, 200);
    increaseScoreCheckpoint.addEventListener({ event: 'dialogcancel', handler: () => { setTimeout(() => { decreaseScoreCheckpoint.present({ target: this.team2Score }); }, 100) }});
    decreaseScoreCheckpoint.addEventListener({ event: 'dialogcancel', handler: () => { setTimeout(() => { restartGameCheckpoint.present({ target: this.restartButton }); }, 100) }});
    restartGameCheckpoint.addEventListener({ event: 'dialogcancel', handler: () => { setTimeout(() => { settingsCheckpoint.present({ target: this.settingsButton }); }, 100) }});
    settingsCheckpoint.addEventListener({ event: 'dialogcancel', handler: () => { setTimeout(() => { rulesCheckpoint.present({ target: this.rulesFab }); }, 100) }});
    rulesCheckpoint.addEventListener({ event: 'dialogcancel', handler: () => { setTimeout(() => { thankyouCheckpoint.present({ target: thankyouComponent }); }, 100) }});
  }

  /** 
   * Public method called when a team hits 21 points. It starts confetti and shows a game over alert.
   * @param {String} team - Team that hit 21 points.
   */
  teamWins({ team } = {})
  {
    confetti.start();

    let nameText = null;
    if(team == 'team-1') nameText = this.team1Name;
    else nameText = this.team2Name;
    this.restartGame(); 

    let gameOverAlert = new ui.AlertDialog({ id: 'game-over-alert', title: 'Game Over!', rowfooter: true });
    let okButton = new ui.AlertDialogButton({ text: 'Ok'});
    okButton.onTap = () => 
    { 
      this.restartGame(); 
      confetti.stop();
      setTimeout(() => { document.getElementById('confetti-canvas')?.remove(); }, 2500);
      setTimeout(() => { gameOverAlert.remove() });
    }

    gameOverAlert.buttons = [ okButton ];
    gameOverAlert.addComponents({ components: [ new ui.Text({ text: `${nameText.text} wins!` }) ]});
    gameOverAlert.cancelable = false 
    gameOverAlert.present();
  }

  /** Public method called to update the score of each team on the score board. */
  updateScores()
  {
    this.team1Score.text = String(this.team1ScoreAmount);
    this.team2Score.text = String(this.team2ScoreAmount);
  }
}

/////////////////////////////////////////////////

/** Class representing the settings page of Corn Score. */
class SettingsPage extends ui.Page
{
  /** Public method called when the user taps the app info item. Pushes the app info page onto the _navigator_. */
  appInfoItemTapped()
  {
    _navigator_.push({ page: new AppInfoPage(), animated: false });
  }

  /** Public method called when the user taps the customization item. Pushes the customization page onto the _navigator_. */
  customizationItemTapped()
  {
    _navigator_.push({ page: new CustomizationPage(), animated: false });
  }

  /** Public method called when the user taps the get involved item. Pushes the get involved page onto the _navigator_. */
  getInvolvedItemTapped()
  {
    _navigator_.push({ page: new GetInvolvedPage(), animated: false });
  }

  /** Public method called when the page is initialized. */
  onInit()
  {
    this.setupNavBar();
    this.setupList();
  }

  /** Public method called to set up the list with all of it's items and components. */
  setupList()
  {
    let settingsList = new ui.List();
    settingsList.addItem({ item: new ui.ListItem({ left: new ui.Icon({ icon: 'ion-ios-color-palette', size: '32px' }), center: 'Customize', tappable: true, modifiers: ['chevron'], onTap: this.customizationItemTapped.bind(this) }) });
    settingsList.addItem({ item: new ui.ListItem({ left: new ui.Icon({ icon: 'ion-ios-people', size: '32px' }), center: 'Get Involved', tappable: true, modifiers: ['chevron'], onTap: this.getInvolvedItemTapped.bind(this) }) });
    settingsList.addItem({ item: new ui.ListItem({ left: new ui.Icon({ icon: 'ion-ios-information-circle', size: '32px' }), center: 'App Info', tappable: true, modifiers: ['chevron'], onTap: this.appInfoItemTapped.bind(this) }) });
    this.addComponents({ components: [ settingsList ]});
  }

  /** Public method called to set the navigation bar of the settings page. */
  setupNavBar()
  {
    this.navigationBarTitle = 'Settings';
    let backButton = new ui.BackBarButton({ onTap: () => { _navigator_.pop({ animated : false }); } });
    this.navigationBarButtonsLeft = [ backButton ];
  }
}

/////////////////////////////////////////////////

/** Class representing the report a bug page of Corn Score. */
class ReportABugPage extends ui.Page
{
  /** Public method called to check if a user input string is empty or not. */
  isStringEmpty({ string } = {})
  {
    return string.trim() === '';
  }

  /** Public method called to check if a email string is a valid email or not. */
  isValidEmail({ email } = {}) 
  {
    let emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  }

  /** Public method called when the page is initialized. */
  onInit()
  {
    this.setupNavBar();
    this.setupList();
    this.setupLoadingModal();
  }

  /** Public method called to present an invalid input alert. */
  presentInvalidInputAlert({ message } = {})
  {
    let okButton = new ui.AlertDialogButton({ text: 'Ok' });
    let invalidReportAlert = new ui.AlertDialog({ title: 'Invalid input', rowfooter: true, buttons: [ okButton ] });
    invalidReportAlert.addComponents({ components: [ new ui.Text({ text: message }) ]});
    invalidReportAlert.present();
  }

  /** Public method called to present a thank you alert. */
  presentThankYouAlert()
  {
    let okButton = new ui.AlertDialogButton({ text: 'Ok', onTap: () => { _navigator_.pop({ animated : false }); } });
    let thankyouAlert = new ui.AlertDialog({ title: 'Success', rowfooter: true, buttons: [ okButton ] });
    thankyouAlert.addComponents({ components: [ new ui.Text({ text: 'Bug reported successfully' }) ]});
    thankyouAlert.present();
  }

  /** Public method called to set up the list with all of it's items and components. */
  setupList()
  {
    this.titleTextfield = new ui.Textfield({ width: '100%', placeholder: 'A title that summarizes the bug...' });
    this.titleTextfield.underbar = false;

    this.descriptionTextArea = new ui.TextArea({ width: '100%', placeholder: "A detailed description of what's going wrong...", rows: 5, maxLength: 240 });
    this.descriptionTextArea.element.classList = 'textarea textarea--transparent';

    this.emailTextfield = new ui.Textfield({ type: 'email', width: '100%', placeholder: 'A good email for discussing the bug...' });
    this.emailTextfield.underbar = false;

    let reportABugList = new ui.List();
    reportABugList.addItem({ item: new ui.ListHeader({ text: 'Title' }) });
    reportABugList.addItem({ item: new ui.ListItem({ center: this.titleTextfield  }) });
    reportABugList.addItem({ item: new ui.ListHeader({ text: 'Description' }) });
    reportABugList.addItem({ item: new ui.ListItem({ center: this.descriptionTextArea }) });
    reportABugList.addItem({ item: new ui.ListHeader({ text: 'Email' }) });
    reportABugList.addItem({ item: new ui.ListItem({ center: this.emailTextfield  }) });
    
    this.addComponents({ components: [ reportABugList ] });
  }

  /** Public method called to set up the loading modal. */
  setupLoadingModal()
  {
    this.loadingModal = new ui.Modal();
    this.loadingModal.addComponents({ components: [ new ui.CircularProgress({ indeterminate: true, size: '80px', color: 'white' }) ] });
  }

  /** Public method called to set the navigation bar of the report a bug page. */
  setupNavBar()
  {
    this.navigationBarTitle = 'Report A Bug';
    let backButton = new ui.BackBarButton({ onTap: () => { _navigator_.pop({ animated : false }); } });
    let sendButton = new ui.BarButton({ icon: 'ion-ios-paper-plane', onTap: () => { this.submitBugReport() } });
    this.navigationBarButtonsLeft = [ backButton ];
    this.navigationBarButtonsRight = [ sendButton ];
  }

  /** Public method called to submit the bug report to github. Shows modal state until a response comes in and then gives the user a success message. */
  submitBugReport()
  {
    if(this.isStringEmpty({ string: this.titleTextfield.text }))
    {
      this.presentInvalidInputAlert({ message: 'Title cannot be empty' });
      return;
    } 

    if(this.isStringEmpty({ string: this.descriptionTextArea.text }))
    {
      this.presentInvalidInputAlert({ message: 'Description cannot be empty' });
      return;
    } 
      
    if(!this.isValidEmail({ email: this.emailTextfield.text })) 
    {
      this.presentInvalidInputAlert({ message: 'Email must be in the correct form' });
      return;
    }

    this.loadingModal.present();

    let issue = 
    {
      title: `[Reported In App] ${this.titleTextfield.text}`,
      body: `## Description\n${this.descriptionTextArea.text}\n\n**Reported by:** ${this.emailTextfield.text}\n\n**Core version:** ${app.coreVersion}\n\n**Core release date:** ${app.coreReleaseDate}`,
      labels: ['bug']
    };

    fetch(settings.links.sourceCodeGithubIssuesAPILink, 
    {
      method: 'POST',
      headers: 
      {
        'Authorization': `Bearer ${_githubSecret_}`,
        'Accept': 'application/vnd.github+json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(issue)
    })
    .then(response => 
    {
      if(response.ok) console.log('Bug reported successfully'); 
      else return response.json().then(data => { console.error(data.message); });
      setTimeout(() => { this.loadingModal.dismiss(); }, 2000);
      setTimeout(() => { this.presentThankYouAlert(); }, 2500);
    })
    .catch(error => 
    {
      console.error(error);
      setTimeout(() => { this.loadingModal.dismiss(); }, 2000);
      setTimeout(() => { this.presentThankYouAlert(); }, 2500);
    });
  }
}

/////////////////////////////////////////////////

/** Class representing the request a feature page of Corn Score. */
class RequestAFeaturePage extends ui.Page
{
  /** Public method called to check if a user input string is empty or not. */
  isStringEmpty({ string } = {})
  {
    return string.trim() === '';
  }

  /** Public method called to check if a email string is a valid email or not. */
  isValidEmail({ email } = {}) 
  {
    let emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  }

  /** Public method called when the page is initialized. */
  onInit()
  {
    this.setupNavBar();
    this.setupList();
    this.setupLoadingModal();
  }

  /** Public method called to present an invalid input alert. */
  presentInvalidInputAlert({ message } = {})
  {
    let okButton = new ui.AlertDialogButton({ text: 'Ok' });
    let invalidReportAlert = new ui.AlertDialog({ title: 'Invalid input', rowfooter: true, buttons: [ okButton ] });
    invalidReportAlert.addComponents({ components: [ new ui.Text({ text: message }) ]});
    invalidReportAlert.present();
  }

  /** Public method called to present a thank you alert. */
  presentThankYouAlert()
  {
    let okButton = new ui.AlertDialogButton({ text: 'Ok', onTap: () => { _navigator_.pop({ animated : false }); } });
    let thankyouAlert = new ui.AlertDialog({ title: 'Success', rowfooter: true, buttons: [ okButton ] });
    thankyouAlert.addComponents({ components: [ new ui.Text({ text: 'New feature reported successfully' }) ]});
    thankyouAlert.present();
  }

  /** Public method called to set up the list with all of it's items and components. */
  setupList()
  {
    this.titleTextfield = new ui.Textfield({ width: '100%', placeholder: 'A title that summarizes the feature...' });
    this.titleTextfield.underbar = false;

    this.descriptionTextArea = new ui.TextArea({ width: '100%', placeholder: 'A detailed description of how the app could be improved...', rows: 5, maxLength: 240 });
    this.descriptionTextArea.element.classList = 'textarea textarea--transparent';

    this.emailTextfield = new ui.Textfield({ width: '100%', placeholder: 'A good email for discussing the new feature...' });
    this.emailTextfield.underbar = false;

    let requestAFeatureList = new ui.List();
    requestAFeatureList.addItem({ item: new ui.ListHeader({ text: 'Title' }) });
    requestAFeatureList.addItem({ item: new ui.ListItem({ center: this.titleTextfield  }) });
    requestAFeatureList.addItem({ item: new ui.ListHeader({ text: 'Description' }) });
    requestAFeatureList.addItem({ item: new ui.ListItem({ center: this.descriptionTextArea }) });
    requestAFeatureList.addItem({ item: new ui.ListHeader({ text: 'Email' }) });
    requestAFeatureList.addItem({ item: new ui.ListItem({ center: this.emailTextfield  }) });
    
    this.addComponents({ components: [ requestAFeatureList ] });
  }

  /** Public method called to set up the loading modal. */
  setupLoadingModal()
  {
    this.loadingModal = new ui.Modal();
    this.loadingModal.addComponents({ components: [ new ui.CircularProgress({ indeterminate: true, size: '80px', color: 'white' }) ] });
  }

  /** Public method called to set the navigation bar of the request a feature page. */
  setupNavBar()
  {
    this.navigationBarTitle = 'Request A Feature';
    let backButton = new ui.BackBarButton({ onTap: () => { _navigator_.pop({ animated : false }); } });
    let sendButton = new ui.BarButton({ icon: 'ion-ios-paper-plane', onTap: () => { this.submitNewFeatureRquest() } });
    this.navigationBarButtonsLeft = [ backButton ];
    this.navigationBarButtonsRight = [ sendButton ];
  }

  /** Public method called to submit the new feature request to github. Shows modal state until a response comes in and then gives the user a success message. */
  submitNewFeatureRquest()
  {
    if(this.isStringEmpty({ string: this.titleTextfield.text }))
    {
      this.presentInvalidInputAlert({ message: 'Title cannot be empty' });
      return;
    } 

    if(this.isStringEmpty({ string: this.descriptionTextArea.text }))
    {
      this.presentInvalidInputAlert({ message: 'Description cannot be empty' });
      return;
    } 
      
    if(!this.isValidEmail({ email: this.emailTextfield.text })) 
    {
      this.presentInvalidInputAlert({ message: 'Email must be in the correct form' });
      return;
    }

    this.loadingModal.present();

    let issue = 
    {
      title: `[Reported In App] ${this.titleTextfield.text}`,
      body: `## Description\n${this.descriptionTextArea.text}\n\n**Reported by:** ${this.emailTextfield.text}\n\n**Core version:** ${app.coreVersion}\n\n**Core release date:** ${app.coreReleaseDate}`,
      labels: ['enhancement']
    };

    fetch(settings.links.sourceCodeGithubIssuesAPILink, 
    {
      method: 'POST',
      headers: 
      {
        'Authorization': `Bearer ${_githubSecret_}`,
        'Accept': 'application/vnd.github+json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(issue)
    })
    .then(response => 
    {
      if(response.ok) console.log('New feature request reported successfully'); 
      else return response.json().then(data => { console.error(data.message); });
      setTimeout(() => { this.loadingModal.dismiss(); }, 2000);
      setTimeout(() => { this.presentThankYouAlert(); }, 2500);
    })
    .catch(error => 
    {
      console.error(error);
      setTimeout(() => { this.loadingModal.dismiss(); }, 2000);
      setTimeout(() => { this.presentThankYouAlert(); }, 2500);
    });
  }
}

/////////////////////////////////////////////////

/** Class representing the whats new page of Corn Score. */
class WhatsNewPage extends ui.Page
{
  /** Public method called when the page is initialized. */
  onInit()
  {
    this.setupNavBar();
    this.setupBody();
  }

  /** Public method called to set the navigation bar of the what's new page. */
  setupNavBar()
  {
    let backButton = new ui.BackBarButton( { onTap: () => { _navigator_.pop({ animated : false }); } });
    this.navigationBarButtonsLeft = [ backButton ];
  }

  /** Public method called to set the body of the whats new page. */
  setupBody()
  {
    let titleColumn = new ui.Column();
    titleColumn.addComponents({ components: [ new ui.Text({ type: 'header-1', text: `What's New` }) ] });

    let appVersionColumn = new ui.Column();
    appVersionColumn.addComponents({ components: [ new ui.Text({ text: `App Version: ${settings.appVersion}`, marginTop: '2px' }) ] });

    let titleRow = new ui.Row();
    titleRow.addColumn({ column: titleColumn });

    let feature1Row = this.buildFeatureRow({ icon: 'ion-ios-clipboard', iconColor: 'orange', description: 'Added the ability to view the rules for corn hole' });
    let feature2Row = this.buildFeatureRow({ icon: 'ion-ios-bug', iconColor: 'red', description: 'Fixed some existing bugs and added stability updates' });
    let feature3Row = this.buildFeatureRow({ icon: 'ion-ios-compass', iconColor: '#007AFF', description: 'Added an app tour guide for new players' });

    let whatsNewCard = new Card();
    whatsNewCard.addComponents({ components: [ titleRow, appVersionColumn, feature1Row, feature2Row, feature3Row ] });

    this.addComponents({ components: [ whatsNewCard ]});
  }

  /** 
   * Public method to build a new feature row and return it to the body of the whats new page.
   * @param {string} icon - Icon to display for the new feature.
   * @param {string} iconColor - Color of the icon to display for the new feature.
   * @param {string} description - Description to display for the new feature.
   * @returns {Row} The row to be returned and to be added to the whats new body.
   */
  buildFeatureRow({ icon, iconColor, description } = {})
  {
    let iconColumn = new ui.Column();
    iconColumn.width = 'auto';
    iconColumn.addComponents({ components: [ new ui.Icon({ icon: icon, size: '44px', marginTop: '16px', color: iconColor }) ], center: true });

    let descriptionText = new ui.Text({ text: description });
    descriptionText.style.textAlign = 'center';
    let detailColumn = new ui.Column();
    detailColumn.addComponents({ components: [ descriptionText ] });

    let featureRow = new ui.Row();
    featureRow.addColumn({ column: iconColumn });
    featureRow.addColumn({ column: detailColumn });

    return featureRow;
  }
}

///////////////////////////////////////////////////////////

globalThis.settings = SettingsManager.getInstance();

let _showTour_ = false;
if(app.isFirstLaunch) 
{
  settings.setDefaults();
  _showTour_ = true; 
}

const _navigator_ = new ui.Navigator({ root: new ScoreBoardPage() });
app.present({ root: _navigator_ });

///////////////////////////////////////////////////////////