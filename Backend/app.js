require("dotenv").config();
require("./DataBase/connection");
const session = require("express-session");

const Admin = require("./Schema/AdminSchema");
const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 8080;
const bonusRoutes = require("./routes/BonusRoutes");
const investorRoutes = require('./routes/Investor')

const AdminController = require("./controller/BonusController");
const ToggleController = require("./controller/BonusController");

app.use(express.json()); // Body parser middleware
// app.use(
//   session({
//     secret: "sdnsd", // replace with your secret
//     resave: false,
//     saveUninitialized: true,
//     cookie: { secure: false }, // Set to true if using HTTPS
//   })
// );
app.use(
  cors({
    origin: ["http://localhost:5173"],
    methods: "GET, POST, PUT, DELETE",
    credentials: true,
  })
);


// const authenticateAdmin = (req, res, next) => {
//   if (req.session && req.session.adminId) {
//     Admin.findById(req.session.adminId)
//       .then((admin) => {
//         if (admin) {
//           req.user = admin; // Set the user object to req.user
//           next(); // Proceed to the next middleware or route handler
//         } else {
//           return res.status(401).json({ message: "Unauthorized" });
//         }
//       })
//       .catch((err) => {
//         console.error("Authentication error:", err);
//         res.status(500).json({ message: "Internal server error" });
//       });
//   } else {
//     return res.status(401).json({ message: "Unauthorized" });
//   }
// };



app.use("/api/bonus", bonusRoutes);
app.use("/api/bonus/admin/login", AdminController.loginAdmin);

// app.use("/api/bonus/toggle", ToggleController.toggleBonusCodeStatus);
// app.use("/api", authenticateAdmin, bonusRoutes);
app.use("/api/investor", investorRoutes);
app.use("/api/bonus/admin/signup", AdminController.signupAdmin);
app.listen(port, () => {
  console.log(`Server is running at port: ${port}`);
});
