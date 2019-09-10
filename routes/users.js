const express = require("express");
const db = require("../database");
const router = express.Router();
const app = express();

router.get("/", (req, res) => {
  res.send("this is users page");
});

router.get("/:user_id", (req, res) => {
  db.raw(`SELECT email, password FROM users`)
    .then(results => {
      res.json(results.rows[req.params.user_id]);
    })
    .catch(err => {
      res.json({ error: `Sorry, there was an error: ${err}` });
    });
});

router.post("/login", (req, res) => {
  db.raw(`SELECT * FROM users WHERE email = ?`, [req.body.email])
    .then(results => {
      console.log(req.body.password);
      if (results.rows.length === 0) {
        res.json({ message: "User not found" });
      } else if (results.rows[0].password === req.body.password) {
        res.json(results.rows[0]);
      } else {
        res.json({ message: "Incorrect password" });
      }
    })
    .catch(err => {
      res.json({ error: `Sorry, there was an error: ${err}` });
    });
});

router.post("/register", (req, res) => {
  db.raw(`SELECT * FROM users WHERE email = ?`, [req.body.email])
    .then(results => {
      if (results.rows.length !== 0) {
        res.json({ message: "User already exists" });
      } else {
        db.raw(
          `INSERT INTO users(email, password) VALUES (?, ?) RETURNING *;`,
          [req.body.email, req.body.password]
        ).then(results => {
          res.json(results.rows[0]);
        });
      }
    })
    .catch(err => {
      res.json({ error: `Sorry, there was an error: ${err}` });
    });
});

router.put("/:user_id/forgot-password", (req, res) => {
  if (req.body.password === "") {
    res.json({ message: "Please enter a valid password" });
  } else {
    db.raw(`SELECT * FROM users WHERE id = ?`, [req.params.user_id])
      .then(results => {
        if (results.rows.length === 0) {
          res.json({ message: "Cannot find user" });
        } else {
          db.raw(`UPDATE users SET password = ? WHERE id = ?`, [
            req.body.password,
            req.params.user_id
          ]).then(results => {
            res.json({ message: "New password created!" });
          });
        }
      })
      .catch(err => {
        res.json({ error: `Sorry, there was an error: ${err}` });
      });
  }
});

router.delete("/:user_id", (req, res) => {
  db.raw(`SELECT * FROM users WHERE id = ? `, [req.params.user_id])
    .then(results => {
      if (results.rows.length === 0) {
        res.json({ message: "User ID not found" });
      } else {
        db.raw(`DELETE FROM users WHERE id = ?`, req.params.user_id).then(
          results => {
            res.json({
              message: `User id: ${req.params.user_id} successfully deleted`
            });
          }
        );
      }
    })
    .catch(err => {
      res.json({ error: `Sorry, there was an error: ${err}` });
    });
});

module.exports = router;
