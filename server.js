const express = require("express");
const mongoose = require("mongoose");
const redis = require("redis");
const dotenv = require("dotenv");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");
const { authenticateToken } = require("./middleware/authMiddleware");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const redisClient = redis.createClient({ url: process.env.REDIS_URL });
(async () => { await redisClient.connect(); })();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.log(err));

app.use("/api/auth", authRoutes);
app.use("/api/tasks", authenticateToken, taskRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
