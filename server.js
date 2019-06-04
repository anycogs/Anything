const express = require('express');
const axios = require("axios")
const app = express();
const bodyParser = require('body-parser');
const path = require("path");
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('articles.db');
const exphbs = require('express-handlebars');
require('dotenv').config();
const moment = require('moment')

app.use(express.static('static_files'));
app.engine('handlebars', exphbs({
  defaultLayout: 'main',
  layoutsDir: __dirname + '/views'
}));
app.set('view engine', 'handlebars');

// access API keys by process.env.[API_key_var_name]
const news_api_key = process.env.NEWS_API_KEY
console.log(news_api_key)

app.get("/", function (req, res) {
  //res.sendFile(path.join(__dirname, "/static_files/index.html"));
  res.render('index')
});

app.get("/archive", function (req, res) {
  db.all('SELECT * FROM saved_articles', (err, rows) => {
    console.log(rows);
    res.render('archive', {articles: rows
    })
  });
});

app.get("/vocabulary", function (req, res) {
  db.all('SELECT * FROM vocabulary', (err, rows) => {
    console.log(rows);
    res.render('vocabulary', {vocab: rows
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
      country = 'asia OR china OR japan OR india OR korea'
      break
    case 'africa':
      country = 'africa OR nigeria OR morocco OR ethiopia OR africa'
      break
    case 'europe':
      country = 'europe OR EU or britain OR france OR germany'
      break
    case 'middle_east':
      country = 'middle east OR iran OR Iraq OR syria OR saudi'
      break
    case 'americas':
      country = 'united states OR america OR latin america'
      break
    case 'australia':
      country = 'australia'
      break
    default:
      console.log("unidentified continent")
  }

  queryString = `https://newsapi.org/v2/everything?sortBy=publishedAt&language=en&q=${country}&apiKey=${news_api_key}`
  console.log(queryString)

  /*  axios.get('https://api.nytimes.com/svc/topstories/v2/world.json?&api-key=gJOF6WJteVdApUHmGIV5wZ5PaKffv1OA') */
  
  axios.get(queryString)
    .then(function (data) {
      console.log("*****************************************************************" + JSON.parse(JSON.stringify(data.data.articles)))
      //convert time format
      data.data.articles.forEach(function(doc){
        console.log(doc.publishedAt)
        doc.publishTime = moment(doc.publishedAt).format('YYYY-MM-DD HH:mm')
        console.log(doc)
      });
      res.render('articles', {articles: data.data.articles} )
    })
    .catch(function (error) {
      /* console.log(error) */
    })
})

app.use(bodyParser.urlencoded({
  extended: true
}));

app.post('/archive', (req, res) => {
  console.log(req.body)
  // insert  into the archives database 
  db.run(
    'INSERT INTO saved_articles VALUES ($title, $date, $description, $link)', {
      $title: req.body.title,
      $date: req.body.date,
      $description: req.body.description,
      $link: req.body.link
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

app.post('/vocabulary', (req, res) => {
  console.log(req.body)
  // insert  into the archives database 
  db.run(
    'INSERT INTO vocabulary VALUES ($title, $meaning, $syns, $translation)', {
      $title: req.body.title,
      $meaning: req.body.meaning,
      $syns: req.body.syns,
      $translation: req.body.translation
    },
    (err) => {
      if (err) {
        res.send({
          message: 'error in app.post(/vocabulary)'
        });
      } else {
        res.send({
          message: 'successfully run app.post(/vocabulary)'
        });
      }
    }
  );
})

app.delete('/vocabulary', (req, res) => {
  db.run(
    'DELETE FROM vocabulary WHERE title=$title',
    {
      $title: req.body.title
    },
    (err) => {
      if (err) {
        res.send({message: 'error in app.delete(/vocabulary)'});
      } else {
        res.send({message: 'successfully run app.delete(/vocabulary)'});
      }
    }
  )
})

app.delete('/archive', (req, res) => {
  db.run(
    'DELETE FROM saved_articles WHERE title=$title',
    {
      $title: req.body.title
    },
    (err) => {
      if (err) {
        res.send({message: 'error in app.delete(/archive)'});
      } else {
        res.send({message: 'successfully run app.delete(/archive)'});
      }
    }
  )
})



app.listen(3000, () => {
  console.log('Server started at http://localhost:3000/')
})
