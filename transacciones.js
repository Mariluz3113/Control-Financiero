// 1. Base de datos temporal en memoria
/*export let transacciones = [
  {
    id: 1,
    tipo: "INGRESO",
    monto: 50000,
    categoria: "Ventas",
    descripcion: "Ventas lunes",
  },
  {
    id: 2,
    tipo: "GASTO",
    monto: 15000,
    categoria: "Proveedores",
    descripcion: "Compra de mercadería",
  },
];*/

import sqlite3 from "sqlite3";
import { open } from "sqlite";

// Abrimos (o creamos) el archivo de base de datos en la carpeta data
export const db = await open({
  filename: "./data/finanzas.db",
  driver: sqlite3.Database,
});

// Creamos la tabla si todavía no existe
await db.exec(`
  CREATE TABLE IF NOT EXISTS transacciones (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tipo TEXT NOT NULL,
    monto REAL NOT NULL,
    categoria TEXT NOT NULL,
    descripcion TEXT
  )
`);

// Si la tabla está vacía, agregamos los 2 datos de ejemplo iniciales
const conteo = await db.get("SELECT COUNT(*) as total FROM transacciones");
if (conteo.total === 0) {
  await db.run(
    "INSERT INTO transacciones (tipo, monto, categoria, descripcion) VALUES (?, ?, ?, ?)",
    ["INGRESO", 50000, "Ventas", "Ventas lunes"],
  );
  await db.run(
    "INSERT INTO transacciones (tipo, monto, categoria, descripcion) VALUES (?, ?, ?, ?)",
    ["GASTO", 15000, "Proveedores", "Compra de mercadería"],
  );
}
