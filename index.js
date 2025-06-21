const express = require('express');
const fetch = require('node-fetch');
const app = express();

app.use(express.json());

app.post('/mensaje', async (req, res) => {
  const mensaje = (req.body.mensaje || '').toLowerCase();

  if (mensaje.includes('cuánto cuesta') || mensaje.includes('precio')) {
    const partes = mensaje.split(' ');
    const producto = partes[partes.length - 1]; // última palabra

    try {
      const url = `https://script.google.com/macros/s/AKfycbwpolH9evQeQXSa_lKO4ogRseRpXzZtvQ-LODP9yGBVquogWsATXxBQPQHhirMMltwX/exec?producto=${encodeURIComponent(producto)}`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.exito) {
        const respuesta = `🧴 *${data.Producto}* (${data.Marca})\n💰 Precio: $${data.Precio}\n📦 Estado: ${data.Disponibilidad}\n📝 ${data.Descripcion}`;
        return res.json({ respuesta, imagen: data.imagen });
      } else {
        return res.json({ respuesta: `❌ Producto "${producto}" no encontrado.` });
      }

    } catch (err) {
      console.error(err);
      return res.json({ respuesta: '⚠️ Error al consultar la hoja de productos.' });
    }

  } else {
    return res.json({ respuesta: '🤖 Hola, puedes escribirme por ejemplo: "¿Cuánto cuesta ésika?"' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Servidor escuchando en http://localhost:${PORT}/mensaje`);
});
