import express from 'express';
import fetch from 'node-fetch';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbw-csU5yUZY7ZHcJbrWEuggkWwaJ7Yj6pxSWItPYoLN-I5C5PaTi6xO4vhaL0KMzDNI/exec';

app.get("/", (req, res) => {
  res.send("Servidor WhatsApp Bot activo ✅");
});

app.post('/mensaje', async (req, res) => {
  console.log('📩 Cuerpo recibido:', req.body);

  const mensaje = req.body?.mensaje || req.body?.query?.message;

  if (!mensaje) {
    return res.status(400).json({ error: 'Falta el mensaje en el cuerpo de la solicitud' });
  }

  try {
    const respuesta = await fetch(SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mensaje })
    });

   const texto = data.respuesta || "No tengo una respuesta en este momento.";

// 🔽 Dividir en partes si es muy largo
const partes = texto.match(/.{1,1000}/g); // hasta 1000 caracteres por parte

return res.json({ replies: partes });


  } catch (error) {
    console.error('❌ Error al llamar al Apps Script:', error);
    return res.status(500).json({
      replies: ["Ocurrió un error interno al consultar la información."]
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Servidor escuchando en http://localhost:${PORT}/mensaje`);
});
