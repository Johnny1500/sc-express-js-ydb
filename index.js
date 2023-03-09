const express = require('express');
const { Driver, MetadataAuthService } = require('ydb-sdk');

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

console.log('test log');

const endpoint = "grpcs://ydb.serverless.yandexcloud.net:2135";
const database = "/ru-central1/b1g6i0mgtrt63nhpbko3/etnc9qvcjdtua52m6nfn"
const authService = new MetadataAuthService();

const driver = new Driver({ endpoint, database, authService });
const timeout = 10000;
if (!(await driver.ready(timeout))) {
  logger.fatal(`Driver has not become ready in ${timeout}ms!`);
  process.exit(1);
}

const session = await driver.tableClient.withSession(async(session) => session);

app.get("/hello", (req, res) => {
    var ip = req.headers['x-forwarded-for']
    console.log(`Request from ${ip}`);
    console.log(`authService ${authService}`);
    console.log(`authService stringify ${JSON.stringify(authService)}`);
    console.log(`session ${session.sessionId}`);

    return res.send("Hello!");
});

app.listen(process.env.PORT, () => {
    console.log(`App listening at port ${process.env.PORT}`);
});
