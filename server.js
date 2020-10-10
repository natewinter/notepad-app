// // BUILD SERVER STRUCTURE
const path = require("path");
const express = require("express");
const fs = require("fs")
const uniqid = require("uniqid");

const app = express();
const PORT = process.env.PORT || 3000;


app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());
app.use(express.static("public"))

//GET ROUTE FOR db.json DATA
function getDatabase() {
    let dbData = fs.readFileSync(path.join(__dirname, "/db/db.json"), "utf8");
    dbData = JSON.parse(dbData);
    let noteData = dbData
    // console.log(noteData)
    return noteData
}

function postDatabase(newData) {
    fs.writeFileSync(path.join(__dirname, "/db/db.json"), JSON.stringify(newData), function (err, data) {
        if (err) throw err;;
    })
}


app.get("/", function (req, res) {
    res.json(path.join(__dirname, "/public/index.html"));
});

app.get("/index", function (req, res) {
    res.sendFile(path.join(__dirname, "/public/index.html"));
});

app.get("/notes", function (req, res) {
    res.sendFile(path.join(__dirname, "/public/notes.html"));
});

app.get("/api/notes", function (req, res) {
    res.json(getDatabase())
})

app.post("/api/notes", function (req, res) {
    var data = getDatabase() || []
    var {title,text} = req.body
    var newNote = {title, text, id: uniqid()}
    data.push(newNote)
    postDatabase(data)
    res.json(data)
});

app.delete("/api/notes/:id", function (req, res) {
    var data = getDatabase() || []
    data = data.filter(note => note.id !== req.params.id)
    postDatabase(data)
    res.json(data)
});

app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "/public/index.html"));
});

app.listen(PORT, function () {
    console.log("listening on port " + PORT)
})