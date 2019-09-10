const express = require("express");
const db = require("../database");
const router = express.Router();
const app = express();

router.get("/", (req, res) => {
  res.send("this is carts page");
});

router.get("/:user_id", (req, res) => {
  db.raw("SELECT * FROM carts WHERE user_id = ?", [req.params.user_id])
    .then(results => {
      if (results.rows.length === 0) {
        res.json({ message: `User id: ${req.params.user_id} was not found` });
      } else {
        res.json(results.rows);
      }
    })
    .catch(err => {
      res.json({ message: `Sorry, there was an error: ${err}` });
    });
});

router.post("/:user_id/:product_id", (req, res) => {
  db.raw("SELECT * FROM users WHERE id = ?", [req.params.user_id])
    .then(results => {
      if (results.rows.length === 0) {
        res.json({ message: `User id: ${req.params.user_id} does not exist` });
      }
    })
    .catch(err => {
      res.json({ message: `Sorry, there was an error: ${err}` });
    });
  db.raw("SELECT * FROM products WHERE id = ?", [req.params.product_id])
    .then(results => {
      if (results.rows.length === 0) {
        res.json({
          message: `User id: ${req.params.product_id} does not exist`
        });
      }
    })
    .catch(err => {
      res.json({ message: `Sorry, there was an error: ${err}` });
    });
  db.raw("INSERT INTO carts (user_id, products_id) VALUES (?, ?)", [
    req.params.user_id,
    req.params.product_id
  ])
    .then(results => {
      res.json({ success: true });
    })
    .catch(err => {
      res.json({ message: `Sorry, there was an error: ${err}` });
    });
});

router.delete("/:user_id/:product_id", (req, res) => {
  db.raw("SELECT * FROM carts WHERE user_id = ? AND products_id = ?", [
    req.params.user_id,
    req.params.product_id
  ])
    .then(results => {
      if (results.rows.length === 0) {
        res.json({ message: "Invalid cart item" });
      } else {
        db.raw(`DELETE FROM carts WHERE id = ?`, [results.rows[0].id]).then(
          results => {
            res.json({ success: true });
          }
        );
      }
    })
    .catch(err => {
      res.json({ message: `Sorry, there was an error: ${err}` });
    });
});

module.exports = router;
