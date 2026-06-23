import dotenv from "dotenv";
dotenv.config();

import connectDB from "../config/db.js";
import Product from "../models/Product.js";
import Category from "../models/Category.js";

const categorySeedData = [
  {
    name: "accesorios",
    description: "Perifericos y accesorios para mejorar tu experiencia.",
  },
  {
    name: "gaming",
    description: "Productos orientados al rendimiento en juegos.",
  },
  {
    name: "componentes",
    description: "Partes internas para armado y mejora de PC.",
  },
];

const products = [
  {
    name: "Ratones inalámbricos",
    category: "accesorios",
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
    category: "accesorios",
    price: 114.99,
    stock: 15,
    image: "https://picsum.photos/300/400?random=2",
    featured: false,
  },
  {
    name: "Discos duros externos",
    description:
      "Almacenamiento de alto rendimiento para sus archivos más importantes.",
    category: "accesorios",
    price: 129.99,
    stock: 10,
    image: "https://picsum.photos/300/400?random=3",
    featured: true,
  },
  {
    name: "Pendrives",
    description:
      "Almacenamiento de alto rendimiento para sus archivos más importantes.",
    category: "accesorios",
    price: 64.99,
    stock: 15,
    image: "https://picsum.photos/300/400?random=4",
    featured: false,
  },
  {
    name: "Monitores",
    description: "Un monitor de alta calidad para gaming y productividad.",
    category: "accesorios",
    price: 299.99,
    stock: 10,
    image: "https://picsum.photos/300/400?random=5",
    featured: true,
  },
  {
    name: "Ratones Gaming",
    description: "Un ratón gaming de alta calidad para gaming y productividad.",
    category: "gaming",
    price: 59.99,
    stock: 10,
    image: "https://picsum.photos/300/400?random=6",
    featured: true,
  },
  {
    name: "Memorias RAM",
    description: "Memoria de alto rendimiento para su computadora.",
    category: "componentes",
    price: 79.99,
    stock: 10,
    image: "https://picsum.photos/300/400?random=7",
    featured: false,
  },
  {
    name: "Procesadores",
    description: "Un procesador de alto rendimiento para su computadora.",
    category: "componentes",
    price: 219.99,
    stock: 10,
    image: "https://picsum.photos/300/400?random=8",
    featured: false,
  },
  {
    name: "Tarjetas gráficas",
    description:
      "Una tarjeta gráfica de alto rendimiento para gaming y diseño.",
    category: "componentes",
    price: 399.99,
    stock: 10,
    image: "https://picsum.photos/300/400?random=9",
    featured: true,
  },
  {
    name: "Placas base",
    description: "Una placa base de alto rendimiento para su computadora.",
    category: "componentes",
    price: 199.99,
    stock: 10,
    image: "https://picsum.photos/300/400?random=10",
    featured: false,
  },
  {
    name: "Fuentes de alimentación",
    description:
      "Una fuente de alimentación de alto rendimiento para su computadora.",
    category: "componentes",
    price: 89.99,
    stock: 10,
    image: "https://picsum.photos/300/400?random=11",
    featured: false,
  },
  {
    name: "Sillas Gaming",
    description:
      "Una silla gaming de alta calidad para gaming y productividad.",
    category: "gaming",
    price: 199.99,
    stock: 10,
    image: "https://picsum.photos/300/400?random=12",
    featured: true,
  },
];

const seedProducts = async () => {
  try {
    await connectDB();

    await Category.bulkWrite(
      categorySeedData.map((category) => ({
        updateOne: {
          filter: { name: category.name },
          update: { $setOnInsert: category },
          upsert: true,
        },
      })),
    );

    const categories = await Category.find({
      name: { $in: categorySeedData.map((category) => category.name) },
    }).select("_id name");

    const categoryMap = new Map(
      categories.map((category) => [category.name.toLowerCase(), category._id]),
    );

    const productsWithCategoryId = products.map((product) => {
      const categoryId = categoryMap.get(product.category.toLowerCase());

      if (!categoryId) {
        throw new Error(
          `No se encontro la categoria '${product.category}' para el producto '${product.name}'`,
        );
      }

      return {
        ...product,
        category: categoryId,
      };
    });

    await Product.deleteMany();
    await Product.insertMany(productsWithCategoryId);

    console.log("Productos cargados correctamente");
    process.exit(0);
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
};

seedProducts();
