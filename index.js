const express = require('express');
const path=require("path");
const mysql = require("mysql2");
const app = express();

const PORT = 3000;
app.use(express.urlencoded({extended:true}));
app.use(express.json())
app.set("view engine","ejs")
app.set("views",path.join(__dirname,"views"));
const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "(Bonds007);",
  database: "login_system",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
}).promise();

app.get('/', (req, res) => {
  res.render("register");
});
app.get('/login', (req, res) => {
  res.render("login");
});
 app.post("/users", async (req, res) => {
  try {
    const { user_name, password} = req.body;
    const [result] = await db.query(
      "INSERT INTO user (user_name, password) VALUES (?, ?)",
      [user_name, password]
    );
    res.redirect('/login')
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.post("/login", async (req, res) => {
  try {console.log(req.body)
    const { user_name, password } = req.body;
    const [rows] = await db.query(
      "SELECT * FROM users WHERE user_name= ? AND password = ?",
      [user_name, password] 
    );
    

     if (rows.length === 0) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res.json({ message: "Login successful", user: rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
