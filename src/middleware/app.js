const baseCors = require("cors");

const cors = baseCors({
  origin: "*",
  credentials: true,
});

module.exports = { cors };
