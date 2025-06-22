import express from 'express';
import fetch from 'node-fetch';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwyB4S_ZwJYUueqtfQnRaoZB7UxNVDbK1msIlIoDzDNBKVQqR3QaAFLgewvXz9otaZY/exec';

app.get("/", (req, res) => {
  res.send("Servidor WhatsApp Bot activo ✅");
});

app.post('/mensaje', async (req, res) => {
  console.log('📩 Cuerpo recibido:', req.body);

  const mensaje = req.body?.mensaje || req.body?.query?.message;

  if (!mensaje || mensaje.trim().length < 2) {
    return res.json({ message: "Por favor escribe una pregunta más clara 😊" });
  }

  try {
    const respuesta = await fetch(SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mensaje })
    });

    const data = await respuesta.json();
    const texto = data.respuesta || "No tengo una respuesta en este momento.";
    const corto = texto.slice(0, 1500);

    return res.json({ message: corto });

  } catch (error) {
    console.error('❌ Error al llamar al Apps Script:', error);
    return res.status(500).json({
      message: "Ocurrió un error al consultar la información."
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Servidor escuchando en http://localhost:${PORT}/mensaje`);
});
