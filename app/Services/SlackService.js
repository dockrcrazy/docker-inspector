const Slack = require('slack-node');

let slack = null;
const slackParameters = {
    webhook: process.env.DI_SLACK_WEBHOOK,
    channel: process.env.DI_SLACK_CHANNEL,
    username: process.env.DI_SLACK_USERNAME
};

function initSlack() {
    if (slackParameters.webhook != null && slackParameters.webhook !== '') {
        slack = new Slack();
        slack.setWebhook(slackParameters.webhook);
    }

}


initSlack();

module.exports = {
    sendMessage: function (message) {
        if(slack = null){
            throw "DI_SLACK_WEBHOOK environment variable not set and mandatory"
        }

        let options = {
            text: message
        };

        if(slackParameters.channel !== ''){
            options.channel = slackParameters.channel
        }
        if(slackParameters.username !== ''){
            options.username = slackParameters.username
        }

        slack.webhook(options, (err, response) => {
            if(err){
                throw err;
            }
        });
    }
};