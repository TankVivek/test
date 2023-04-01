const express = require("express")
const path = require("path");
// const cors = require("cors")

const authRouter = require("../routes/auth.route")
const trainerRouter = require("../routes/trainer.route")
const bookingRouter  = require(../) 



const app = express();
app.use(express.json())


app.get("/",(req,res) => {
    res.send("Base API")
})

app.use("/auth")
app.use("/trainer")