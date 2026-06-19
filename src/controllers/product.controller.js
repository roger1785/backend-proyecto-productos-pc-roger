import Product from "../models/Product.js";

export const createProduct = async (req, res) => {
  try {

    const { name, price, stock, image } = req.body;

    if (!name || name.trim() === "" || name.length < 3) {
      return res.status(422).json({
        message: "El nombre es obligatorio y debe tener al menos 3 caracteres",
      });
    }

    if (!name || !price || !stock || !image) {
      return res
        .status(422)
        .json({ message: "Todos los campos son obligatorios" });
    }

    const product = await Product.create(req.body);

    res.status(201).json(product);
  } catch (error) {


    if (error.name === "ValidationError") {
      return res.status(422).json({ message: error.message });
    }

    res.status(500).json({ message: "Error al crear el producto" });
  }
};

export const getProducts = async (req, res) => {
  try {
    const products = await Product.find().select("-description -__v");

    res.json(products);
  } catch (error) {

    res.status(500).json({ message: "Error al obtener los productos" });
  }
};

export const getProductById = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    res.json(product);
  } catch (error) {

    res.status(500).json({ message: "Error al obtener el producto" });
  }
};

export const updateProduct = async (req, res) => {
  try {


    const { id } = req.params;

    if (typeof req.body.name != "string") {
      return res
        .status(422)
        .json({ message: "El nombre tiene que ser un string" });
    }

    const product = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json(product);
  } catch (error) {


    if (error.name === "ValidationError") {
      return res.status(422).json({ message: error.message });
    }

    if (error.name === "CastError") {
      return res.status(404).json({ message: error.message });
    }

    res.status(500).json({ message: "Error al actualizar el producto" });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    await new Promise((resolve) => setTimeout(resolve, 3000));

    const { id } = req.params;

    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    res.json({ message: "Producto borrado" });
  } catch (error) {
    res.status(500).json({ message: "Error al borrar el producto" });
  }
};
