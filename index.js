import express from 'express';
import fetch from 'node-fetch';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Para recibir datos en otros formatos

const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbw-csU5yUZY7ZHcJbrWEuggkWwaJ7Yj6pxSWItPYoLN-I5C5PaTi6xO4vhaL0KMzDNI/exec';

// ✅ Ruta raíz para saber si está vivo
app.get("/", (req, res) => {
  res.send("Servidor WhatsApp Bot activo ✅");
});

// ✅ Ruta para recibir el mensaje del AutoResponder
app.post('/mensaje', async (req, res) => {
  console.log('📩 Cuerpo recibido:', req.body);

  // Acepta diferentes formas en que puede llegar el mensaje
  const mensaje = req.body?.mensaje || req.body?.body || req.body?.text || null;

  if (!mensaje) {
    return res.status(400).json({ error: 'Falta el mensaje en el cuerpo de la solicitud' });
  }

  try {
    const respuesta = await fetch(SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mensaje })
    });

    const data = await respuesta.json();
    return res.json({ respuesta: data.respuesta });

  } catch (error) {
    console.error('❌ Error al llamar al Apps Script:', error);
    return res.status(500).json({ respuesta: 'Error interno del servidor.' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Servidor escuchando en http://localhost:${PORT}/mensaje`);
});
