import fetch from "node-fetch";
import express from "express";
import pkg from "ydb-sdk";
const { Driver, TokenAuthService, TypedData } = pkg;
// import { inspect } from "util";

console.log("start");
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const url =
  "http://169.254.169.254/computeMetadata/v1/instance/service-accounts/default/token";
const headers = { "Metadata-Flavor": "Google" };

async function getToken(event) {
  const resp = await fetch(url, {
    headers: headers,
  });
  let respJson = await resp.json();
  return respJson["access_token"];
}

const accessToken = await getToken();
const endpoint = process.env.ENDPOINT;
console.log('endpoint', endpoint);
const database = process.env.DATABASE;
console.log('database', database);

console.log(`accessToken ${accessToken}`);

const authService = new TokenAuthService(accessToken);
console.log("authService", JSON.stringify(authService));

const driver = new Driver({ endpoint, database, authService });
// console.log("Driver", inspect(driver));

await driver.tableClient.withSession(async (session) => {
  async function selectSimple(session) {
    const query = `    
    SELECT * FROM books
   `;
    console.log("Making a simple select...");
    const { resultSets } = await session.executeQuery(query);
    const result = TypedData.createNativeObjects(resultSets[0]);
    console.log(`selectSimple result: ${JSON.stringify(result, null, 2)}`);
  }

  await selectSimple(session);
});

console.log("end");

app.get("/hello", (req, res) => {
  var ip = req.headers["x-forwarded-for"];
  console.log(`Request from ${ip}`);
  return res.send("Hello!");
});

app.listen(process.env.PORT, () => {
  console.log(`App listening at port ${process.env.PORT}`);
});
