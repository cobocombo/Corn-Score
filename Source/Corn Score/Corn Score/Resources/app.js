class ScoreBoardPage extends ui.Page
{
  onInit()
  {
    this.navigationBarTitle = 'Corn Score';

    let restartButton = new ui.BarButton();
    restartButton.icon = 'ion-ios-refresh';

    let settingsButton = new ui.BarButton();
    settingsButton.icon = 'ion-ios-cog';
    settingsButton.onTap = () => { navigator.push({ page: new SettingsPage() }) };

    this.navigationBarButtonsLeft = [ restartButton ];
    this.navigationBarButtonsRight = [ settingsButton ];
  }
}

class SettingsPage extends ui.Page
{
  onInit()
  {
    this.navigationBarTitle = 'Settings';

    let backButton = new ui.BackBarButton();
    backButton.onTap = () => { navigator.pop(); };

    this.navigationBarButtonsLeft = [ backButton ];

    let settingsList = new ui.List();
    settingsList.addItem({ item: new ui.ListHeader({ text: 'Customize' }) });
    settingsList.addItem({ item: new ui.ListHeader({ text: 'Get Involved' }) });
    settingsList.addItem({ item: new ui.ListHeader({ text: 'App Info' }) });

    this.addComponents({ components: [ settingsList ]});
  }
}

const navigator = new ui.Navigator({ root: new ScoreBoardPage() });
app.present({ root: navigator });