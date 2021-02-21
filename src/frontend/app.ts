let button = document.getElementById("button")

if (button != null) {
    button.addEventListener("click", () => {

        let textField = document.getElementById("textfield") as HTMLInputElement
        let content = document.getElementById("content") as HTMLParagraphElement

        if (textField != null) {
            let value = textField.value

            if (validURL(value)) {
                let split = value.split("/")
                let id = split[split.length - 1].split("?")[0]

                fetch(`http://localhost:3030/playlist?id=${id}`, {
                    method: 'GET',
                    mode: 'cors',
                    headers: {
                        'content-type': 'application/json'
                    }
                }).then(response => response.json()).then(data => {
                    let body = data.body
                    let mgkSongs = data.body.mgkSongs
                    let otherSongs = data.body.otherSongs

                    let textContent = `Rate: ${body.rate}%<br><br><u>Songs made by Machine Gun Kelly:</u>`

                    for (let i = 0; i < mgkSongs.length; i++) {
                        let curTrack = mgkSongs[i]
                        let name = curTrack.name
                        let artist = curTrack.artists.join(", ")

                        textContent += `<br>${i + 1}. ${name} from ${artist}`
                    }

                    textContent+=`<br><br><u>Songs made by other artists:</u>`

                    for (let i = 0; i < otherSongs.length; i++) {
                        let curTrack = otherSongs[i]
                        let name = curTrack.name
                        let artist = curTrack.artists.join(", ")

                        textContent += `<br>${i + 1}. ${name} from ${artist}`
                    }

                    content.innerHTML = textContent
                })

            } else {
                console.log("Invalid url")
            }


            textField.value = ""
        }

    })
}

function validURL(str) {
    const pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
        '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
    return pattern.test(str);
}