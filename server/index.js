/*import express from "express";
const app = express();
app.use(express.json());
app.get("/", function(req, res) {
  res.send("Welcome to Express Server");
});
app.get("/products/:id", function(req, res) {
  const id = req.params.id;
  const category = req.query.category;
  res.json({
    id,
    category,
  });
});
app.post("/products", function(req, res) {
  const { name, price, category } = req.body;
  res.status(201).json({
    message: "Product created",
    product: {
      name,
      price,
      category,
    },
  });
});
app.listen(3000, function() {
  console.log("Server running on port 3000");
});*/