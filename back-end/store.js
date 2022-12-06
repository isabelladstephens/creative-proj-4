const express = require('express');
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

const mongoose = require('mongoose');

// connect to the database
mongoose.connect('mongodb://localhost:27017/test', {
  useUnifiedTopology: true,
  useNewUrlParser: true
});

const productSchema = new mongoose.Schema({
  name: String,
  price: 0.00,
  image: String,
});

const cartSchema = new mongoose.Schema({
  name: String,
  price: 0.00,
  image: String,
  quantity: 0
});

// create a virtual paramter that turns the default _id field into id
productSchema.virtual('id')
  .get(function() {
    return this._id.toHexString();
  });

cartSchema.virtual('id')
  .get(function() {
    return this._id.toHexString();
  });

// Ensure virtual fields are serialised when we turn this into a JSON object
productSchema.set('toJSON', {
  virtuals: true
});

cartSchema.set('toJSON', {
  virtuals: true
});

// create a model for products
const Product = mongoose.model('Product', productSchema);

app.get('/api/products', async (req, res) => {
  try {
    let products = await Product.find();
    res.send({products: products});
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.post('/api/products', async (req, res) => {
  const product = new Product({
    name: req.body.name,
    price: req.body.price,
    image: req.body.image
  });
  try {
    console.log("creating product");
    await product.save();
    res.send({
      product: product
    });
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.delete('/api/products/:id', async (req, res) => {
  try {
    console.log("deleting product");
    await Product.deleteOne({
      _id: req.params.id
    });
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

// create a model for products
const Cart = mongoose.model('Cart', cartSchema);

app.get('/api/cart', async (req, res) => {
  try {
    console.log("getting cart")
    let items = await Cart.find();
    res.send({
      items: items
    });
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.post('/api/cart', async (req, res) => {
  const item = new Cart({
    name: req.body.name,
    price: req.body.price,
    image: req.body.image,
    quantity: 1
  });
  
  try {
    console.log("creating cart item");
    await item.save();
    res.send({
      item: item
    });
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.put('/api/cart/:id/:quantity', async (req, res) => {
  let myquery = { address: req.param.id };
  let newvalue = { $set: {quantity: req.param.quantity } };
  try {
    await Cart.updateOne({
      myquery, newvalue
    })
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
})

app.delete('/api/cart/:id', async (req, res) => {
  try {
    console.log("deleting cart item");
    await Cart.deleteOne({
      _id: req.params.id
    });
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});


app.listen(3003, () => console.log('Server listening on port 3003!'));
