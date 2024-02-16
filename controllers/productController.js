import Product from "../models/productModel.js";

//add a new product
export const addController = async (req, res) => {
  const product = new Product({
    name: req.body.name,
    description: req.body.description,
    imageURL: req.body.imageURL,
    category: req.body.category,
    price: req.body.price,
    quantity: req.body.quantity,
  });

  await product
    .save()
    .then((data) => {
      res.send({
        message: "Product added successfully!!",
        product: data,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while adding product",
      });
    });
};

// to get all products
export const getAllController = async (req, res) => {
  try {
    const product = await Product.find();
    res.status(200).json(product);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

//to get single product by id
export const getOneController = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.status(200).json(product);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

//update the product
export const updateController = async (req, res) => {
  if (!req.body) {
    res.status(400).send({
      message: "Data to update can not be empty!",
    });
  }

  const id = req.params.id;

  await Product.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Product not found.`,
        });
      } else {
        res.send({ message: "Product updated successfully." });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message,
      });
    });
};

//delete the product
export const deleteController = async (req, res) => {
  const product = await Product.findById(req.params.id);

  await product
    .deleteOne()
    .then((data) => {
      res.send({
        message: "Product deleted successfully!!",
        product: data,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while deleting product",
      });
    });
};
