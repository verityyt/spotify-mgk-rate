let calcBtn = document.getElementById("calcBtn")
let authBtn = document.getElementById("authBtn")

let token = new URLSearchParams(window.location.search).get("token")

if(token != null) {
    console.log(token)
}

if (calcBtn != null) {
    calcBtn.addEventListener("click", () => {

        let textField = document.getElementById("textfield") as HTMLInputElement
        let content = document.getElementById("content") as HTMLParagraphElement

        if (textField != null) {
            let value = textField.value
            if (matchesURL(value)) {
                let split = value.split("/")
                let id = split[split.length - 1].split("?")[0]

                call(textField, content, value, id)
            }else if(matchesURI(value)) {
                let split = value.split(":")
                let id = split[split.length - 1]

                call(textField, content, value, id)
            } else {
                console.log("Invalid url")
            }


            textField.value = ""
        }

    })
}

if(authBtn != null) {
    authBtn.addEventListener("click", () => {
        window.location.href = "http://localhost:3030/login"
    })
}

function call(textField: HTMLInputElement, content: HTMLParagraphElement, value: String, id: String) {

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

        textContent += `<br><br><u>Songs made by other artists:</u>`

        for (let i = 0; i < otherSongs.length; i++) {
            let curTrack = otherSongs[i]
            let name = curTrack.name
            let artist = curTrack.artists.join(", ")

            textContent += `<br>${i + 1}. ${name} from ${artist}`
        }

        content.innerHTML = textContent
    })
}

function matchesURL(str) {
    const pattern = RegExp('^(https:\\/\\/open.spotify.com\\/playlist\\/(.+))')
    return pattern.test(str)
}

function matchesURI(str) {
    const pattern = RegExp('^(spotify[\\/:]playlist(.+))')
    return pattern.test(str)
}