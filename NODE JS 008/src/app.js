
const express = require("express")
const app = express();
const port = 8000;
const path = require("path")
const hbs = require("hbs")

const viewpath=path.join(__dirname,"../templates/views")
const partialpath = path.join(__dirname,"../templates/partials")

app.set('view engine', 'hbs');
app.set("views",viewpath)
hbs.registerPartials(partialpath)


app.get("/", (req, resp) => {
    resp.render( "home")
})

app.get("/about", (req, resp) => {
    resp.render( "about")

})
app.get("/contact", (req, resp) => {
    resp.render ("contact")

})
app.get("/log", (req, resp) => {
    resp.render( "log_in")

})


app.get("*", (req, resp) => {
    resp.send("404 : Page not found")
})


app.listen(port, () => {
    console.log("Server running on port : " + port);
})