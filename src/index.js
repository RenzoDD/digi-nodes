const Crawler = require('./modules/crawler');
//Crawler.Checker();

const express = require('express');
const app = express();

app.use(express.static(__dirname + '/assets'));
app.use(express.json());

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views')

app.use('/', require('./routers/website'));
app.use('/api', require('./routers/api'));

app.listen(80, () => {
    console.log(`Starting server`);
});