$(document).ready(() => {

    const buildQueryURL = (continent) => {
        let queryURL = "https://api.nytimes.com/svc/suggest/v1/timestags"
        let queryParams = { "api-key": "AkrdEmaGyx36bK8nSbsifiFDqlm4riEY"}
        queryParams.query = continent
        queryParams.filter= "(Geo),(Des)"
        queryParams.max = 10

        return queryURL = $.param(queryParams)
    }

    $('.continent-button').click((event) => {
        event.preventDefault()
        console.log('you clicked on a continent')
        let location = $(this).text()
        let queryURL = buildQueryURL(location)

          $.ajax({
            url: queryURL,
            type: 'GET',
            dataType : 'json',
            success: (data) => {
              console.log('Data received:', data);
              updatePage()
            },
          });
    })

})