$(document).ready(() => {
    $("#dictionary").hide()
    $("#dict-button").click(event => {
        event.preventDefault()
        $("#word-meaning").empty()
        lookupword = $("#dict-box").val()
        console.log(lookupword)
        $.get(`https://www.dictionaryapi.com/api/v3/references/thesaurus/json/${lookupword}?key=4dc43c31-b7b2-4f24-81e3-3beec40a5906`, function (data) {
            console.log(data)
            if (data[0].shortdef) {
                $("#word-meaning").append(`<p>Meaning: ${data[0].shortdef[0]}</p>`)
            } else {
                $("#word-meaning").append(`<p>${lookupword} is not found in our English dictionary</p>`)
            }
        })
        $.get(`https://translate.yandex.net/api/v1.5/tr.json/translate?key=trnsl.1.1.20190501T072650Z.c012f8eef4eff635.e609a17a0470a925851de9a2a0b56bf9f0641315&text=${lookupword}&lang=en-zh`, function (data) {
            console.log(data.text[0])
            if (data.text[0].match(/[a-z]/i)) {
                $("#word-meaning").append(`<p>no Chinese for ${lookupword}</p>`)
            } else {
                $("#word-meaning").append(`<p>In Chinese: ${data.text[0]}</p>`)
            }
        })
    })

    $("#reset-button").click(event => {
        event.preventDefault()
        $("#dict-box").val('')
        $("#word-meaning").empty()
    })


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

        articleObj.forEach((element, index) => {
            let $articleList = $("<ul>");
            let $articleContent = $("<div>");
            $articleList.addClass("list-group");
            $articleContent.addClass("articleContent")
            $articleContent.attr('id', `article${index}`)
            $("#article-section").append($articleList);
            $("#article-section").append($articleContent);

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
                $articleListItem.append("<h5>Summary: " + summary + "</h5>");
            }

            // Log published date, and append to document if exists
            let pubDate = element.published_date;
            console.log(pubDate);
            if (pubDate) {
                $articleListItem.append("<h5>" + pubDate + "</h5>");
            }

            // Append and log url
            $articleListItem.append(
                `<button id='btn${index}' class='article_url'">${element.url}</button>`
            );
            console.log(element.url);

            // Append the article
            $articleList.append($articleListItem);


        });

        $(".article_url").click(() => {
            let contentURL = $(event.target).text()
            // get the index of the button, use it to find the right div to display article 
            let position = event.target.id.slice(3)
            let divName = `article${position}`
            // sending url to backend 
            $.ajax({
                url: 'articles',
                type: 'POST',
                data: {
                    url: contentURL
                },
                success: (data) => {
                    //display the article content 
                    console.log(data.text)
                    //showFullArticle(data.text)
                    $(".articleContent").empty()
                    $(`#${divName}`).append(`<p>${data.text}</p>`)
                    //get translation 
                    $.get(`https://translate.yandex.net/api/v1.5/tr.json/translate?key=trnsl.1.1.20190501T072650Z.c012f8eef4eff635.e609a17a0470a925851de9a2a0b56bf9f0641315&text=${data.text}&lang=en-zh`, function (data) {
                        console.log(data.text[0])
                        $(`#${divName}`).append(`<p>${data.text[0]}</p>`)
                    })

                }
            });
        })
    };

    /* const showFullArticle = text => {
      $(".show-content").empty()
        $(".show-content").append(`<p>${text}</p>`)
    } */

    $(".continent-button").click(event => {
        event.preventDefault()
        $("#dictionary").show()
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