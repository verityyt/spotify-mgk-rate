let button = document.getElementById("button")

if (button != null) {
    button.addEventListener("click", () => {

        let textfield = document.getElementById("textfield") as HTMLInputElement

        if (textfield != null) {
            console.log(textfield.value)
            textfield.value = ""
        }

    })
}