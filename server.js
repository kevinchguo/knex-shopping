const express = require("express");
const bodyParser = require("body-parser");
const db = require("./database");
const app = express();

const userRoutes = require("./routes/users");
const productRoutes = require("./routes/products");
const cartRoutes = require("./routes/carts");

const PORT = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/users", userRoutes);
app.use("/products", productRoutes);
app.use("/carts", cartRoutes);

app.get("/", (req, res) => {
  console.log("this works");
  res.send("smoke test");
});

app.listen(PORT, () => {
  console.log(`Server started on PORT ${PORT}`);
});
