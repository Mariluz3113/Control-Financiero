import { db } from "../data/transacciones.js";

// 1. OBTENER RESUMEN (Balance + lista desde SQLite)
export const obtenerResumen = async (req, res) => {
  const transacciones = await db.all("SELECT * FROM transacciones");

  let totalIngresos = 0;
  let totalGastos = 0;

  for (const t of transacciones) {
    if (t.tipo === "INGRESO") totalIngresos += t.monto;
    else if (t.tipo === "GASTO") totalGastos += t.monto;
  }

  res.json({
    mensaje: "Control de Gastos y Ganancias (SQLite)",
    Balance: {
      totalIngresos,
      totalGastos,
      gananciaNeta: totalIngresos - totalGastos,
    },
    transacciones,
  });
};

// 2. CREAR una nueva transacción (POST)
export const crearTransaccion = async (req, res) => {
  const { tipo, monto, categoria, descripcion } = req.body;

  if (!tipo || !monto || !categoria) {
    return res
      .status(400)
      .json({ mensaje: "Faltan datos obligatorios (tipo, monto, categoria)" });
  }

  const tipoMayus = tipo.toUpperCase();
  const montoNum = Number(monto);
  const desc = descripcion || "";

  const resultado = await db.run(
    "INSERT INTO transacciones (tipo, monto, categoria, descripcion) VALUES (?, ?, ?, ?)",
    [tipoMayus, montoNum, categoria, desc],
  );

  res.status(201).json({
    id: resultado.lastID,
    tipo: tipoMayus,
    monto: montoNum,
    categoria,
    descripcion: desc,
  });
};

// 3. ACTUALIZAR una transacción existente (PUT)
export const actualizarTransaccion = async (req, res) => {
  const id = Number(req.params.id);
  const actual = await db.get("SELECT * FROM transacciones WHERE id = ?", [id]);

  if (!actual) {
    return res.status(404).json({ mensaje: "Transacción no encontrada" });
  }

  const tipo = req.body.tipo ? req.body.tipo.toUpperCase() : actual.tipo;
  const monto =
    req.body.monto !== undefined ? Number(req.body.monto) : actual.monto;
  const categoria = req.body.categoria || actual.categoria;
  const descripcion =
    req.body.descripcion !== undefined
      ? req.body.descripcion
      : actual.descripcion;

  await db.run(
    "UPDATE transacciones SET tipo = ?, monto = ?, categoria = ?, descripcion = ? WHERE id = ?",
    [tipo, monto, categoria, descripcion, id],
  );

  res.json({ id, tipo, monto, categoria, descripcion });
};

// 4. ELIMINAR una transacción (DELETE)
export const eliminarTransaccion = async (req, res) => {
  const id = Number(req.params.id);
  const resultado = await db.run("DELETE FROM transacciones WHERE id = ?", [
    id,
  ]);

  if (resultado.changes === 0) {
    return res.status(404).json({ mensaje: "Transacción no encontrada" });
  }

  res.json({ mensaje: "Transacción eliminada correctamente" });
};
