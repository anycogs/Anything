const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('articles.db');


db.serialize(() => {
  // create a new database table:
  db.run("CREATE TABLE saved_articles (link TEXT)");
  db.run("INSERT INTO  saved_articles VALUES ('www.google.com')");
  console.log('successfully created the users_to_pets table in pets.db');
  db.each("SELECT link FROM saved_articles", (err, row) => {
    console.log(row.link);
});
});

db.close();
