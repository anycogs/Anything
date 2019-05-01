const express = require('express');
const axios = require("axios")
const app = express();
const request = require('request'); 
const cheerio = require('cheerio'); 
const bodyParser = require('body-parser');

app.use(express.static('static_files'));

// Scraping not working yet, use a fake article
const articleContent = {
    'article': "Placeholder data | A day after his father became the first monarch to abdicate the imperial throne of Japan in more than two centuries, the new emperor, Naruhito, on Wednesday received the sacred imperial regalia that represents his rightful succession to the world’s oldest monarchy.In an eye-blinkingly brief ceremony at the Imperial Palace, Naruhito, 59, officially succeeded Akihito, 85, an enormously popular monarch who brought the royal family much closer to the people as he emphasized a message of peace in a country haunted by the legacy of war."
  };

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
app.post("/articles", (req, res) => {
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



app.listen(3000, () => {
    console.log('Server started at http://localhost:3000/')
})