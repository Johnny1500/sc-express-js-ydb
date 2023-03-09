const express = require('express');
const { MetadataAuthService } = require('ydb-sdk');

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const authService = new MetadataAuthService();

console.log('test log');

app.get("/hello", (req, res) => {
    var ip = req.headers['x-forwarded-for']
    console.log(`Request from ${ip}`);
    console.log(`authService ${authService}`);
    console.log(`authService stringify ${JSON.stringify(obj)}`);
    return res.send("Hello!");
});

app.listen(process.env.PORT, () => {
    console.log(`App listening at port ${process.env.PORT}`);
});
