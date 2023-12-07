const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// const uri = process.env.ATLAS_URI;
const uri =
  'mongodb+srv://Yashvi:Yashvi@cluster0.3h6csyt.mongodb.net/ecommerce';
mongoose.connect(uri);

const connection = mongoose.connection;

connection.once('open', () => {
  console.log('MongoDB database connection established successfully');
});

const Schema = mongoose.Schema;

// Create a Schema object
const product = new Schema(
  {
    pname: { type: String, required: true },
    pdesc: { type: String, required: true },
    purl : { type: String, required: true }
  },
  
  {
    versionKey: false, // You should be aware of the outcome after set to false
  }
);

// This Activitry creates the collection called activitimodels
const productModel = mongoose.model('products', product);



app.get('/', (req, res) => {
  productModel.find()
    .then((products) => res.json(products))
    .catch((err) => res.status(400).json('Error: ' + err));
});



app.post('/add', async (req, res) => {
    console.log("boyd", req.body.product);
  const product = req.body.product;
  console.log("product", product)
  // create a new Activity object
  const newProduct = await new productModel(product);
  console.log(newProduct);
  // save the new object (newActivity)
  newProduct
    .save()
    .then(() => res.json('product added!'))
    .catch((err) => res.status(400).json('Error: ' + err));
});


app.get('/:id', (req, res) => {
  console.log('just id' + req.params.id);
  productModel.findById(req.params.id)
    .then((product) => res.json(product))
    .catch((err) => res.status(400).json('Error: ' + err));
});


app.post('/update/:id', async (req, res) => {
  console.log(req.params.id);
  await productModel.findById(req.params.id)
    .then((productforedit) => {
      productforedit.product = req.body.product;

      productforedit
        .save()
        .then(() => res.json('Product updated!'))
        .catch((err) => res.status(400).json('Error: ' + err));
    })
    .catch((err) => res.status(400).json('Error: ' + err));
});



// app.delete('/delete/:id', async (req, res) => {
//   console.log('delete logged');
//   await Activitymodel.findByIdAndDelete(req.params.id)
//     .then(() => res.json('Activity deleted.'))
//     .catch((err) => res.status(400).json('Error: ' + err));
// });

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
