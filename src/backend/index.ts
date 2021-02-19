import express from "express"
import axios from "axios"
import base64 from "js-base64"

require('dotenv/config')

const cors = require("cors")
const app = express()
const port = 3030

let accessToken = ""

app.use(cors())

app.get('/', (req, res) => {
    res.send({ status: "online" })
})

app.get('/login', (req, res) => {

    /*
     * Redirecting user to spotify authorize page
     * to get permissions/scopes and code
     */

    const scopes = "playlist-read-private playlist-read-collaborative"

    res.redirect('https://accounts.spotify.com/authorize' +
        '?response_type=code' +
        '&client_id=' + process.env.CLIENT_ID +
        (scopes ? '&scope=' + encodeURIComponent(scopes) : '') +
        '&redirect_uri=' + encodeURIComponent("http://localhost:3030/callback"));

});

app.get('/callback', (req, res) => {
    // Checking if request has 'code' param in his query parameters
    if (req.query.code) {
        // If req has param it usually has to be the request from '/login' route

        // Preparing body content for request
        const body = new URLSearchParams()
        body.append("grant_type", "authorization_code")
        body.append("code", req.query.code)
        body.append("redirect_uri", "http://localhost:3030/callback")

        // Encoding client_id and client_secret to base64
        const auth = base64.encode(`${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`)

        // Preparing headers for request
        const config = {
            headers: {
                "Authorization": `Basic ${auth}`,
                "Content-Type": "application/x-www-form-urlencoded"
            }
        }

        // Sending final request with already prepared body, and headers (putting puzzle together ;))
        axios.post("https://accounts.spotify.com/api/token", body, config).then(function (response) {
            /*console.log(response);*/
            accessToken = response.data.access_token
        }).catch(function (error) {
            console.log(error);
        }).then(function () {
        })

    }

    res.send({ status: "success" })
})

app.get('/playlist', (req, res) => {
    // Getting playlistId from request query parameters
    const playlistId = req.query.id

    // Preparing headers for request
    const config = {
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`
        }
    }

    // Sending final request with prepared headers and 'market=DE'
    axios.get(`https://api.spotify.com/v1/playlists/${playlistId}/tracks?market=DE`, config).then(function (response) {
        /*console.log("\nCall: \n")*/
        const items = response.data.items

        let allTracks = Array
        let curIndex = 1

        for (let i = 1; i < items.length; i++) {
            const artists = items[i].track.artists
            let artistsNames: Array<string> = []

            for (let i = 0; i < artists.length; i++) {
                artistsNames[i] = artists[i].name
            }

            let curTrack = {
                name: '',
                artists
            }

            curTrack.name = items[i].track.name
            curTrack.artists = artistsNames


            allTracks[curIndex] = curTrack
            /*console.log(`Direct: ${JSON.stringify(curTrack)}`)
            console.log(`Object: ${curIndex} - ${JSON.stringify(allTracks[curIndex])}`)*/
            curIndex++;

        }

        console.log("\n")

        let mgkCount = 0

        for (let i = 1; i < (items.length); i++) {
            /*console.log(`Test: ${i} - ${JSON.stringify(allTracks[i])}`)*/
            let json = JSON.parse(JSON.stringify(allTracks[i]))
            let artists = json.artists as string[]
            let name = json.name

            const mgk = artists.filter(e => e == "Machine Gun Kelly").length > 0

            if (mgk) {
                console.log(`${name} is from MGK! YEAH`)
            } else {
                console.log(`${name} is not from MGK! Ouh...`)
            }

        }

    }).catch(function (error) {
        console.log(error);
    }).then(function () {
    })

    res.set("Access-Control-Allow-Origin", "*")
    res.set("Access-Control-Allow-Credentials", true)
    res.send({ status: "success", id: playlistId })
})

app.listen(port, () => {
    console.log(`spotify-mgk.rate app listening at http://localhost:${port}`)
})
