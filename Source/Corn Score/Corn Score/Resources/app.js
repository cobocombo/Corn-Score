class ScoreBoardPage extends ui.Page
{
  onShow()
  {
    this.setupNavBar();
    this.setupNameRow();
    this.setupScoreRow();
    this.setupFooterRow();

    console.log('Showing...')
  }

  setupNavBar()
  {
    this.navigationBarTitle = 'Corn Score';

    let restartButton = new ui.BarButton();
    restartButton.icon = 'ion-ios-refresh';

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

    let team1NameColumn = new ui.Column();
    team1NameColumn.backgroundColor = 'red';
    team1NameColumn.width = '50%';
    team1NameColumn.addComponents({ components: [ this.team1Name ], center: true });

    let team2NameColumn = new ui.Column();
    team2NameColumn.backgroundColor = 'blue';
    team2NameColumn.width = '50%';
    team2NameColumn.addComponents({ components: [ this.team2Name ], center: true });

    this.nameRow = new ui.Row();
    this.nameRow.height = '25%';
    this.nameRow.addColumn({ column: team1NameColumn });
    this.nameRow.addColumn({ column: team2NameColumn });

    this.addComponents({ components: [ this.nameRow ]});
  }

  setupScoreRow()
  {
    this.team1Score = new ui.Text({ type: 'header-1' });
    this.team1Score.text = '0';
    this.team1Score.fontSize = '110px';
    this.team1Score.style.margin = '0px';
    this.team1Score.color = 'white';

    this.team2Score = new ui.Text({ type: 'header-1' });
    this.team2Score.text = '0';
    this.team2Score.fontSize = '110px';
    this.team2Score.style.margin = '0px';
    this.team2Score.color = 'white';

    let team1ScoreColumn = new ui.Column();
    team1ScoreColumn.backgroundColor = 'red';
    team1ScoreColumn.width = '50%';
    team1ScoreColumn.addComponents({ components: [ this.team1Score ], center: true });

    let team2ScoreColumn = new ui.Column();
    team2ScoreColumn.backgroundColor = 'blue';
    team2ScoreColumn.width = '50%';
    team2ScoreColumn.addComponents({ components: [ this.team2Score ], center: true });

    this.scoreRow = new ui.Row();
    this.scoreRow.height = '50%';
    this.scoreRow.addColumn({ column: team1ScoreColumn });
    this.scoreRow.addColumn({ column: team2ScoreColumn });

    this.addComponents({ components: [ this.scoreRow ]});
  }

  setupFooterRow()
  {
    let team1FooterColumn = new ui.Column();
    team1FooterColumn.backgroundColor = 'red';
    team1FooterColumn.width = '50%';

    let team2FooterColumn = new ui.Column();
    team2FooterColumn.backgroundColor = 'blue';
    team2FooterColumn.width = '50%';

    this.footerRow = new ui.Row();
    this.footerRow.height = '25%';
    this.footerRow.addColumn({ column: team1FooterColumn });
    this.footerRow.addColumn({ column: team2FooterColumn });

    this.addComponents({ components: [ this.footerRow ]});
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

    console.log('Settings...')
  }
}

const navigator = new ui.Navigator({ root: new ScoreBoardPage() });
app.present({ root: navigator });