const express = require('express');
const axios = require("axios")
const app = express();
const request = require('request');
const cheerio = require('cheerio');
const bodyParser = require('body-parser');
const path = require("path");
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('articles.db');
const exphbs = require('express-handlebars');
require('dotenv').config();

app.use(express.static('static_files'));
app.engine('handlebars', exphbs({
  defaultLayout: 'main',
  layoutsDir: __dirname + '/views'
}));
app.set('view engine', 'handlebars');

// access API keys by process.env.[API_key_var_name]
const news_api_key = process.env.NEWS_API_KEY
console.log(news_api_key)
// Scraping not working yet, use a fake article
/* const articleContent = {
    'article': "Article: New York Times does not allow scraping of article, we just have the metadata from API call. Will look into other news API alternatives. A day after his father became the first monarch to abdicate the imperial throne of Japan in more than two centuries, the new emperor, Naruhito, on Wednesday received the sacred imperial regalia that represents his rightful succession to the world’s oldest monarchy.In an eye-blinkingly brief ceremony at the Imperial Palace, Naruhito, 59, officially succeeded Akihito, 85, an enormously popular monarch who brought the royal family much closer to the people as he emphasized a message of peace in a country haunted by the legacy of war."
  }; */

app.get("/", function (req, res) {
  //res.sendFile(path.join(__dirname, "/static_files/index.html"));
  res.render('index')
});
app.get("/archive", function (req, res) {
  db.all('SELECT * FROM saved_articles', (err, rows) => {
    console.log(rows);
    const allLinks = rows.map(e => e.link);
    console.log(allLinks[0]);
    console.log(typeof (allLinks[0]));
    res.render('archive', {
      links: allLinks
    })
  });

});

app.get("/news/:continent", (req, res) => {
  console.log("You hit the /:continent endpoint")
  const location = req.params.continent
  console.log(location)
  // Check which continent, and decide the country endpoints in newsapi we need to include 
  let country = ''
  switch (location) {
    case 'asia':
      country = 'cn'
      break
    case 'africa':
      country = 'za'
      break
    case 'europe':
      country = 'gb'
      break
    case 'middle_east':
      country = 'sa'
      break
    case 'americas':
      country = 'us'
      break
    case 'australia':
      country = 'au'
      break
    default:
      console.log("unidentified continent")
  }

  queryString = `https://newsapi.org/v2/top-headlines?language=en&country=${country}&sortBy=popularity&apiKey=${news_api_key}`
  console.log(queryString)

  /*  axios.get('https://api.nytimes.com/svc/topstories/v2/world.json?&api-key=gJOF6WJteVdApUHmGIV5wZ5PaKffv1OA') */
  axios.get(queryString)
    .then(function (data) {
      console.log(data.data.articles)
      res.render('index', {articles: data.data.articles} )
    })
    .catch(function (error) {
      console.log(error)
    })
})

app.use(bodyParser.urlencoded({
  extended: true
}));
/* app.post('/articles', (req, res) => {
  console.log(req.body)
  let searchURL = req.body.url */
  //Not able to scrape NYT article content, welp. Use fake data for now
  /* request(searchURL, (err, res, body) => {
      const $ = cheerio.load(body)
      let bodyContent = $("section.meteredContent")
      console.log(bodyContent.children)
  }) */

 /*  res.send({
    text: articleContent.article
  })
})
 */
app.post('/archives', (req, res) => {
  console.log(req.body)
  // insert  into the archives database 
  db.run(
    'INSERT INTO saved_articles VALUES ($link)', {
      $link: req.body.link,
    },
    (err) => {
      if (err) {
        res.send({
          message: 'error in app.post(/archives)'
        });
      } else {
        res.send({
          message: 'successfully run app.post(/archives)'
        });
      }
    }
  );
})



app.listen(3000, () => {
  console.log('Server started at http://localhost:3000/')
})