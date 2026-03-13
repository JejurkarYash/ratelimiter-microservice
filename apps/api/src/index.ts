import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRoute from "./routes/authRoute.js";
import tenantRoute from "./routes/tenantRoutes.js";
import jwtMiddleware from "./middlewares/jwtMiddlware.js";

dotenv.config(); 
const app = express();
app.use(cors());
app.use(express.json());



// Routes

// Auth Routes
app.use("/auth", authRoute);

// Tenant Routes
app.use("/tenant", jwtMiddleware, tenantRoute );



const port = process.env.PORT || 3000;

app.get("/health", (req, res) => {
  res.send({
     message:"Server is Running",
     status:"OK",
     statusCode:200
  });
});






app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});