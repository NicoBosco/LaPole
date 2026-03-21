# LaPole

LaPole es un dashboard de Fórmula 1 hecho con Next.js para consultar la temporada actual y la anterior con una UI enfocada en standings, resultados, calendario y comparativas.

## Qué resuelve

- vista principal con próxima carrera, standings, última fecha y calendario,
- listado de pilotos con búsqueda, favoritos locales y paginación,
- listado de constructores con fichas de detalle,
- comparador de pilotos lado a lado,
- páginas de detalle por piloto, equipo y carrera,
- tema claro/oscuro persistido en `localStorage`.

## Stack

- **Next.js 16** + **React 19**
- **TypeScript** en modo estricto
- **Tailwind CSS v4**
- **Zod** para validar respuestas de la API
- **Recharts** para gráficos
- **Vitest** + **Testing Library** para pruebas unitarias

## Fuente de datos

Los datos se consumen desde la [Jolpica F1 API](https://api.jolpi.ca/ergast/).

## Cómo se organiza

```text
app/                rutas con App Router
components/         componentes de UI y bloques de dominio
lib/api/            cliente HTTP, schemas Zod y mappers
lib/utils/          helpers de formato y lógica de temporada
hooks/              favoritos, tema y paginación
constants/          configuración global y metadatos de equipos
types/              contratos tipados de dominio y API
__tests__/          pruebas de hooks, utilidades y componentes
```

## Decisiones técnicas

- **Validación antes de renderizar:** la respuesta externa se parsea con Zod antes de pasar a la UI.
- **Mapeo de datos de dominio:** la app no usa directamente el shape crudo de Jolpica; primero lo transforma a modelos más simples para render.
- **Temporadas recientes:** el selector trabaja con la temporada actual y la anterior calculadas dinámicamente a partir del año UTC actual.
- **Actualización periódica:** los datos usan `revalidate`, así que el contenido se refresca por intervalos en vez de prometer tiempo real absoluto.
- **Persistencia liviana en cliente:** favoritos y tema se guardan en `localStorage` sin sumar estado global innecesario.

## Ejecutar en local

```bash
git clone https://github.com/NicoBosco/lapole.git
cd lapole
npm install
npm run dev
```

Abrí [http://localhost:3000](http://localhost:3000).

## Scripts

- `npm run dev`: entorno de desarrollo
- `npm run build`: build de producción
- `npm run start`: correr el build generado
- `npm run lint`: lint del proyecto
- `npm run typecheck`: chequeo de TypeScript
- `npm run test`: suite de tests unitarios

## Testing

Hoy la suite cubre principalmente:

- utilidades de temporada,
- hooks de favoritos y paginación,
- mappers de datos de carrera,
- navegación del selector de temporada,
- links críticos de componentes de piloto.

```bash
npm run test
```

## Limitaciones conocidas

- depende de la disponibilidad y consistencia de la Jolpica F1 API,
- no incluye autenticación ni backend propio,
- la cobertura de tests está enfocada en lógica clave, no en todos los flujos visuales,
- el contenido se actualiza por revalidación, no por streaming o sockets.

## Próximas mejoras razonables

- ampliar tests de integración para páginas detail y estados de error,
- sumar una demo desplegada y capturas al README,
- agregar filtros extra por carrera o equipo.

## Nota

Proyecto personal de portfolio de Bosco Mateo Nicolás.
No está afiliado oficialmente a la Fórmula 1, la FIA ni a ningún equipo.
