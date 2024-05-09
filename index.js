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

const categoriesSchema = new mongoose.Schema({
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

const categoriesModel = mongoose.model("categories", categoriesSchema);
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
  const categorieData = await categoriesModel.find();
  res.json(categorieData);
});


app.get("/products", async (req, res) => {
  const productData = await ProductModel.find();
  res.json(productData);
});

app.delete("/products/:id", async (req, res) => {
  const productId = req.params.id;
  console.log('productId :', productId);
  const productData = await ProductModel.deleteOne({ _id: productId });
  console.log('productData :', productData);
  res.json(productData);
});  

app.post("/products", async (req, res) => {
  console.log('req.body :', req.body);
  const productData = await ProductModel.create(req.body);
  res.json(productData);
});
app.put("/products/:id", async (req, res) => {
  console.log('req.body :', req.body);
  const updatedProduct = await ProductModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updatedProduct);
});
  