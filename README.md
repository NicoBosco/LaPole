# LaPole

Dashboard de Fórmula 1 construido con Next.js para seguir la temporada actual: próxima carrera, clasificaciones, resultados y vistas de detalle por piloto/equipo.

## Stack

- Next.js 16 + React 19
- TypeScript
- Tailwind CSS v4
- Zod para validación de respuestas de API
- Recharts para gráficos

## Qué incluye

- Home con próxima carrera, standings y resumen de la última fecha (temporadas 2025 y 2026)
- Listado de pilotos con búsqueda, paginación y favoritos locales
- Listado de constructores con vista de detalle
- Comparador de pilotos lado a lado con gráficos de rendimiento
- Página de resultados por carrera
- Visualización de datos con gráficos comparativos
- Tema claro/oscuro persistido en `localStorage`

## Fuente de datos

Los datos se consumen desde la [Jolpica F1 API](https://api.jolpi.ca/ergast/).

## Ejecutar en local

```bash
git clone https://github.com/NicoBosco/lapole.git
cd LaPole
npm install
npm run dev
```

Abrí [http://localhost:3000](http://localhost:3000).

## Scripts

- `npm run dev`: entorno de desarrollo
- `npm run build`: build de producción
- `npm run start`: correr build
- `npm run lint`: lint del proyecto
- `npm run test`: correr la suite de tests unitarios (Vitest)

## Testing

El proyecto cuenta con pruebas unitarias enfocadas usando **Vitest** y **React Testing Library** para asegurar el correcto funcionamiento de los utilitarios clave y de persistencia local.

### Tests incluidos:
- **`usePagination`**: Cubre las reglas de límite, cambios de página fuera de rango y estados vacíos para la tabla de pilotos.
- **`useFavorites`**: Verifica la sincronización asíncrona correcta con LocalStorage simulando entornos del navegador.
- **`utils/season`**: Verificación de las lógicas de resolución y comparación dinámica de años.
- **`mappers (f1.test.ts)`**: Certifica que los datos de Ergast/Jolpica F1 API se normalizan de forma segura al formato estructurado de la UI (`ProcessedRace`).

Para ejecutar todos los tests rápidamente:
```bash
npm run test
```

## Estructura rápida

- `app/`: rutas con App Router
- `components/`: UI y bloques de dominio
- `lib/api/`: cliente, schemas y mappers de la API
- `hooks/`: estado de UI (tema, favoritos, paginación)
- `constants/` y `types/`: configuración y modelos

## Nota

Proyecto personal de portfolio de Bosco Mateo Nicolás.
No está afiliado oficialmente a la Fórmula 1, FIA ni equipos.