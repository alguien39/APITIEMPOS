const express = require('express');
const pool = require('./db');

function createCrudRouter(table, columns) {
  const router = express.Router();
  const allowedColumns = new Set(columns);

  router.get('/', async (req, res) => {
    try {
      const [rows] = await pool.query(`SELECT * FROM ${table}`);
      res.json(rows);
    } catch (error) {
      res.status(500).json({ message: 'Error al listar registros', error: error.message });
    }
  });

  router.get('/:id', async (req, res) => {
    try {
      const [rows] = await pool.query(`SELECT * FROM ${table} WHERE id = ?`, [req.params.id]);

      if (rows.length === 0) {
        return res.status(404).json({ message: 'Registro no encontrado' });
      }

      res.json(rows[0]);
    } catch (error) {
      res.status(500).json({ message: 'Error al buscar registro', error: error.message });
    }
  });

  router.post('/', async (req, res) => {
    try {
      const data = cleanBody(req.body, allowedColumns);

      if (Object.keys(data).length === 0) {
        return res.status(400).json({ message: 'No hay datos validos para guardar' });
      }

      const [result] = await pool.query(`INSERT INTO ${table} SET ?`, [data]);
      const [rows] = await pool.query(`SELECT * FROM ${table} WHERE id = ?`, [result.insertId]);
      res.status(201).json(rows[0]);
    } catch (error) {
      res.status(500).json({ message: 'Error al crear registro', error: error.message });
    }
  });

  router.put('/:id', async (req, res) => {
    try {
      const data = cleanBody(req.body, allowedColumns);

      if (Object.keys(data).length === 0) {
        return res.status(400).json({ message: 'No hay datos validos para actualizar' });
      }

      const [result] = await pool.query(`UPDATE ${table} SET ? WHERE id = ?`, [data, req.params.id]);

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Registro no encontrado' });
      }

      const [rows] = await pool.query(`SELECT * FROM ${table} WHERE id = ?`, [req.params.id]);
      res.json(rows[0]);
    } catch (error) {
      res.status(500).json({ message: 'Error al actualizar registro', error: error.message });
    }
  });

  router.delete('/:id', async (req, res) => {
    try {
      const [result] = await pool.query(`DELETE FROM ${table} WHERE id = ?`, [req.params.id]);

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Registro no encontrado' });
      }

      res.json({ message: 'Registro eliminado correctamente' });
    } catch (error) {
      res.status(500).json({ message: 'Error al eliminar registro', error: error.message });
    }
  });

  return router;
}

function cleanBody(body, allowedColumns) {
  return Object.fromEntries(
    Object.entries(body).filter(([key]) => allowedColumns.has(key))
  );
}

module.exports = createCrudRouter;
