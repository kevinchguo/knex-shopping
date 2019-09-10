const express = require("express");
const db = require("../database");
const router = express.Router();
const app = express();

router.get("/", (req, res) => {
  db.raw(`SELECT * FROM products;`)
    .then(results => {
      res.json(results.rows);
    })
    .catch(err => {
      res.json({ message: `Sorry, there was an error: ${err}` });
    });
});

router.get("/:product_id", (req, res) => {
  db.raw("SELECT * FROM products WHERE id = ?", [req.params.product_id])
    .then(results => {
      if (results.rows.length === 0) {
        res.json({ message: "Product not found" });
      } else {
        res.json(results.rows[0]);
      }
    })
    .catch(err => {
      res.json({ message: `Sorry, there was an error: ${err}` });
    });
});

router.post("/new", (req, res) => {
  if (req.body.title === "" || req.body.description === "") {
    res.json({ message: "Must POST all product fields" });
  } else {
    db.raw(
      `INSERT INTO products (title, description, inventory, price) Values(?, ?, ?, ?) RETURNING *;`,
      [req.body.title, req.body.description, req.body.inventory, req.body.price]
    )
      .then(results => {
        res.json(results.rows[0]);
      })
      .catch(err => {
        res.json({ message: "Must POST all product fields" });
      });
  }
});

router.put("/:product_id", (req, res) => {
  req.body.title.trim();
  req.body.description.trim();
  req.body.inventory.trim();
  req.body.price.trim();
  let title;
  let description;
  let inventory;
  let price;
  db.raw("SELECT * FROM products where id = ?", [req.params.product_id])
    .then(results => {
      if (results.rows.length === 0) {
        res.json({ message: `Product id: ${req.params.product_id} not found` });
      } else {
        if (req.body.title === "") {
          db.raw("SELECT title FROM products WHERE id = ?", [
            req.params.product_id
          ]).then(results => {
            title = results.rows[0].title;
          });
        } else {
          title = req.body.title;
        }
        if (req.body.description === "") {
          db.raw("SELECT description FROM products WHERE id = ?", [
            req.params.product_id
          ]).then(results => {
            req.body.description = results.rows[0].description;
          });
        } else {
          description = req.body.description;
        }
        if (req.body.inventory === "") {
          db.raw("SELECT inventory FROM products WHERE id = ?", [
            req.params.product_id
          ]).then(results => {
            req.body.inventory = results.rows[0].inventory;
          });
        } else {
          inventory = req.body.inventory;
        }
        if (req.body.price === "") {
          db.raw("SELECT price FROM products WHERE id = ?", [
            req.params.product_id
          ]).then(results => {
            req.body.price = results.rows[0].price;
          });
        } else {
          price = req.body.price;
        }
        db.raw(
          "UPDATE products SET title = ?, description = ?, inventory = ?, price = ? WHERE id = ? RETURNING *;",
          [title, description, inventory, price, req.params.product_id]
        ).then(results => {
          res.json(results.rows[0]);
        });
      }
    })
    .catch(err => {
      res.json({ message: "Must POST all product fields" });
    });
});

router.delete("/:product_id", (req, res) => {
  db.raw("SELECT * FROM products WHERE id = ?", [req.params.product_id])
    .then(results => {
      if (results.rows.length === 0) {
        res.json({ message: `Product id: ${req.params.product_id} not found` });
      } else {
        db.raw("DELETE FROM products WHERE id = ?", [
          req.params.product_id
        ]).then(results => {
          res.json({
            message: `Product id: ${req.params.product_id} successfully deleted`
          });
        });
      }
    })
    .catch(err => {
      res.json({ message: "Must POST all product fields" });
    });
});

module.exports = router;
