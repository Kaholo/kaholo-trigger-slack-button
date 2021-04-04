# kaholo-trigger-slack-button
Simple trigger for slack buttons webhooks integration with Kaholo.

## How to use:
After installing the trigger on Kaholo,
Follow this [documentation](https://api.slack.com/legacy/message-buttons) to send a request to a webhook through buttons in your slack application.
* Please Notice! Interactive buttons only work when sending the buttons as attachments or as blocks.

## Button Action Trigger
Triggers whenever there is a post request sent from slack buttons.

### Webhook URL:
**{KAHOLO_URL}/webhook/slack/button**

### Parameters:
1. Signing Signature (vault) **Optional** - Your slack signing signature. Used to validate the webhook request sent from slack. Your Slack Signing Signature can be found in slack's app admin panel under Basic Info. 
2. Button Value Pattern (string) **Optional** - Button value or value [minimatch pattern](https://github.com/isaacs/minimatch#readme). If not specified accept any.