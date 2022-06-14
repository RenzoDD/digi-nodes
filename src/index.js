const Crawler = require('./modules/crawler');
Crawler.Checker();

const express = require('express');
const app = express();

app.use(express.json());

app.use('/api', require('./routers/api'));

app.listen(80, () => {
    console.log(`Starting server`);
});