import express from 'express';
import fetch from 'node-fetch';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwLTMb4tV1gIvMK78e_BhUNOqpKf2slqDXEM0rLjBYcQRmH_hpRJNdV3L-2D0iIOkli/exec';

app.get("/", (req, res) => {
  res.send("Servidor WhatsApp Bot activo ✅");
});

app.post('/mensaje', async (req, res) => {
  console.log('📩 Cuerpo recibido:', req.body);

  const mensaje = req.body?.mensaje || req.body?.query?.message;

  if (!mensaje || mensaje.trim().length < 2) {
    return res.json({ replies: ["Por favor escribe una pregunta más clara 😊"] });
  }

  try {
    const respuesta = await fetch(SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mensaje })
    });

    const data = await respuesta.json();
    const respuestas = Array.isArray(data.respuesta) ? data.respuesta : [String(data.respuesta)];

    return res.json({ replies: respuestas });

  } catch (error) {
    console.error('❌ Error al llamar al Apps Script:', error);
    return res.status(500).json({
      replies: ["Error al consultar la información."]
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Servidor escuchando en http://localhost:${PORT}/mensaje`);
});
