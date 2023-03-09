import fetch from "node-fetch";
import express from "express";

console.log("start");
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

const Authtoken = await getToken();

console.log(`Authtoken ${JSON.stringify(Authtoken)}`);
// console.log(`token ${JSON.stringify(Authtoken["token"])}`);

console.log("end");

app.get("/hello", (req, res) => {
  var ip = req.headers["x-forwarded-for"];
  console.log(`Request from ${ip}`);
  return res.send("Hello!");
});

app.listen(process.env.PORT, () => {
  console.log(`App listening at port ${process.env.PORT}`);
});
