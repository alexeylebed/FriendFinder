var express = require("express");
var path = require("path");
var fs = require("fs");
var htmlRoutes = require("./app/routing/htmlRoutes.js")
var apiRoutes = require("./app/routing/apiRoutes.js")
var characters = [];
var app = express();
var bodyParser = require('body-parser')
var PORT = process.env.PORT || 3000;
let id = 0;


app.use(bodyParser.json({ limit: 100000000 }));
app.use(bodyParser.urlencoded({limit: 100000000 ,extended: true}));

function getCharacters(){
  fs.readFile("./app/data/friends.js", "utf8", function(error, data) {
    if (error) {
      return console.log(error);
    }
    characters = JSON.parse(data);
  });
}

function findBestCharacter(characters, newcharacter){
  let delta = 0;
  let maxDelta = 5*characters.length;
  let index;
  for(i = 0; i < characters.length - 1; i++ ){
    if(characters[i].scores[0].length > 0 && newcharacter.scores[0].length > 0 ){
      delta = Math.abs(parseInt(newcharacter.scores[0]) - parseInt(characters[i].scores[0])) + 
      Math.abs(parseInt(newcharacter.scores[1]) - parseInt(characters[i].scores[1]));
      if(delta < maxDelta){
        maxDelta  = delta;
      index = i;
      }
    }
  }
  delta = 0;
  return characters[index];
}




app.get(htmlRoutes.htmlRoutes.getHome, function(req, res) {
  res.sendFile(path.join(__dirname, "./app/public/home.html"));
});

app.get(htmlRoutes.htmlRoutes.getSurvey,  function(req, res) {
    res.sendFile(path.join(__dirname, "./app/public/survey.html"));
  });

app.get(htmlRoutes.htmlRoutes.getPicOff, function(req, res) {
  res.sendFile(path.join(__dirname, "./app/public/assets/radiooff.svg"));
});

app.get(htmlRoutes.htmlRoutes.getPicOn, function(req, res) {
  res.sendFile(path.join(__dirname, "./app/public/assets/radioon.svg"));
});

app.get(htmlRoutes.htmlRoutes.getUserPhoto, function(req, res) {
  res.sendFile(path.join(__dirname, "./app/public/assets/photo.jpg"));
});

app.get(htmlRoutes.htmlRoutes.getPhoto, function(req, res) {
  res.sendFile(path.join(__dirname, "./app/public/assets/avatars/photo.png"));
});

app.post(apiRoutes.apiRoutes.addCharacter, function(req, res) {
  let newcharacter = req.body;
  newcharacter.id = id;
  id++;
  characters.push(newcharacter);

  fs.writeFile("./app/data/friends.js", JSON.stringify(characters), function(err) {
    if (err) {
      return console.log(err);
    }
    console.log("Friends list was updated!");
    getCharacters();
    res.json(findBestCharacter(characters, newcharacter));
  });
});


app.listen(PORT, function() {
  console.log("App listening on PORT " + PORT);
});






//test2

