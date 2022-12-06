import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  // setup state
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [quantity, setQuantity] = useState("");
  const [total, setTotal] = useState("")

  const fetchProducts = async() => {
    try {      
      const response = await axios.get("/api/products");
      setProducts(response.data.products);
      
    } catch(error) {
      setError("error retrieving products: " + error);
    }
  }
   const fetchCart = async() => {
    try {      
      const response = await axios.get("/api/cart");
      setCart(response.data.items);
      console.log("fetching cart");
    } catch(error) {
      setError("error retrieving cart: " + error);
    }
  }
  const createProduct = async() => {
    try {
      await axios.post("/api/products", {name: name, price: price, image: image});
    } catch(error) {
      setError("error adding a product: " + error);
    }
  }
  const createItem = async(product) => {
    try {
      await axios.post("/api/cart/", {name: product.name, price: product.price, image: product.image});
    } catch(error) {
      setError("error adding a product to cart" + error);
    }
  }
  const decreaseItemQuantity = async(item) => {
    try {
      const num = item.quantity - 1;
      await axios.put("/api/cart/" + item.id +"/" + num);
      fetchCart();
    } catch(error) {
      setError("error decreasing quantity" + error);
    }
  }
  const increaseItemQuantity = async(item) => {
    try {
      const num = item.quantity + 1;
      await axios.put("/api/cart/" + item.id +"/" + num);
      fetchCart();
    } catch(error) {
      setError("error decreasing quantity" + error);
    }
  }
  const deleteOneItem = async(item) => {
    try {
      await axios.delete("/api/cart/" + item.id);
      console.log("deleting item..." + item.id);
    } catch(error) {
      setError("error deleting an item" + error);
    }
  }
  const deleteOneProduct = async(product) => {
    try {
      await axios.delete("/api/products/" + product.id);
    } catch(error) {
      setError("error deleting a product" + error);
    }
  }

  // fetch product data
  useEffect(() => {
    fetchProducts();
  },[]);
  useEffect(() => {
    fetchCart();
  },[]);


  const addProduct = async(e) => {
    e.preventDefault();
    await createProduct();
    fetchProducts();
    setName("");
    setPrice("");
    setImage("");
  }
  
  const addCart = async(product) => {
    await createItem(product);
    fetchCart();
    console.log("added and fetched");
  }

  const deleteProduct = async(product) => {
    await deleteOneProduct(product);
    console.log("successfully deleted product, fetching products");
    fetchProducts();
  }
  
  const deleteItem = async(item) => {
    await deleteOneItem(item);
    console.log("successfully deleted item, fetching cart");
    fetchCart();
  }


  // render results
  return (
    <div className="SUN STATEMENT JEWELRY">
      {error}
      <div class="small-text free-shipping">Free Shipping over $200</div>
      <div class="small-section heading">
        <p class="company-name">SUN STATEMENT JEWELRY CO</p>
      </div>
      
      <h1 class="paragraph-large">THE WINTER COLLECTION</h1>
      <div className="sectio product-display">
        {products.map( product => (
          <div key={product.id} className="product">
            <div className="price">
              <img className="med-icon" src={product.image}/>
              <p>{product.name}</p>
              <p>${product.price}</p>
            </div>
    
            <button onClick={e => addCart(product)}>Add To Cart</button>
          </div>
        ))}    
      </div>
      
      <h1>Your Cart</h1>
      <div className="section cart-display">
        {cart.map( item => (
          <div key={item.id} className="item">
            <div className="price">
              <img className="small-icon" src={item.image}/>
              <p>{item.name}</p>
              <p>${item.price}</p>
              <p>Quantity: {item.quantity}</p>
            </div>
            
            <button onClick={e => deleteItem(item)}>Remove From Cart</button>
          </div>
        ))}    
      </div>
      
      <div className='footer'><a class='github-link' href='https://github.com/isabelladstephens/creative-proj-4'>GitHub Link</a></div>
    </div>
  );
}

export default App;
