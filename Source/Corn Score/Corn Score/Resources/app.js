class ScoreBoardPage extends ui.Page
{
  onInit()
  {
    this.navigationBarTitle = 'Corn Score';
  }
}

const navigator = new ui.Navigator({ root: new ScoreBoardPage() });
app.present({ root: navigator });