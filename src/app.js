/* eslint-disable quotes */
const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();
const { resolve } = require("path");

require("dotenv").config();

const middlewares = require("./middlewares");

const db = new sqlite3.Database(
  resolve(__dirname, "../bin/pb/pb_data/data.db")
);

const app = express();

app.use(morgan("dev"));
app.use(helmet());
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "🦄🌈✨👋🌎🌍🌏✨🌈🦄",
  });
});

app.get("/products", (req, res) => {
  // NOTE: We need to get the ID from the query string in the request object
  const { id } = req.query;

  if (id) {
    db.get("SELECT * FROM products WHERE id = ?", [id], (err, rows) => {
      if (err) {
        console.log("Error running sql: " + err);

        res.status(500);
        res.json({
          message: "Internal Server Error",
        });
      }

      res.json({
        message: "list of products",
        data: rows,
      });
    });

    return;
  }

  // We need to run a sql query against our pocketbase DB to get all the products
  db.all("SELECT * FROM products", (err, rows) => {
    if (err) {
      console.log("Error running sql: " + err);

      res.status(500);
      res.json({
        message: "Internal Server Error",
      });
    }

    res.json({
      message: "list of products",
      data: rows,
    });
  });
});

app.post("/products", (req, res) => {
  const { name, price } = req.body;

  db.run(
    "INSERT INTO products (name, price) VALUES (?, ?)",
    [name, price],
    function cb(err) {
      if (err) {
        console.log(`Error running sql: ${err}`);

        res.status(500);
        res.json({
          message: "Internal Server Error",
        });
      }

      res.json({
        message: `product ${this.lastID} added`,
      });
    }
  );
});

app.delete("/products", (req, res) => {
  const { id } = req.query;

  db.run("DELETE FROM products WHERE id = ?", [id], (err) => {
    if (err) {
      console.log(`Error running sql: ${err}`);

      res.status(500);
      res.json({
        message: "Internal Server Error",
      });
    }

    res.json({
      message: `product ${id} deleted`,
    });
  });
});

app.get("/vending-machines", (req, res) => {
  // NOTE: We need to get the ID from the query string in the request object
  const { id } = req.query;

  if (id) {
    db.get("SELECT * FROM vending_machines WHERE id = ?", [id], (err, rows) => {
      if (err) {
        console.log("Error running sql: " + err);

        res.status(500);
        res.json({
          message: "Internal Server Error",
        });
      }

      res.json({
        message: "list of vending-machines",
        data: rows,
      });
    });

    return;
  }

  let allProducts = [];

  db.all("SELECT * FROM products", (err, rows) => {
    if (err) {
      console.log("Error running sql: " + err);

      res.status(500);
      res.json({
        message: "Internal Server Error",
      });
    }

    allProducts = rows;
  });

  // We need to run a sql query against our pocketbase DB to get all the vending-machines
  db.all("SELECT * FROM vending_machines", (err, rows) => {
    if (err) {
      console.log("Error running sql: " + err);

      res.status(500);
      res.json({
        message: "Internal Server Error",
      });
    }

    const vendingMachines = rows.map((vendingMachine) => {
      console.log(vendingMachine);
      return {
        ...vendingMachine,
        products: JSON.parse(vendingMachine.products).map((productId) => {
          return allProducts.find((product) => product.id === productId);
        }),
      };
    });

    res.json({
      message: "list of vending-machines",
      data: vendingMachines,
    });
  });
});

app.post("/vending-machines", (req, res) => {
  const { location, products } = req.body;

  db.run(
    "INSERT INTO vending_machines (location, products) VALUES (?, ?)",
    [location, products],
    function cb(err) {
      if (err) {
        console.log(`Error running sql: ${err}`);

        res.status(500);
        res.json({
          message: "Internal Server Error",
        });
      }

      res.json({
        message: `product ${this.lastID} added`,
      });
    }
  );
});

app.delete("/vending-machines", (req, res) => {
  const { id } = req.query;

  db.run("DELETE FROM vending_machines WHERE id = ?", [id], (err) => {
    if (err) {
      console.log(`Error running sql: ${err}`);

      res.status(500);
      res.json({
        message: "Internal Server Error",
      });
    }

    res.json({
      message: `product ${id} deleted`,
    });
  });
});

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

module.exports = app;
