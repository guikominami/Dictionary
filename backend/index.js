import express, { json } from 'express'
import mysql from "mysql"
import cors from "cors"

const app = express()

const db = mysql.createConnection({
  host: "bd_comunica.mysql.dbaas.com.br",
  user: "bd_comunica",
  password: "C0munic@1503",
  database: "bd_comunica"
})

app.use(express.json())
app.use(cors())

app.get("/", (req, res)=>{
  res.json("hello, this is backend!")
})

app.get("/languages", (req, res)=>{
  const querySelect = "SELECT * FROM all_languages"
  db.query(querySelect, (err, data) => {
    if (err) return res.json(err)
    return res.json(data)
  })
})

app.post("/languages", (req, res)=>{
    const queryInsert = "INSERT INTO languages (language_id, name, location_id) VALUES (?)"    
    const values = [3, 'teste', 1]
    db.query(queryInsert, [values], (err, data) => {
      if (err) return res.json(err)
      return res.json(data)
    })
  })


app.listen(8800, ()=> {
  console.log('Connected to backend!')
})