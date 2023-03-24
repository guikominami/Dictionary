import express, { json } from "express";
import mysql from "mysql";
import cors from "cors";

const app = express();

var db_config = {
  host: "bd_comunica.mysql.dbaas.com.br",
  user: "bd_comunica",
  password: "C0munic@1503",
  database: "bd_comunica",
};

var connection;

function handleDisconnect() {
  connection = mysql.createConnection(db_config); // Recreate the connection, since
  // the old one cannot be reused.

  connection.connect(function (err) {
    // The server is either down
    if (err) {
      // or restarting (takes a while sometimes).
      console.log("error when connecting to db:", err);
      setTimeout(handleDisconnect, 2000); // We introduce a delay before attempting to reconnect,
    } // to avoid a hot loop, and to allow our node script to
  }); // process asynchronous requests in the meantime.
  // If you're also serving http, display a 503 error.
  connection.on("error", function (err) {
    console.log("db error", err);
    if (err.code === "PROTOCOL_CONNECTION_LOST") {
      // Connection to the MySQL server is usually
      handleDisconnect(); // lost due to either server restart, or a
    } else {
      // connnection idle timeout (the wait_timeout
      throw err; // server variable configures this)
    }
  });
}

handleDisconnect();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  try {
    res.json("hello, this is backend!");
  } catch (err) {
    console.log(err);
  }
});

app.get("/languages", (req, res) => {
  const querySelect = "SELECT language_id, name FROM language";
  connection.query(querySelect, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

app.post("/languages", (req, res) => {
  const languages = "INSERT INTO language (name, location_id) VALUES (?)";
  const values = [req.body.name, req.body.location_id];
  connection.query(queryInsert, [values], (err, data) => {
    if (err) return res.json(err);
    return res.json("Language has been created!");
  });
});

app.get("/words", (req, res) => {
  const querySelect = "SELECT * FROM `all_words`";
  connection.query(querySelect, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

app.post("/words", (req, res) => {
  const queryInsert = "INSERT INTO word (word, language_id) VALUES (?)";
  const values = [req.body.word, req.body.language_id];
  connection.query(queryInsert, [values], (err, data) => {
    if (err) return res.json(err);
    return res.json("Word has been created!");
  });
});

app.post("/translation", (req, res) => {
  const queryInsert =
    "INSERT INTO translation (word_id, translation_language_id, translation) ";
  ("VALUES ((select max(word_id) from word), ?, ?)");

  const values = [req.body.translation_language_id, req.body.translation];

  connection.query(queryInsert, [values], (err, data) => {
    if (err) return res.json(err);
    return res.json("Translation has been created!");
  });
});

app.listen(8800, () => {
  try {
    console.log("Connected to backend!");
  } catch (err) {
    console.log(err);
  }
});
