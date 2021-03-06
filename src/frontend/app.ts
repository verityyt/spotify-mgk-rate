let calcBtn = document.getElementById("calcBtn") as HTMLInputElement
let authBtn = document.getElementById("authBtn") as HTMLInputElement

let textField = document.getElementById("textfield") as HTMLInputElement
let content = document.getElementById("content") as HTMLParagraphElement
let title = document.getElementById("title") as HTMLParagraphElement
let image = document.getElementById("image") as HTMLImageElement

let error = document.getElementById("error") as HTMLParagraphElement

let token = new URLSearchParams(window.location.search).get("token")

if (token != null) {
    authBtn.style.display = "none"
    calcBtn.style.display = "inline"

    textField.style.display = "inline"
    content.style.display = "inline"
    title.style.display = "inline"

    setTimeout(() => {
        alert("Token expired!\nPlease reauthenticate with spotify")
        window.location.assign("http://localhost:63342/spotify-mgk-rate/src/frontend/index.html?_ijt=l8oua3o2pgatt5d75kam79vchi")
    },15 * 60 * 1000)
}

calcBtn.addEventListener("click", () => {
    if (token != null) {
        let value = textField.value
        if (matchesURL(value)) {
            let split = value.split("/")
            let id = split[split.length - 1].split("?")[0]


            error.textContent = ""
            call(textField, content, value, id)
        } else if (matchesURI(value)) {
            let split = value.split(":")
            let id = split[split.length - 1]

            error.textContent = ""
            call(textField, content, value, id)
        } else {
            error.textContent = "Invalid url or uri!"
        }


        textField.value = ""
    }
})

authBtn.addEventListener("click", () => {
    window.location.href = "http://localhost:3030/login"
})

function call(textField: HTMLInputElement, content: HTMLParagraphElement, value: String, id: String) {

    fetch(`http://localhost:3030/playlist?id=${id}&token=${token}`, {
        method: 'GET',
        mode: 'cors',
        headers: {
            'content-type': 'application/json'
        }
    }).then(response => response.json()).then(data => {
        let body = data.body
        let mgkSongs = data.body.mgkSongs
        let otherSongs = data.body.otherSongs

        let textContent = `<span class="name">${body.name}</span><br><br>Rate: ${body.rate}%<br>Song count: ${mgkSongs.length + otherSongs.length} (${mgkSongs.length}:${otherSongs.length})</span><br><br><u>Songs made by Machine Gun Kelly:</u></span>`

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

        image.src = body.img
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