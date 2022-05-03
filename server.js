// requires
const express = require('express');
const app = express();

let port = process.env.port || 8000;

app.use(express.static(`./html`));
app.use(express.static(`./styles`));
app.use(express.static(`./scripts`));

// entry point
app.listen(port, (err) => {
    if (err) {
        console.log(err);
    } else {
        console.log(`Server active on port ${port}!`);
    }
});