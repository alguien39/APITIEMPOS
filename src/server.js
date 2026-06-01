const express = require('express');
const cors = require('cors');
require('dotenv').config();

const createCrudRouter = require('./crudRouter');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    message: 'API Control de Tiempo Apps',
    endpoints: [
      '/api/usuarios',
      '/api/grupos',
      '/api/grupo-miembros',
      '/api/aplicaciones',
      '/api/dispositivos',
      '/api/restricciones',
      '/api/uso-diario',
      '/api/solicitudes-tiempo'
    ]
  });
});

app.use('/api/usuarios', createCrudRouter('usuarios', [
  'nombre',
  'email',
  'password',
  'estado'
]));

app.use('/api/grupos', createCrudRouter('grupos', [
  'nombre',
  'descripcion',
  'creado_por'
]));

app.use('/api/grupo-miembros', createCrudRouter('grupo_miembros', [
  'grupo_id',
  'usuario_id',
  'rol'
]));

app.use('/api/aplicaciones', createCrudRouter('aplicaciones', [
  'nombre',
  'paquete'
]));

app.use('/api/dispositivos', createCrudRouter('dispositivos', [
  'usuario_id',
  'nombre',
  'modelo'
]));

app.use('/api/restricciones', createCrudRouter('restricciones', [
  'grupo_id',
  'usuario_id',
  'aplicacion_id',
  'limite_diario_minutos',
  'estado'
]));

app.use('/api/uso-diario', createCrudRouter('uso_diario', [
  'usuario_id',
  'aplicacion_id',
  'fecha',
  'minutos_usados'
]));

app.use('/api/solicitudes-tiempo', createCrudRouter('solicitudes_tiempo', [
  'restriccion_id',
  'usuario_id',
  'minutos_solicitados',
  'mensaje',
  'estado'
]));

app.get('/api/restricciones/:id/disponible', async (req, res) => {
  const pool = require('./db');

  try {
    const [rows] = await pool.query(
      `SELECT
          r.id,
          r.limite_diario_minutos,
          COALESCE(SUM(u.minutos_usados), 0) AS minutos_usados,
          r.limite_diario_minutos - COALESCE(SUM(u.minutos_usados), 0) AS minutos_disponibles
       FROM restricciones r
       LEFT JOIN uso_diario u
          ON u.usuario_id = r.usuario_id
         AND u.aplicacion_id = r.aplicacion_id
         AND u.fecha = CURDATE()
       WHERE r.id = ?
       GROUP BY r.id, r.limite_diario_minutos`,
      [req.params.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Restriccion no encontrada' });
    }

    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Error al calcular tiempo disponible', error: error.message });
  }
});

app.use((req, res) => {
  res.status(404).json({ message: 'Ruta no encontrada' });
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
