import express from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";
import connectDB from "./config/mongodb.js";
import authRouter from "./routes/authRoutes.js";
import userRouter from "./routes/userRoutes.js";

const app = express();

const PORT = process.env.PORT || 4000;
connectDB();

app.use(express.json());
app.use(cors({origin:"https://mern-authentication-application-gamma.vercel.app",
  methods:["POST","GET"]
  , credentials: true, }));
app.use(cookieParser());

//api endpoints
app.get("/", (req, res) => {
  res.send("Hello from server, API Working");
});

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);

app.listen(PORT, () => {
  console.log("Server listening on port:", PORT);
});
