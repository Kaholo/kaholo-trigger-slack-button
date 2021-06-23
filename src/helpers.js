const crypto = require("crypto");

function getFixedBody(payload){
  return `payload=${encodeURIComponent(payload).replace(/%20/g, "+").replace(/'/g, "%27")}`;
}

function verifySignature(req, trigger) {
  const triggerSecret = (trigger.params.signingSecert || "").trim();
  if (!triggerSecret) return true;
  const reqSig = req.headers['x-slack-signature'];
  const timeStamp = req.headers['x-slack-request-timestamp'];
  const toSign = `v0:${timeStamp}:${getFixedBody(req.body.payload)}`;

  const hash = "v0=" + crypto.createHmac("sha256", triggerSecret).update(toSign).digest("hex");
  return hash === reqSig;
}

module.exports = { verifySignature };
