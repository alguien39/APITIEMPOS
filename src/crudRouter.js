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

      // Validación para evitar restricciones duplicadas por usuario+aplicación
      if (table === 'restricciones' && data.usuario_id && data.aplicacion_id) {
        const [existing] = await pool.query(
          `SELECT id FROM restricciones WHERE usuario_id = ? AND aplicacion_id = ? LIMIT 1`,
          [data.usuario_id, data.aplicacion_id]
        );

        if (existing.length > 0) {
          return res.status(400).json({ message: 'Ya existe una restricción para este usuario y aplicación' });
        }
      }

      if (table === 'uso_diario' && data.usuario_id && data.aplicacion_id && data.fecha) {
        const minutosUsados = data.minutos_usados !== undefined ? data.minutos_usados : 0;

        await pool.query(
          `INSERT INTO uso_diario (usuario_id, aplicacion_id, fecha, minutos_usados)
           VALUES (?, ?, ?, ?)
           ON DUPLICATE KEY UPDATE minutos_usados = VALUES(minutos_usados)`,
          [data.usuario_id, data.aplicacion_id, data.fecha, minutosUsados]
        );

        const [rows] = await pool.query(
          `SELECT * FROM uso_diario WHERE usuario_id = ? AND aplicacion_id = ? AND fecha = ?`,
          [data.usuario_id, data.aplicacion_id, data.fecha]
        );

        return res.status(201).json(rows[0]);
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

      // Si es la tabla restricciones, evitar que la actualización genere duplicados
      if (table === 'restricciones') {
        // Obtener valores actuales para comparar
        const [currentRows] = await pool.query(`SELECT * FROM restricciones WHERE id = ?`, [req.params.id]);
        if (currentRows.length === 0) {
          return res.status(404).json({ message: 'Registro no encontrado' });
        }

        const current = currentRows[0];
        const targetUsuario = data.usuario_id !== undefined ? data.usuario_id : current.usuario_id;
        const targetAplicacion = data.aplicacion_id !== undefined ? data.aplicacion_id : current.aplicacion_id;

        const [conflict] = await pool.query(
          `SELECT id FROM restricciones WHERE usuario_id = ? AND aplicacion_id = ? AND id != ? LIMIT 1`,
          [targetUsuario, targetAplicacion, req.params.id]
        );

        if (conflict.length > 0) {
          return res.status(400).json({ message: 'Actualización inválida: ya existe otra restricción para este usuario y aplicación' });
        }
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
