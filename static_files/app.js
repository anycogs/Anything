$(document).ready(() => {
    //$("#dictionary").hide()
    $("#dict-button").click(event => {
        event.preventDefault()
        lookupword = $("#dict-box").val()
        if (lookupword) {
            $('#dictModal').modal()
            $('#added_vocab').addClass("invisible")
            $('#saveVocab').removeAttr("disabled");
        }
        $("#word-meaning").empty()
        $(".modal-title").empty()
        $(".modal-title").append(lookupword)
        $(".modal-body").empty()
        $.get(`https://www.dictionaryapi.com/api/v3/references/thesaurus/json/${lookupword}?key=4dc43c31-b7b2-4f24-81e3-3beec40a5906`, function (data) {
            console.log(data)
            if (data[0].shortdef) {
                $(".modal-body").append(`<p class='meaning'>Meaning: ${data[0].shortdef[0]}</p>
                <p class='syns'>Synonyms: ${data[0].meta.syns[0].slice(0,3)} </p>`)
            } else {
                $(".modal-body").append(`<p>${lookupword} is not found in our English dictionary</p>`)
            }
        })
        $.get(`https://translate.yandex.net/api/v1.5/tr.json/translate?key=trnsl.1.1.20190501T072650Z.c012f8eef4eff635.e609a17a0470a925851de9a2a0b56bf9f0641315&text=${lookupword}&lang=en-zh`, function (data) {
            console.log(data.text[0])
            if (data.text[0].match(/[a-z]/i)) {
                $(".modal-body").append(`<p>no Chinese translation for ${lookupword}</p>`)
            } else {
                $(".modal-body").append(`<p class='translated'>In Chinese: ${data.text[0]}</p>`)
            }
        })
    })

    $("#saveVocab").click(event => {
        event.preventDefault()
        let title = $(".modal-title").text()
        let meaning = $(".meaning").text()
        let syns = $(".syns").text()
        let translated = $(".translated").text()
        $.ajax({
            url: '/vocabulary',
            type: "POST",
            dataType: "json",
            data: {
                title: title,
                meaning: meaning,
                syns: syns,
                translation: translated
            },
            success: data => {
                console.log("save into archive status:", data)
                // right now the color change does not persist
                $('#added_vocab').removeClass("invisible")
                //disable the add button 
                $('#saveVocab').attr('disabled', 'disabled')
            }
        })
    })

    $("#reset-button").click(event => {
        $("#dict-box").val("")
    })


    $(".article_url").click(() => {
        let contentURL = $(event.target).text()
        // get the index of the button, use it to find the right div to display article 
        let position = event.target.id.slice(3)
        let articleDiv = `content${position}`
        let translateDiv = `translate${position}`
        console.log(articleDiv)
        //$(`#${articleDiv}`).removeClass("invisible").addClass("visible")
        let articleText = $(`#${articleDiv}`).text()
        console.log(articleText)
        // next version:sending url to backend, which calls database, and send the scrapped contents back. For now, it is getting the fake article back from the backend 
        //get translation from Yandex API
        $.get(`https://translate.yandex.net/api/v1.5/tr.json/translate?key=trnsl.1.1.20190501T072650Z.c012f8eef4eff635.e609a17a0470a925851de9a2a0b56bf9f0641315&text=${articleText}&lang=en-zh`, function (data) {
            console.log(data.text[0])
            $(`#${translateDiv}`).append(`<p>${data.text[0]}</p>`)
            //$(`#${translateDiv}`).removeClass("invisible").addClass("visible")

        })
    })

    $(".save-btn").click(() => {
        let position = event.target.id.slice(3)
        console.log(position)
        let saveURL = $(`#url${position}`).text()
        let saveTitle = $(`#title${position}`).text()
        let saveDate = $(`#date${position}`).text()
        let saveDescription = $(`#description${position}`).text()
        console.log(saveURL, saveTitle, saveDate, saveDescription)
        // get the info on targeted articles, post to archives. 
        $.ajax({
            url: '/archives',
            type: "POST",
            dataType: "json",
            data: {
                title: saveTitle,
                date: saveDate,
                description: saveDescription,
                link: saveURL
            },
            success: data => {
                console.log("save into archive status:", data)
                // right now the color change does not persist
                $(`#btn${position}`).css('background-color', "green")
            }
        })
    })

    $(".delete_flashcard").click(() => {
        let targetTitle = $("#flash_title").text()
        $.ajax({
            url: '/vocabulary',
            type: "DELETE",
            dataType: "json",
            data: {
                title: targetTitle
            },
            success: data => {
                console.log("save into archive status:", data)
                //page reload?
                location.reload()
            }
        })
    })
})