import express from 'express';
import fetch from 'node-fetch';

const app = express();
app.use(express.json());

const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwGZ68JYS81yiSCDZX2ifyWY25D2PXxMQunB6ymt3w1KkD7_KIJdxLCMUV4wwbQi7Vd/exec';

app.post('/mensaje', async (req, res) => {
  const { mensaje } = req.body;

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
    res.json({ respuesta: data.respuesta });

  } catch (error) {
    console.error('Error al llamar al Apps Script:', error);
    res.status(500).json({ respuesta: 'Error interno del servidor.' });
  }
});

app.listen(3000, () => {
  console.log('✅ Servidor escuchando en http://localhost:3000/mensaje');
});
