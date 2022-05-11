// requires
const express = require('express');
const app = express();
const https = require('https');
const mongoose = require('mongoose');

// mongoose.connect("mongodb://localhost:8000/timel")

app.set('view engine', 'ejs');

let port = process.env.PORT || 8000;

// mongoose.connect("mongodb://localhost:27817")

app.use(express.static(`./public`));

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
    
            res.render("profile", {
                "pokemon": data})
        })
    })
});

app.get("/timeline", (req, res) => {
    res.render("timeline");
})

app.get("/", (req, res) => {
    res.sendFile("./public/index.html", { root: __dirname });
})

app.get("/search", (req, res) => {
    res.sendFile(`./public/html/search.html`, { root: __dirname });
})

// entry point
app.listen(port, (err) => {
    if (err) {
        console.log(err);
    } else {
        console.log(`Server active on port ${port}!`);
    }
});