const express = require("express");
const fetch = require("node-fetch");
const { Driver, MetadataAuthService } = require("ydb-sdk");

console.log("test log");
console.log("starting...");

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

let url =
  "http://169.254.169.254/computeMetadata/v1/instance/service-accounts/default/token";
let headers = { "Metadata-Flavor": "Google" };

async function getToken(event) {
  const resp = await fetch(url, {
    headers: headers,
  });
  let respJson = await resp.json();
  return {
    token: respJson["access_token"],
    expiresInSeconds: respJson["expires_in"],
  };
}

const endpoint = "grpcs://ydb.serverless.yandexcloud.net:2135";
const database = "/ru-central1/b1g6i0mgtrt63nhpbko3/etnc9qvcjdtua52m6nfn";
const authService = getToken();

console.log(`authService ${authService}`);
console.log(`authService stringify ${JSON.stringify(authService)}`);

const driver = new Driver({
  endpoint,
  database,
  authService: authService["token"],
});
const timeout = 10000;

if (!(await driver.ready(timeout))) {
  console.log(`Driver has not become ready in ${timeout}ms!`);
  process.exit(1);
}

console.log(`driver ${JSON.stringify(driver)}`);

const session = await driver.tableClient.withSession(
  async (session) => session
);
console.log(`session ${session.sessionId}`);

console.log("end");

app.get("/hello", (req, res) => {
  var ip = req.headers["x-forwarded-for"];
  console.log(`Request from ${ip}`);
  return res.send("Hello!");
});

app.listen(process.env.PORT, () => {
  console.log(`App listening at port ${process.env.PORT}`);
});
