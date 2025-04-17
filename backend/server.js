const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

const carRoutes = require("./routes/carRoutes");
const userRoutes = require("./routes/userRoutes");
const miscRoutes = require("./routes/miscRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const paymentRoutes = require("./routes/paymentRoutes");

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());

app.use("/api/cars", carRoutes);
app.use("/api/users", userRoutes);
app.use("/api/misc", miscRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/payments", paymentRoutes);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: "Something went wrong!" });
});

app.get("/", (req, res) => {
    res.send("Hello From Backend!");
});

app.listen(process.env.PORT, () => {
    console.log(`Server is running on http://localhost:${process.env.PORT}`);
});