$(document).ready(() => {
  const buildQueryURL = () => {
    //console.log(continent);
    // with glocations, we do not have the most up-to-date articles..specifying pub_year returns very few. I suspect that many articles do not have the glocations tag.
    //let queryURL = `https://api.nytimes.com/svc/search/v2/articlesearch.json?&fq=news_desk:("World") AND glocations:("${continent}") AND pub_year:2019&`

    //problem: it will not take in the continent param. I can make the same request every time, and filter later
    //let queryURL = `http://api.nytimes.com/svc/news/v3/content/nyt/world/${continent}/200.json?limit=20&`

    //Current solution: pull from the same source, sort later. 
    let queryURL = "https://api.nytimes.com/svc/topstories/v2/world.json?&";
    let queryParams = {
      "api-key": "gJOF6WJteVdApUHmGIV5wZ5PaKffv1OA"
    };
    //queryParams.query = continent
    //queryParams.q = continent
    //queryParams.fq= "World"
    console.log(queryURL);
    //queryParams.filter= "(Geo)"
    //queryParams.max = 10

    return queryURL + $.param(queryParams);
  };

  const updatePage = (NYTdata, location) => {
    console.log(NYTdata, location);
    let articleObj = [];
    for (let el of NYTdata) {
      console.log(typeof el.subsection);
      if (el.subsection == location) {
        articleObj.push(el);
      }
    }
    console.log(articleObj);

    articleObj.forEach(element => {
      let $articleList = $("<ul>");
      $articleList.addClass("list-group");
      $("#article-section").append($articleList);

      let headline = element.title;
      let $articleListItem = $("<li class='list-group-item articleHeadline'>");

      if (headline) {
        console.log(headline);
        $articleListItem.append("<strong> " + headline + "</strong>");
      }

      let byline = element.byline;
      if (byline) {
        console.log(byline);
        $articleListItem.append("<h5>" + byline + "</h5>");
      }

      let summary = element.abstract;
      console.log(summary);
      if (summary) {
        $articleListItem.append("<h5>Section: " + summary + "</h5>");
      }

      // Log published date, and append to document if exists
      let pubDate = element.published_date;
      console.log(pubDate);
      if (pubDate) {
        $articleListItem.append("<h5>" + pubDate + "</h5>");
      }

      // Append and log url
      $articleListItem.append(
        `<button class='article_url'">${element.url}</button>`
      );
      console.log(element.url);

      // Append the article
      $articleList.append($articleListItem);

      
    });

      $(".article_url").click(() => {
        let contentURL = $(event.target).text()
        console.log(contentURL)
        // cannot do ajax call here, need web scrapper to get text 
        /* $.ajax({
            url: contentURL,
            type: "GET",
            dataType: "json",
            success: data => {
              console.log("Data received:", data)
              
            }
          }) */
     })
  };

  $(".continent-button").click(event => {
    event.preventDefault()
    $("#article-section").empty()
    let location = $(event.target).text()
    let location_id = event.target.id
    let loc_url = `news/${location_id}`
    console.log(`clicked on ${location_id} button`)
    let queryURL = buildQueryURL()
    console.log(queryURL)
    $.ajax({
      url: loc_url,
      type: "GET",
      dataType: "json",
      success: data => {
        console.log("Data received:", data)
        updatePage(data, location)
      }
    })
  })


  
})
