# AStress Backend 🧠

Backend de la app de bienestar estudiantil **AStress**, construido con **NestJS** y **Prisma ORM** sobre **PostgreSQL**.

---

## 🗂 Estructura del proyecto

```
astress-backend/
├── prisma/
│   ├── schema.prisma        # Modelos de la base de datos
│   └── seed.ts              # Datos iniciales (salas + frases)
├── src/
│   ├── main.ts              # Punto de entrada
│   ├── app.module.ts        # Módulo raíz
│   ├── prisma/              # Cliente de Prisma (global)
│   ├── auth/                # Registro y login
│   ├── users/               # Perfil e historial del usuario
│   ├── mood/                # Radar de Ánimo
│   ├── diary/               # Bitácora de Calma
│   ├── recommendations/     # Recomendaciones por nivel de ánimo
│   ├── community/           # Grupos de Apoyo + Muro
│   └── phrases/             # Frase del día
├── render.yaml              # Infraestructura en Render
├── .env.example             # Variables de entorno requeridas
└── package.json
```

---

## ⚙️ Instalación local

### 1. Clonar e instalar

```bash
git clone <tu-repo>
cd astress-backend
npm install
```

### 2. Configurar variables de entorno

```bash
cp .env.example .env
# Edita .env con tu cadena de conexión a PostgreSQL
```

### 3. Migrar la base de datos y ejecutar el seed

```bash
npx prisma migrate dev --name init
npm run prisma:seed
```

### 4. Iniciar el servidor

```bash
# Desarrollo (hot-reload)
npm run start:dev

# Producción
npm run build
npm run start:prod
```

El servidor corre en `http://localhost:3000/api`

---

## 🚀 Despliegue en Render

### Opción A — Blueprint (render.yaml) ⭐ Recomendada

1. Sube el proyecto a GitHub.
2. En Render → **New** → **Blueprint**.
3. Conecta tu repositorio.
4. Render leerá el `render.yaml` y creará automáticamente:
   - 🐘 Una base de datos PostgreSQL (`astress-db`)
   - 🌐 Un web service (`astress-backend`)
5. Haz clic en **Apply** y espera ~3 minutos.

### Opción B — Manual

1. **Base de datos:** Render → New → PostgreSQL → Free → Crear.
2. **Web Service:** Render → New → Web Service → conecta tu repo.
   - **Build Command:** `npm install && npx prisma generate && npm run build && npx prisma migrate deploy`
   - **Start Command:** `npm run start:prod`
   - **Environment Variable:** `DATABASE_URL` → pegar la "Internal Connection String" de tu DB de Render.
3. Deploy.

### Seed en producción

Después del primer deploy, ejecutar el seed desde la terminal de Render o localmente apuntando a la DB de producción:

```bash
DATABASE_URL="<tu-connection-string-de-render>" npm run prisma:seed
```

---

## 📡 API Reference

Todos los endpoints tienen el prefijo `/api`.

---

### 🔐 Auth

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/api/auth/register` | Registrar usuario |
| POST | `/api/auth/login` | Iniciar sesión |

**POST /api/auth/register**
```json
{
  "name": "María López",
  "email": "maria@universidad.mx",
  "password": "mipassword123"
}
```

**POST /api/auth/login**
```json
{
  "email": "maria@universidad.mx",
  "password": "mipassword123"
}
```
Respuesta: `{ message, user: { id, name, email, createdAt } }`

> ℹ️ El `id` del usuario devuelto en el login se usa como `userId` en el resto de los endpoints.

---

### 👤 Usuarios

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/users/:id` | Perfil del usuario |
| GET | `/api/users/:id/mood-history` | Historial de ánimo últimos 7 días |

---

### 😊 Radar de Ánimo

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/api/mood` | Registrar estado de ánimo |
| GET | `/api/mood/user/:userId` | Todas las entradas del usuario |
| GET | `/api/mood/user/:userId/latest` | Última entrada |
| DELETE | `/api/mood/:id` | Eliminar entrada |

**POST /api/mood**
```json
{
  "level": "MAL",
  "tags": ["EXAMENES", "FALTA_DE_SUENO"],
  "note": "Tengo parcial mañana y no dormí.",
  "userId": "clxxx123"
}
```

**Valores de `level`:**
- `A_TOPE` — Excelente 🚀
- `BIEN` — Bien 😊
- `REGULAR` — Regular 😐
- `MAL` — Mal 😞
- `BURNOUT_TOTAL` — Burnout total 🔥

**Valores de `tags`:**
- `EXAMENES`
- `FALTA_DE_SUENO`
- `PROBLEMAS_PERSONALES`
- `CARGA_DE_TAREAS`

---

### 📓 Bitácora de Calma (Diario)

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/api/diary` | Crear entrada de diario |
| GET | `/api/diary/user/:userId` | Todas las entradas del usuario |
| GET | `/api/diary/:id` | Obtener una entrada |
| PATCH | `/api/diary/:id` | Actualizar entrada |
| DELETE | `/api/diary/:id` | Eliminar entrada |

**POST /api/diary**
```json
{
  "content": "Hoy fue muy difícil pero lo logré.",
  "userId": "clxxx123"
}
```

---

### 💡 Recomendaciones

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/recommendations/levels` | Lista de niveles disponibles |
| GET | `/api/recommendations/:moodLevel` | Recomendaciones por nivel |

**Ejemplo:** `GET /api/recommendations/BURNOUT_TOTAL`

Respuesta incluye: tipo (`respiracion`, `descanso`, `tecnica`, `contenido`, `general`), título, descripción, duración y links a YouTube.

---

### 👥 Comunidad

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/community/rooms` | Listar salas |
| POST | `/api/community/rooms` | Crear sala |
| GET | `/api/community/rooms/:id` | Ver sala |
| GET | `/api/community/rooms/:roomId/posts` | Posts de una sala |
| POST | `/api/community/posts` | Publicar en el muro |
| DELETE | `/api/community/posts/:id` | Eliminar post |
| POST | `/api/community/posts/:postId/heart` | Toggle corazón ❤️ |

**POST /api/community/posts**
```json
{
  "content": "Hoy no puedo más con la tesis 😭",
  "isAnonymous": true,
  "userId": "clxxx123",
  "roomId": "room-id-aqui"
}
```

**POST /api/community/posts/:postId/heart**
```json
{
  "userId": "clxxx123"
}
```

---

### 💬 Frase del Día

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/phrases/today` | Frase del día (consistente) |
| GET | `/api/phrases/random` | Frase aleatoria |
| GET | `/api/phrases` | Todas las frases |
| POST | `/api/phrases` | Agregar frase |
| DELETE | `/api/phrases/:id` | Eliminar frase |

---

## 🛠 Stack

| Tecnología | Versión | Uso |
|------------|---------|-----|
| NestJS | ^10.x | Framework backend |
| Prisma ORM | ^6.x | ORM + migraciones |
| PostgreSQL | 15+ | Base de datos |
| bcryptjs | ^2.4.3 | Hash de contraseñas |
| class-validator | ^0.14 | Validación de DTOs |
| Render | — | Hosting + DB |
