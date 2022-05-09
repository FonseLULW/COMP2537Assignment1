// requires
const express = require('express');
const app = express();
const https = require('https');
// const fs = require('fs');
app.set('view engine', 'ejs');

let port = process.env.port || 8000;

app.use(express.static(`./html`));
app.use(express.static(`./styles`));
app.use(express.static(`./scripts`));

// dynamic profile page
app.get("/profile/:id", (req, res) => {

    const url = `https://pokeapi.co/api/v2/pokemon/${req.params.id}`;
    data = "";

    https.get(url, (https_res) => {
        https_res.on("data", (chunk) => {
            data += chunk;
        })

        https_res.on("end", () => {
            data = JSON.parse(data);
    
            res.render("profile.ejs", {
                "pokemon": data})
        })
    })
});

app.get("/", (req, res) => {
    res.sendFile("html/index.html");
})

// entry point
app.listen(port, (err) => {
    if (err) {
        console.log(err);
    } else {
        console.log(`Server active on port ${port}!`);
    }
});