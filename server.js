// requires
const express = require('express');
const app = express();
app.set('view engine', 'ejs');

let port = process.env.port || 8000;

app.use(express.static(`./html`));
app.use(express.static(`./styles`));
app.use(express.static(`./scripts`));

// dynamic profile page
app.get("/profile/:id", (req, res) => {
    res.render("profile.ejs", {
        "id": req.params.id
    });
});

// entry point
app.listen(port, (err) => {
    if (err) {
        console.log(err);
    } else {
        console.log(`Server active on port ${port}!`);
    }
});