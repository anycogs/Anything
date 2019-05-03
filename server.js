const express = require('express');
const axios = require("axios")
const app = express();
const request = require('request'); 
const cheerio = require('cheerio'); 
const bodyParser = require('body-parser');
const path = require("path");
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('articles.db');
const exphbs  = require('express-handlebars');

app.use(express.static('static_files'));
app.engine('handlebars', exphbs({defaultLayout: 'main', layoutsDir:__dirname + '/views'}));
app.set('view engine', 'handlebars');

// Scraping not working yet, use a fake article
const articleContent = {
    'article': "Article: New York Times does not allow scraping of article, we just have the metadata from API call. Will look into other news API alternatives. A day after his father became the first monarch to abdicate the imperial throne of Japan in more than two centuries, the new emperor, Naruhito, on Wednesday received the sacred imperial regalia that represents his rightful succession to the world’s oldest monarchy.In an eye-blinkingly brief ceremony at the Imperial Palace, Naruhito, 59, officially succeeded Akihito, 85, an enormously popular monarch who brought the royal family much closer to the people as he emphasized a message of peace in a country haunted by the legacy of war."
  };

  app.get("/", function(req, res) {
    //res.sendFile(path.join(__dirname, "/static_files/index.html"));
    res.render('index')
  });
  app.get("/archive", function(req, res) {
    db.all('SELECT * FROM saved_articles', (err, rows) => {
        console.log(rows);
        const allLinks = rows.map(e => e.link);
        console.log(allLinks);
        res.render('archive', {link: allLinks})
      });
    
  });

app.get("/news/:continent", (req, res) => {
    console.log("You hit the /:continent endpoint")
    const location = req.params.continent
    console.log(location)

    axios.get('https://api.nytimes.com/svc/topstories/v2/world.json?&api-key=gJOF6WJteVdApUHmGIV5wZ5PaKffv1OA')
        .then(function (data) {
            console.log(data.data.results)
            res.send(data.data.results)
        })
        .catch(function (error) {
            console.log(error)
        })
})

app.use(bodyParser.urlencoded({extended: true}));
app.post('/articles', (req, res) => {
        console.log(req.body)
        let searchURL = req.body.url
    //Not able to scrape NYT article content, welp. Use fake data for now
        /* request(searchURL, (err, res, body) => {
            const $ = cheerio.load(body)
            let bodyContent = $("section.meteredContent")
            console.log(bodyContent.children)
        }) */

        res.send({text:articleContent.article})
})

app.post('/archives', (req, res) => {
    console.log(req.body)
    // insert  into the archives database 
    db.run(
        'INSERT INTO saved_articles VALUES ($link)',
        {
          $link: req.body.link,
        },
        (err) => {
          if (err) {
            res.send({message: 'error in app.post(/archives)'});
          } else {
            res.send({message: 'successfully run app.post(/archives)'});
          }
        }
      );
})



app.listen(3000, () => {
    console.log('Server started at http://localhost:3000/')
})