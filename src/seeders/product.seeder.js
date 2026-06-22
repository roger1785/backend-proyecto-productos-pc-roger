import dotenv from "dotenv";
dotenv.config();

import connectDB from "../config/db.js";
import Product from "../models/Product.js";

const products = [
  {
    name: "Ratones inalámbricos",
    description: "Un mouse ergonómico para su familia.",
    price: 39.99,
    stock: 10,
    image: "https://picsum.photos/300/400?random=1",
    featured: true,
  },
  {
    name: "Teclados",
    description:
      "Un teclado mecánico de alta calidad para gaming y productividad.",
    price: 114.99,
    stock: 15,
    image: "https://picsum.photos/300/400?random=2",
    featured: false,
  },
  {
    name: "Discos duros externos",
    description:
      "Almacenamiento de alto rendimiento para sus archivos más importantes.",
    price: 129.99,
    stock: 10,
    image: "https://picsum.photos/300/400?random=3",
    featured: true,
  },
  {
    name: "Pendrives",
    description:
      "Almacenamiento de alto rendimiento para sus archivos más importantes.",
    price: 64.99,
    stock: 15,
    image: "https://picsum.photos/300/400?random=4",
    featured: false,
  },
  {
    name: "Monitores",
    description:
      "Un monitor de alta calidad para gaming y productividad.",
    price: 299.99,
    stock: 10,
    image: "https://picsum.photos/300/400?random=5",
    featured: true,
  },
  {
    name: "Ratones Gaming",
    description:
      "Un ratón gaming de alta calidad para gaming y productividad.",
    price: 59.99,
    stock: 10,
    image: "https://picsum.photos/300/400?random=6",
    featured: true,
  },
  {
    name: "Memorias RAM",
    description:
      "Memoria de alto rendimiento para su computadora.",
    price: 79.99,
    stock: 10,
    image: "https://picsum.photos/300/400?random=7",
    featured: false,
  },
  {
    name: "Procesadores",
    description:
      "Un procesador de alto rendimiento para su computadora.",
    price: 219.99,
    stock: 10,
    image: "https://picsum.photos/300/400?random=8",
    featured: false,
  },
  {
    name: "Tarjetas gráficas",
    description:
      "Una tarjeta gráfica de alto rendimiento para gaming y diseño.",
    price: 399.99,
    stock: 10,
    image: "https://picsum.photos/300/400?random=9",
    featured: true,
  },
];

const seedProducts = async () => {
  try {
    await connectDB();

    await Product.deleteMany();
    await Product.insertMany(products);

    console.log("Productos cargados correctamente");
    process.exit(0);
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
};

seedProducts();
