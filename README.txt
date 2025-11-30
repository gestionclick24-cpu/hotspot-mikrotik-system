Hotspot Mikrotik System - Lista para completar

Dentro de backend/src/ están los archivos principales del servidor Node.js.
Dentro de frontend/ está la SPA React (Vite).

Antes de ejecutar:
1. Copiar backend/.env.example -> backend/.env y completar variables.
2. En backend: npm install
3. Ejecutar migraciones: node scripts/run_migrations.js (opcional) o dejar que knex cree tablas en startup.
4. Iniciar backend: npm start
5. Frontend: cd frontend && npm install && npm run dev

MercadoPago:
- Usar MP_ACCESS_TOKEN en .env (sandbox o production)
- Configurar notification_url en el panel de MercadoPago apuntando a /api/mp/webhook

Hosting recomendado: Render.com (servicio gratuito que acepta Express + webhooks)

