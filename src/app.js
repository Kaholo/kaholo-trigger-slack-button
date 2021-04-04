const { findTriggers } = require(`./helpers`);
const minimatch = require("minimatch");

async function webhookButton(req, res) {
  if (req.body.challenge){
    return res.send(req.body.challenge);
  }
  const body = JSON.parse(req.body.payload);
  
  if (body.type !== "interactive_message"){
    res.send("ERROR");
    throw "not an interactive message";
  }
  const btnValues = body.actions.filter(act => act.type === "button").map(act => act.value);

  findTriggers(
    validateTrigger,
    btnValues,
    body,
    req, res,
    "webhookButton",
    `buttons ${btnValues.join(", ")}`
  );
}

async function validateTrigger(trigger, btnValues) {
  const valPat = (trigger.params.find((o) => o.name === `valuePat`).value || "").trim();

  // Check if the value pattern was provided, and if so check it matches request
  if (valPat && !btnValues.some(val => minimatch(val, valPat))) {
    throw `No matching button value`;
  }

  return true;
}

module.exports = { 
  webhookButton
};