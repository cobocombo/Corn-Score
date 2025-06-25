///////////////////////////////////////////////////////////
// SETTINGS MODULE
///////////////////////////////////////////////////////////

/** Singleton class representing the main SettingsManager object. */
class SettingsManager
{
  #appVersion;
  #errors;
  #storageKeys;
  #textSizes;

  static #instance = null;

  /** Creates the settings object. **/
  constructor() 
  {
    this.#appVersion = '1.5';
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

  setDefaults()
  {
    localStorage.setItem(this.#storageKeys.team1Name, 'Team 1');
    localStorage.setItem(this.#storageKeys.team2Name, 'Team 2');
    localStorage.setItem(this.#storageKeys.team1Color, '#FF0000');
    localStorage.setItem(this.#storageKeys.team2Color, '#0000FF');
    localStorage.setItem(this.#storageKeys.textColor, '#FFFFFF');
    localStorage.setItem(this.#storageKeys.textSize, this.#textSizes.medium.label);
  }

  get appVersion()
  {
    return this.#appVersion;
  }

  get textSizes()
  {
    return this.#textSizes;
  }

  get storageKeys()
  {
    return this.#storageKeys;
  }
}

///////////////////////////////////////////////////////////
// PAGES
///////////////////////////////////////////////////////////

class ScoreBoardPage extends ui.Page
{
  onInit()
  {
    this.team1ScoreAmount = 0;
    this.team2ScoreAmount = 0;

    this.setupNavBar();
    this.setupNameRow();
    this.setupScoreRow();
    this.setupFooterRow();
  }

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

  setupNavBar()
  {
    this.navigationBarTitle = 'Corn Score';

    let restartButton = new ui.BarButton();
    restartButton.icon = 'ion-ios-refresh';
    restartButton.onTap = this.restartButtonTapped.bind(this);

    let settingsButton = new ui.BarButton();
    settingsButton.icon = 'ion-ios-cog';
    settingsButton.onTap = () => { navigator.push({ page: new SettingsPage(), animated : false }) };

    this.navigationBarButtonsLeft = [ restartButton ];
    this.navigationBarButtonsRight = [ settingsButton ];
  }

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

  setupScoreRow()
  {
    this.team1Score = new ui.Text({ type: 'header-1' });
    this.team1Score.text = String(this.team1ScoreAmount);
    this.team1Score.style.margin = '0px';

    this.team2Score = new ui.Text({ type: 'header-1' });
    this.team2Score.text = String(this.team2ScoreAmount);
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

  teamWins({ team } = {})
  {
    confetti.start();

    let nameText = null;
    if(team == 'team-1') nameText = this.team1Name;
    else nameText = this.team2Name;

    let okButton = new ui.AlertDialogButton();
    okButton.text = 'Ok';
    okButton.onTap = () => 
    { 
      this.restartGame(); 
      confetti.stop();
    }

    let gameOverAlert = new ui.AlertDialog();
    gameOverAlert.title = 'Game Over!';
    gameOverAlert.rowfooter = true;
    gameOverAlert.buttons = [ okButton ];
    gameOverAlert.addComponents({ components: [ new ui.Text({ text: `${nameText.text} wins!` }) ]});
    gameOverAlert.present();
  }

  restartButtonTapped()
  {
    if(this.team1ScoreAmount > 0 || this.team2ScoreAmount > 0)
    {
      let cancelButton = new ui.AlertDialogButton();
      cancelButton.text = 'Cancel';

      let restartButton = new ui.AlertDialogButton();
      restartButton.textColor = 'red';
      restartButton.text = 'Restart';
      restartButton.onTap = () => { this.restartGame(); }

      let restartAlert = new ui.AlertDialog();
      restartAlert.title = 'All score data will be lost';
      restartAlert.rowfooter = true;
      restartAlert.buttons = [ cancelButton, restartButton ];
      restartAlert.addComponents({ components: [ new ui.Text({ text: 'Restart Game?' }) ]})

      restartAlert.present();
    }
  }

  restartGame()
  {
    this.team1ScoreAmount = 0;
    this.team2ScoreAmount = 0;
    this.updateScores();
  }

  updateScores()
  {
    this.team1Score.text = String(this.team1ScoreAmount);
    this.team2Score.text = String(this.team2ScoreAmount);
  }
}

/////////////////////////////////////////////////

class SettingsPage extends ui.Page
{
  onInit()
  {
    this.sourceCodeLink = 'https://github.com/cobocombo/Corn-Score';
    this.buyMeACoffeeLink = 'https://www.buymeacoffee.com/cobocombo';
    this.rateCornScoreLink = 'https://itunes.apple.com/app/id6446418989?action=write-review';
    this.rulesLink = 'https://www.playcornhole.org/pages/rules';

    this.setupNavBar();

    this.team1Texfield = new ui.Textfield();
    this.team1Texfield.underbar = false;
    this.team1Texfield.onTextChange = (text) => { localStorage.setItem(settings.storageKeys.team1Name, text); }

    this.team2Texfield = new ui.Textfield();
    this.team2Texfield.underbar = false;
    this.team2Texfield.onTextChange = (text) => { localStorage.setItem(settings.storageKeys.team2Name, text); }

    this.team1ColorPicker = new ui.ColorPicker();
    this.team1ColorPicker.onChange = (color) => { localStorage.setItem(settings.storageKeys.team1Color, color); }

    this.team2ColorPicker = new ui.ColorPicker();
    this.team2ColorPicker.onChange = (color) => { localStorage.setItem(settings.storageKeys.team2Color, color); }

    this.textColorPicker = new ui.ColorPicker();
    this.textColorPicker.onChange = (color) => { localStorage.setItem(settings.storageKeys.textColor, color); }

    this.textSizeSelctor = new ui.Selector();
    this.textSizeSelctor.options = [ settings.textSizes.small.label, settings.textSizes.medium.label, settings.textSizes.large.label ];
    this.textSizeSelctor.underbar = false;
    this.textSizeSelctor.onChange = (option) => { localStorage.setItem(settings.storageKeys.textSize, option); }

    this.updateSettings();
    
    let settingsList = new ui.List();
    settingsList.addItem({ item: new ui.ListHeader({ text: 'Customize' }) });
    settingsList.addItem({ item: new ui.ListItem({ left: new ui.Icon({ icon: 'ion-ios-person', size: '32px' }), center: this.team1Texfield, right: this.team1ColorPicker  }) });
    settingsList.addItem({ item: new ui.ListItem({ left: new ui.Icon({ icon: 'ion-ios-person', size: '32px' }), center: this.team2Texfield, right: this.team2ColorPicker }) });
    settingsList.addItem({ item: new ui.ListItem({ left: new ui.Icon({ icon: 'ion-ios-color-palette', size: '32px' }), center: 'Text Color', right: this.textColorPicker }) });
    settingsList.addItem({ item: new ui.ListItem({ left: new ui.Icon({ icon: 'ion-ios-document', size: '32px' }), center: 'Text Size', right: this.textSizeSelctor }) });
    settingsList.addItem({ item: new ui.ListItem({ left: new ui.Icon({ icon: 'ion-ios-refresh', size: '32px' }), center: 'Reset To Default', tappable: true, onTap: this.resetToDefaultItemTapped.bind(this) }) });

    settingsList.addItem({ item: new ui.ListHeader({ text: 'Get Involved' }) });
    settingsList.addItem({ item: new ui.ListItem({ left: new ui.Icon({ icon: 'ion-logo-github', size: '32px' }), center: 'Source Code', tappable: true, modifiers: ['chevron'], onTap: this.sourceCodeItemTapped.bind(this) }) });
    settingsList.addItem({ item: new ui.ListItem({ left: new ui.Icon({ icon: 'ion-ios-bug', size: '32px' }), center: 'Report A Bug', tappable: true, modifiers: ['chevron'], onTap: this.reportABugItemTapped.bind(this) }) });
    settingsList.addItem({ item: new ui.ListItem({ left: new ui.Icon({ icon: 'ion-ios-add-circle', size: '32px' }), center: 'Request A Feature', tappable: true, modifiers: ['chevron'], onTap: this.requestAFeatureItemTapped.bind(this) }) });
    settingsList.addItem({ item: new ui.ListItem({ left: new ui.Icon({ icon: 'ion-ios-cafe', size: '32px' }), center: 'Buy Me A Coffee', tappable: true, modifiers: ['chevron'], onTap: this.buyMeACoffeeItemTapped.bind(this) }) });

    settingsList.addItem({ item: new ui.ListHeader({ text: 'App Info' }) });
    settingsList.addItem({ item: new ui.ListItem({ left: new ui.Icon({ icon: 'ion-ios-information-circle', size: '32px' }), center: `Version: ${settings.appVersion}` }) });
    settingsList.addItem({ item: new ui.ListItem({ left: new ui.Icon({ icon: 'ion-ios-clipboard', size: '32px' }), center: 'Corn Hole Rules', tappable: true, modifiers: ['chevron'], onTap: this.rulesItemTapped.bind(this) }) });
    settingsList.addItem({ item: new ui.ListItem({ left: new ui.Icon({ icon: 'ion-ios-heart', size: '32px' }), center: 'Rate Corn Score', tappable: true, modifiers: ['chevron'], onTap: this.rateCornScoreItemTapped.bind(this) }) });
    settingsList.addItem({ item: new ui.ListItem({ left: new ui.Icon({ icon: 'ion-ios-star', size: '32px' }), center: "What's New", tappable: true, modifiers: ['chevron'], onTap: this.whatNewItemTapped.bind(this) }) });
    settingsList.addItem({ item: new ui.ListItem({ left: new ui.Icon({ icon: 'ion-ios-eye', size: '32px' }), center: "Privacy Policy", tappable: true, modifiers: ['chevron'], onTap: this.privacyPolicyItemTapped.bind(this) }) });

    this.addComponents({ components: [ settingsList ]});
  }

  setupNavBar()
  {
    this.navigationBarTitle = 'Settings';

    let backButton = new ui.BackBarButton();
    backButton.onTap = () => { navigator.pop({ animated : false }); };

    this.navigationBarButtonsLeft = [ backButton ];
  }

  resetToDefaultItemTapped()
  {
    let cancelButton = new ui.AlertDialogButton();
    cancelButton.text = 'Cancel';

    let resetButton = new ui.AlertDialogButton();
    resetButton.textColor = 'red';
    resetButton.text = 'Reset';
    resetButton.onTap = () => 
    {  
      settings.setDefaults();
      this.updateSettings();
    }

    let resetAlert = new ui.AlertDialog();
    resetAlert.title = 'Reset To Default?';
    resetAlert.rowfooter = true;
    resetAlert.buttons = [ cancelButton, resetButton ];
    resetAlert.addComponents({ components: [ new ui.Text({ text: 'All customizations will be lost' }) ]})

    resetAlert.present();
  }

  sourceCodeItemTapped()
  {
    browser.open({ url: this.sourceCodeLink, inApp: true, animated: true });
  }

  buyMeACoffeeItemTapped()
  {
    browser.open({ url: this.buyMeACoffeeLink, inApp: true, animated: true });
  }

  rateCornScoreItemTapped()
  {
    browser.open({ url: this.rateCornScoreLink, inApp: false, animated: false });
  }

  rulesItemTapped()
  {
    browser.open({ url: this.rulesLink, inApp: true, animated: true });
  }

  reportABugItemTapped()
  {
    navigator.push({ page: new ReportABugPage(), animated: false });
  }

  requestAFeatureItemTapped()
  {
    navigator.push({ page: new RequestAFeaturePage(), animated: false });
  }

  whatNewItemTapped()
  {
    navigator.push({ page: new WhatsNewPage(), animated: false });
  }

  privacyPolicyItemTapped()
  {
    navigator.push({ page: new PrivacyPolicyPage(), animated: false });
  }

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

class ReportABugPage extends ui.Page
{
  onInit()
  {
    this.setupNavBar();
  }

  setupNavBar()
  {
    this.navigationBarTitle = 'Report A Bug';

    let backButton = new ui.BackBarButton();
    backButton.onTap = () => { navigator.pop({ animated : false }); };

    this.navigationBarButtonsLeft = [ backButton ];
  }
}

/////////////////////////////////////////////////

class RequestAFeaturePage extends ui.Page
{
  onInit()
  {
    this.setupNavBar();
  }

  setupNavBar()
  {
    this.navigationBarTitle = 'Request A Feature';

    let backButton = new ui.BackBarButton();
    backButton.onTap = () => { navigator.pop({ animated : false }); };

    this.navigationBarButtonsLeft = [ backButton ];
  }
}

/////////////////////////////////////////////////

class PrivacyPolicyPage extends ui.Page
{
  onInit()
  {
    this.setupNavBar();
  }

  setupNavBar()
  {
    this.navigationBarTitle = 'Privacy Policy';

    let backButton = new ui.BackBarButton();
    backButton.onTap = () => { navigator.pop({ animated : false }); };

    this.navigationBarButtonsLeft = [ backButton ];
  }
}

/////////////////////////////////////////////////

class WhatsNewPage extends ui.Page
{
  onInit()
  {
    this.setupNavBar();
  }

  setupNavBar()
  {
    this.navigationBarTitle = 'Whats New';

    let backButton = new ui.BackBarButton();
    backButton.onTap = () => { navigator.pop({ animated : false }); };

    this.navigationBarButtonsLeft = [ backButton ];
  }
}

///////////////////////////////////////////////////////////

globalThis.settings = SettingsManager.getInstance();
if(app.isFirstLaunch) settings.setDefaults();

const navigator = new ui.Navigator({ root: new ScoreBoardPage() });
app.present({ root: navigator });

///////////////////////////////////////////////////////////