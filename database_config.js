const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('articles.db');

db.serialize(() => {
  // create a new database table:
  //db.run("DROP TABLE vocabulary;")
  //db.run("DROP TABLE saved_articles;")
  db.run("CREATE TABLE saved_articles (title TEXT, date TEXT, description TEXT, link TEXT)");
  db.run("CREATE TABLE vocabulary (title TEXT, meaning TEXT, syns TEXT, translation TEXT)");
  //db.run("INSERT INTO  saved_articles VALUES ('www.google.com')");
  console.log('successfully created the saved_articles and vocabulary table in articles.db');
  //db.each("SELECT link FROM saved_articles", (err, row) => {
    //console.log(row.link);
//});
});

db.close();
