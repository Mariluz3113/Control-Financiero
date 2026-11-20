import express from "express";

import {
  obtenerResumen,
  crearTransaccion,
  actualizarTransaccion,
  eliminarTransaccion,
} from "../controllers/transaccionesCtrl.js";

const router = express.Router();

router.get("/", obtenerResumen);
router.post("/api/transacciones", crearTransaccion);
router.put("/api/transacciones/:id", actualizarTransaccion);
router.delete("/api/transacciones/:id", eliminarTransaccion);

export default router;
