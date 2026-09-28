import express from "express";
import {getAllProducts,getProductById,createProduct,updateProduct,deleteProduct,} from "../controllers/productController.js";
import authorizeRoles from "../middleware/roleMiddleware.js";
const router = express.Router();
// GET ALL PRODUCTS (accessible to any authenticated user)
router.get("/", getAllProducts);
// GET SINGLE PRODUCT (accessible to any authenticated user)
router.get("/:id", getProductById);
// CREATE PRODUCT (admin only)
router.post("/", authorizeRoles("admin"), createProduct);
// UPDATE PRODUCT (admin only)
router.put("/:id", authorizeRoles("admin"), updateProduct);
// DELETE PRODUCT (admin only)
router.delete("/:id", authorizeRoles("admin"), deleteProduct);
export default router;