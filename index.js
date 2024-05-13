import express from "express";
import mongoose, { Schema } from "mongoose";
import dotenv from "dotenv";
import bodyParser from "body-parser";

const app = express();
dotenv.config();

const PORT = process.env.PORT || 7000;
const MONGOURL = process.env.MONGO_URL;

mongoose.connect(MONGOURL).then(() => {
  console.log("MongoDB connected");
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}).catch((error) => console.error(error));

const categorieSchema = new mongoose.Schema({
  productsName:String,
  idCategory:String,
  productCode:String,
  priceField:String,
  listedPrice:String,
  image:String,
  describe:String,
  dateCreated:String
});
const productSchema = new mongoose.Schema({
  nameList: String,
  parentCategory: String,
  icon: String,
  date: String,
  status: String,
  fileInput: String,
  time: String,
});

const CategorieModel = mongoose.model("categories", categorieSchema);
const ProductModel = mongoose.model("products", productSchema);

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
  if (req.method == "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.get("/categories", async (req, res) => {
  const categorieData = await CategorieModel.find();
  res.json(categorieData);
});
app.get("/categories/:id", async (req, res) => {
  const categorieId = req.params.id;
  try {
    const categorieData = await CategorieModel.findById(categorieId);
    res.json(categorieData);
  } catch (error) {
    res.status(404).json({ message: "Product not found" });
  }
});
app.post("/categories", async (req, res) => {
  console.log('req.body :', req.body);
  const categorieData = await CategorieModel.create(req.body);
  res.json(categorieData);
});
app.delete("/categories/:id", async (req, res) => {
  const categorieId = req.params.id;
  const categorieData = await CategorieModel.deleteOne({ _id: categorieId });
  res.json(categorieData);
});  
app.put("/categories/:id", async (req, res) => {
  const updatedCategorie = await CategorieModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updatedCategorie);
});

//product
app.get("/products", async (req, res) => {
  const productData = await ProductModel.find();
  res.json(productData);
});
app.get("/products/:id", async (req, res) => {
  const productId = req.params.id;
  console.log('productId :', productId);
  
  try {
    const productData = await ProductModel.findById(productId);
    res.json(productData);
  } catch (error) {
    res.status(404).json({ message: "Product not found" });
  }
});

app.delete("/products/:id", async (req, res) => {
  const productId = req.params.id;
  const productData = await ProductModel.deleteOne({ _id: productId });
  res.json(productData);
});  

app.post("/products", async (req, res) => {
  console.log('req.body :', req.body);
  const productData = await ProductModel.create(req.body);
  res.json(productData);
});
app.put("/products/:id", async (req, res) => {
  console.log('req.body1 :', req.body);
  const updatedProduct = await ProductModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updatedProduct);
});
  