import { Router } from "express";

import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../controllers/product.controller.js";

import { authMiddleware } from "../middlewares/auth.middleware.js";
import { adminMiddleware } from "../middlewares/admin.middleware.js";
import { getCategoryProducts,  } from "../controllers/product.controller.js";

const router = Router();

// prefijo: /api/products

router.post("/", authMiddleware, adminMiddleware, createProduct);

router.get("/", getProducts);
router.get("/category/:category", getCategoryProducts);
router.get("/:id", getProductById);

router.put("/:id", authMiddleware, adminMiddleware, updateProduct);
router.delete("/:id", authMiddleware, adminMiddleware, deleteProduct);

export default router;
