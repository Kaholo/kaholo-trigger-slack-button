const config = require("./config");
const mapExecutionService = require("../../../api/services/map-execution.service");
const Trigger = require("../../../api/models/map-trigger.model");
const crypto = require("crypto");

function findTriggers(validatationFn, arg, body, req, res, method, description) {
  const timeStamp = req.headers['x-slack-request-timestamp'];
  const signature = req.headers['x-slack-signature'];
  const toSign = `v0:${timeStamp}:${getFixedBody(req.body.payload)}`;
  
  Trigger.find({ plugin: config.name, method: method})
    .then((triggers) => {
      console.log(`Found ${triggers.length} triggers`);
      triggers.forEach((trigger) => {
        verifySignature(trigger, toSign, signature)
        validatationFn(trigger, arg)
          .then(exec(trigger, body, req.io, description))
          .catch(console.error);
      });
    })
    .then(() => res.send("OK"))
    .catch((error) => res.send(`ERROR: ${error.toString()}`));
}

function getFixedBody(payload){
  return `payload=${encodeURIComponent(payload).replace(/%20/g, "+").replace(/'/g, "%27")}`;
}

function verifySignature(trigger, toSign, reqSig) {
  const triggerSecret = (trigger.params.find((o) => o.name === "signingSecert").value || "").trim();

  if (triggerSecret) {
    if (!reqSig){
      throw "Signature was not provided by request";
    }
    const hash = "v0=" + crypto.createHmac("sha256", triggerSecret).update(toSign).digest("hex");
    if (hash !== reqSig){
      throw `hash=${hash}\nrequest signature=${reqSig}`;
    }
  }
}

function exec(trigger, body, io, description) {
  return () => {
    console.log(trigger.map);
    const message = `${trigger.name} - ${description}`
    console.log(`******** Slack Button: executing map ${trigger.map} ********`);
    mapExecutionService.execute(
      trigger.map,
      null,
      io,
      { config: trigger.configuration },
      message,
      body
    );
  };
}

module.exports = { findTriggers };
