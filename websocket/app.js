var TwBot = require('twbot').TwBot;

var TW_OPTION = {
  consumerKey:'',
  consumerSecret: '',
  accessKey: '',
  accessSecret:  ''
};

var bot = new TwBot(TW_OPTION);

//lib/bot.loadPlugin('twbot/lib/plugins/debug');
bot.on('status', function(tweet){
  console.log('%s : %s', tweet.user.screen_name, tweet.text);
});
bot.startUserStream();
