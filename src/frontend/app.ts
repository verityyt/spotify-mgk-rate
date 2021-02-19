import axios from "axios";

let button = document.getElementById("button")

if (button != null) {
    button.addEventListener("click", () => {

        let textfield = document.getElementById("textfield") as HTMLInputElement

        if (textfield != null) {
            let value = textfield.value

            if (validURL(value)) {
                console.log("Valid url")
                let split = value.split("/")
                let id = split[split.length - 1].split("?")[0]
                console.log(`ID: ${id}`)

                axios.get("http://localhost:3030/playlist", {
                    params: {
                        id: id
                    }
                }).then(function (response) {
                    console.log(response);
                }).catch(function (error) {
                    console.log(error);
                }).then(function () {
                })
            } else {
                console.log("Invalid url")
            }


            textfield.value = ""
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