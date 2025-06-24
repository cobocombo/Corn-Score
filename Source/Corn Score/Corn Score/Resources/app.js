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
    this.team1Name.text = 'Team 1';
    this.team1Name.fontSize = '30px';
    this.team1Name.style.margin = '0px';
    this.team1Name.style.textAlign = 'center';
    this.team1Name.color = 'white';

    this.team2Name = new ui.Text({ type: 'header-1' });
    this.team2Name.text = 'Team 2';
    this.team2Name.fontSize = '30px';
    this.team2Name.style.margin = '0px';
    this.team1Name.style.textAlign = 'center';
    this.team2Name.color = 'white';

    this.team1NameColumn = new ui.Column();
    this.team1NameColumn.backgroundColor = 'red';
    this.team1NameColumn.width = '50%';
    this.team1NameColumn.onTap = (event) => { this.changeScore({ team: 'team-1', event: event })};
    this.team1NameColumn.addComponents({ components: [ this.team1Name ], center: true });

    this.team2NameColumn = new ui.Column();
    this.team2NameColumn.backgroundColor = 'blue';
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
    this.team1Score.fontSize = '110px';
    this.team1Score.style.margin = '0px';
    this.team1Score.color = 'white';

    this.team2Score = new ui.Text({ type: 'header-1' });
    this.team2Score.text = String(this.team2ScoreAmount);
    this.team2Score.fontSize = '110px';
    this.team2Score.style.margin = '0px';
    this.team2Score.color = 'white';

    this.team1ScoreColumn = new ui.Column();
    this.team1ScoreColumn.backgroundColor = 'red';
    this.team1ScoreColumn.width = '50%';
    this.team1ScoreColumn.onTap = (event) => { this.changeScore({ team: 'team-1', event: event })};
    this.team1ScoreColumn.addComponents({ components: [ this.team1Score ], center: true });

    this.team2ScoreColumn = new ui.Column();
    this.team2ScoreColumn.backgroundColor = 'blue';
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
    this.team1FooterColumn.backgroundColor = 'red';
    this.team1FooterColumn.width = '50%';
    this.team1FooterColumn.onTap = (event) => { this.changeScore({ team: 'team-1', event: event })};

    this.team2FooterColumn = new ui.Column();
    this.team2FooterColumn.backgroundColor = 'blue';
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

class SettingsPage extends ui.Page
{
  onShow()
  {
    this.navigationBarTitle = 'Settings';

    let backButton = new ui.BackBarButton();
    backButton.onTap = () => { navigator.pop({ animated : false }); };

    this.navigationBarButtonsLeft = [ backButton ];

    let team1Texfield = new ui.Textfield();
    team1Texfield.underbar = false;
    team1Texfield.text = 'Team 1';

    let team2Texfield = new ui.Textfield();
    team2Texfield.underbar = false;
    team2Texfield.text = 'Team 2';

    let team1ColorPicker = new ui.ColorPicker();
    team1ColorPicker.color = '#FF0000';

    let team2ColorPicker = new ui.ColorPicker();
    team2ColorPicker.color = '#0000FF';

    let textColorPicker = new ui.ColorPicker();
    textColorPicker.color = '#FFFFFF';

    let textSizeSelctor = new ui.Selector();
    textSizeSelctor.options = ['Small','Medium','Large'];
    textSizeSelctor.underbar = false;
    
    let settingsList = new ui.List();
    settingsList.addItem({ item: new ui.ListHeader({ text: 'Customize' }) });
    settingsList.addItem({ item: new ui.ListItem({ left: new ui.Icon({ icon: 'ion-ios-person', size: '32px' }), center: team1Texfield, right: team1ColorPicker  }) });
    settingsList.addItem({ item: new ui.ListItem({ left: new ui.Icon({ icon: 'ion-ios-person', size: '32px' }), center: team2Texfield, right: team2ColorPicker }) });
    settingsList.addItem({ item: new ui.ListItem({ left: new ui.Icon({ icon: 'ion-ios-color-palette', size: '32px' }), center: 'Text Color', right: textColorPicker }) });
    settingsList.addItem({ item: new ui.ListItem({ left: new ui.Icon({ icon: 'ion-ios-document', size: '32px' }), center: 'Text Size', right: textSizeSelctor }) });
    settingsList.addItem({ item: new ui.ListItem({ left: new ui.Icon({ icon: 'ion-ios-refresh', size: '32px' }), center: 'Reset To Default', tappable: true }) });

    settingsList.addItem({ item: new ui.ListHeader({ text: 'Get Involved' }) });
    settingsList.addItem({ item: new ui.ListItem({ left: new ui.Icon({ icon: 'ion-logo-github', size: '32px' }), center: 'Source Code', tappable: true, modifiers: ['chevron'] }) });
    settingsList.addItem({ item: new ui.ListItem({ left: new ui.Icon({ icon: 'ion-ios-bug', size: '32px' }), center: 'Report A Bug', tappable: true, modifiers: ['chevron'] }) });
    settingsList.addItem({ item: new ui.ListItem({ left: new ui.Icon({ icon: 'ion-ios-add-circle', size: '32px' }), center: 'Request A Feature', tappable: true, modifiers: ['chevron'] }) });
    settingsList.addItem({ item: new ui.ListItem({ left: new ui.Icon({ icon: 'ion-ios-cafe', size: '32px' }), center: 'Buy Me A Coffee', tappable: true, modifiers: ['chevron'] }) });

    settingsList.addItem({ item: new ui.ListHeader({ text: 'App Info' }) });
    settingsList.addItem({ item: new ui.ListItem({ left: new ui.Icon({ icon: 'ion-ios-information-circle', size: '32px' }), center: 'Version: 1.5' }) });
    settingsList.addItem({ item: new ui.ListItem({ left: new ui.Icon({ icon: 'ion-ios-heart', size: '32px' }), center: 'Rate Corn Score', tappable: true, modifiers: ['chevron'] }) });
    settingsList.addItem({ item: new ui.ListItem({ left: new ui.Icon({ icon: 'ion-ios-star', size: '32px' }), center: "What's New", tappable: true, modifiers: ['chevron'] }) });

    this.addComponents({ components: [ settingsList ]});
  }
}

const navigator = new ui.Navigator({ root: new ScoreBoardPage() });
app.present({ root: navigator });