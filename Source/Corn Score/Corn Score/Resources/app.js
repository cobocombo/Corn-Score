class ScoreBoardPage extends ui.Page
{
  onInit()
  {
    this.navigationBarTitle = 'Corn Score';

    let restartButton = new ui.BarButton();
    restartButton.icon = 'ion-ios-refresh';

    let settingsButton = new ui.BarButton();
    settingsButton.icon = 'ion-ios-cog';
    settingsButton.onTap = () => { navigator.push({ page: new SettingsPage(), animated : false }) };

    this.navigationBarButtonsLeft = [ restartButton ];
    this.navigationBarButtonsRight = [ settingsButton ];

    let team1Name = new ui.Text({ type: 'header-2' });
    team1Name.text = 'Team 1';
    team1Name.color = 'white';
    team1Name.y = '200px';

    let team1Score = new ui.Text({ type: 'header-1' });
    team1Score.text = '0';
    team1Score.color = 'white';
    team1Score.y = '250px';

    let team2Name = new ui.Text({ type: 'header-2' });
    team2Name.text = 'Team 2';
    team2Name.color = 'white';
    team2Name.y = '200px';

    let team2Score = new ui.Text({ type: 'header-1' });
    team2Score.text = '0';
    team2Score.color = 'white';
    team2Score.y = '250px';

    let team1Side = new ui.Column();
    team1Side.backgroundColor = 'red';
    team1Side.width = '50%';
    team1Side.addComponents({ components: [ team1Name, team1Score ], center: true });

    let team2Side = new ui.Column();
    team2Side.backgroundColor = 'blue';
    team2Side.width = '50%';
    team2Side.addComponents({ components: [ team2Name, team2Score ], center: true });

    let row = new ui.Row();
    row.height = '100%';
    row.addColumn({ column: team1Side });
    row.addColumn({ column: team2Side });

    this.addComponents({ components: [ row ]});

    window.addEventListener("orientationchange", () => 
    {
      const orientation = window.orientation; // -90, 0, 90, etc.
      console.log("Device orientation changed to:", orientation);

      if (orientation === 90 || orientation === -90) {
        console.log("Landscape mode");
      } else {
        console.log("Portrait mode");
      }
    });

  }
}

class SettingsPage extends ui.Page
{
  onInit()
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