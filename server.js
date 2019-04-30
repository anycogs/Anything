const express = require('express');
const axios = require("axios")
const app = express();
app.use(express.static('static_files'));

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

app.listen(3000, () => {
    console.log('Server started at http://localhost:3000/')
})