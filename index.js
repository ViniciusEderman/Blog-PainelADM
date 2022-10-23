const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const connection = require('./database/database');

//load view engine:
app.set('view engine', 'ejs');

app.use(express.static('public'));

//body parser:
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//db:
connection
    .authenticate()
    .then(() => {
        console.log("sucess");

    }).catch((error) => {
        console.log(`Error: ${error}`);
    })
;

app.get("/", (req, res) => {

   //res.send("Teste"); 
   res.render("index");

});

app.listen(8080, () => {
    console.log("The server is run!");
});
