# AGENTS.md

Guías de comportamiento para reducir errores comunes al trabajar con modelos de IA en este proyecto.

**Compromiso:** Estas guías priorizan la cautela sobre la velocidad. Para tareas triviales, usa el criterio.

---

## Contexto del Proyecto

**Nombre:** posts-comments-manager
**Descripción:** Aplicación para gestionar publicaciones (posts) y comentarios.
**Estructura:**
```
posts-comments-manager/
├── backend/    # API / lógica del servidor
└── frontend/   # Interfaz de usuario
```

Antes de tocar código, identifica en cuál capa vive la tarea y respeta esa separación.

---

## 1. Piensa Antes de Codificar

**No asumas. No ocultes la confusión. Expón los compromisos.**

Antes de implementar cualquier cosa:
- Declara tus suposiciones explícitamente. Si hay incertidumbre, pregunta.
- Si existen varias interpretaciones, preséntales todas — no elijas en silencio.
- Si existe un enfoque más simple, dilo. Cuestiona cuando sea necesario.
- Si algo no está claro, detente. Nombra qué es confuso. Pregunta.

---

## 2. Simplicidad Primero

**El mínimo código que resuelve el problema. Nada especulativo.**

- Sin funcionalidades más allá de lo solicitado.
- Sin abstracciones para código de un solo uso.
- Sin "flexibilidad" o "configurabilidad" que no haya sido pedida.
- Sin manejo de errores para escenarios imposibles.
- Si escribes 200 líneas y podrían ser 50, reescríbelo.

Pregúntate: *"¿Un desarrollador senior diría que esto está sobrecomplicado?"* Si la respuesta es sí, simplifica.

---

## 3. Cambios Quirúrgicos

**Toca solo lo que debes. Limpia únicamente tu propio desorden.**

Al editar código existente:
- No "mejores" código adyacente, comentarios ni formato.
- No refactorices cosas que no están rotas.
- Mantén el estilo existente, aunque lo harías distinto.
- Si notas código muerto sin relación, menciónalo — no lo borres.

Cuando tus cambios generen huérfanos:
- Elimina imports/variables/funciones que TUS cambios dejaron sin uso.
- No elimines código muerto preexistente salvo que se te pida.

La prueba: cada línea modificada debe trazarse directamente al pedido del usuario.

---

## 4. Ejecución Orientada a Objetivos

**Define criterios de éxito. Itera hasta verificar.**

Transforma las tareas en metas verificables:
- "Agregar validación" → "Escribir tests para entradas inválidas y luego hacerlos pasar"
- "Corregir el bug" → "Escribir un test que lo reproduzca y luego hacerlo pasar"
- "Refactorizar X" → "Asegurarse de que los tests pasen antes y después"

Para tareas de múltiples pasos, declara un plan breve:
```
1. [Paso] → verificar: [comprobación]
2. [Paso] → verificar: [comprobación]
3. [Paso] → verificar: [comprobación]
```

Criterios de éxito fuertes permiten iterar de forma independiente. Criterios débiles ("que funcione") requieren clarificación constante.

---

## 5. Convenciones de Este Proyecto

### General
- El idioma del código (variables, funciones, comentarios técnicos) puede ser inglés; la comunicación con el equipo es en español.
- Los mensajes de commit deben ser descriptivos y en español.
- Mantén la separación estricta entre `backend/` y `frontend/`.

### Backend
- La lógica de negocio (posts y comentarios) debe estar encapsulada en servicios/repositorios.
- Las rutas/controladores no deben contener lógica de negocio.
- Valida las entradas en la capa de API antes de llegar al servicio.

### Frontend
- Los componentes deben ser pequeños y con una sola responsabilidad.
- El estado global solo cuando sea estrictamente necesario; preferir estado local.
- Separa la lógica de llamadas a la API de los componentes de UI.

---

## 6. Lo Que NO Hacer

- No instales dependencias sin mencionar la razón y alternativas consideradas.
- No cambies la configuración del entorno (variables de entorno, archivos `.env`) sin avisarlo explícitamente.
- No hagas suposiciones sobre el esquema de base de datos; si no está definido, pregunta.
- No generes datos de ejemplo con información personal real.
- No elimines migraciones, seeders o datos de configuración sin confirmación.

---

**Estas guías están funcionando si:** los diffs tienen menos cambios innecesarios, hay menos reescrituras por sobrecomplicación, y las preguntas de aclaración llegan antes de la implementación en lugar de después de los errores.
