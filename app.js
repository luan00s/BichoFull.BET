require("dotenv").config();

const express    = require("express");
const cors       = require("cors");
const swaggerUi  = require("swagger-ui-express");
const swaggerSpecs = require("./swagger");

const authRoutes     = require("./routes/authRoutes");
const apostaRoutes   = require("./routes/apostaRoutes");
const saldoRoutes    = require("./routes/saldoRoutes");
const historicoRoutes = require("./routes/historicoRoutes");
const sorteioRoutes  = require("./routes/sorteioRoutes");

const app = express();

app.use(cors());
app.use(express.json());


app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpecs));


app.use(authRoutes);
app.use(apostaRoutes);
app.use(saldoRoutes);
app.use(historicoRoutes);
app.use(sorteioRoutes);

module.exports = app;
