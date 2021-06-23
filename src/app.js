const { verifySignature } = require(`./helpers`);
const minimatch = require("minimatch");

async function webhookButton(req, res, settings, triggerControllers) {
  if (!triggerControllers) {
    return res.status(400).send("triggers cannot be nil");
  }
  if (req.body.challenge){
    return res.status(200).send(req.body.challenge);
  }
  try {
    const body = JSON.parse(req.body.payload);
    if (body.type !== "interactive_message") return res.status(400).send("not an interactive message");
    const buttons = body.actions.filter(act => act.type === "button");
    
    triggerControllers.forEach(trigger => {
      if (!verifySignature(req, trigger)) return;
      const {valuePat} = trigger.params;
      buttons.forEach(button => {
        if (valuePat && !minimatch(button.value, valuePat)) return;
        trigger.execute(`Slack Button "${button.value}"`, button);
      })
    });
    res.status(200).send("OK");
  }
  catch (err){
    res.status(422).send(err.message);
  }
}

module.exports = { 
  webhookButton
};