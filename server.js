// API DE CONTROL DE GASTOS Y GANANCIAS

import express from "express";
import transaccionesRoutes from "./routes/transaccionesRoutes.js";

const app = express();
app.use(express.json());

// Conectamos todas las rutas
app.use("/", transaccionesRoutes);

// 6. Encender el servidor
app.listen(3000, () => {
  console.log("Servidor listo en http://localhost:3000");
});

// Get --> http://localhost:3000 = enlace principal (totalIngresos, totalGastos, gananciaNeta) y toda la lista de movimientos
