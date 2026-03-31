// src/app.js
import express from "express";
import cors from "cors";
// import expenseRoutes from "./modules/expenses/expense.routes.js";
// import categoryRoutes from "./modules/categories/category.routes.js";
import userRoutes from "./modules/users/user.routes.js";
// import { errorHandler } from "./middleware/error.middleware.js";
// import { notFoundHandler } from "./middleware/notFound.middleware.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/users", userRoutes);
// app.use("/api/expenses", expenseRoutes);
// app.use("/api/categories", categoryRoutes);

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// 404 handler
// app.use(notFoundHandler);

// Error handler (must be last)
// app.use(errorHandler);

export default app;
