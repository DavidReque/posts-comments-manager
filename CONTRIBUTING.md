# Estándares de Código

## 1. Convenciones para Mensajes de Commit
Sigo la especificación de [Conventional Commits](https://www.conventionalcommits.org/).

**Formato:**

```text
<tipo>(<alcance opcional>): <descripción en español>

[cuerpo opcional con más detalles]

[footer opcional, p. ej. referencias: Closes #12]
```

**Tipos habituales:**

| Tipo       | Uso |
|-----------|-----|
| `feat`    | Nueva funcionalidad |
| `fix`     | Corrección de bug |
| `docs`    | Solo documentación |
| `style`   | Formato / estilo de código (sin cambiar comportamiento) |
| `refactor`| Cambio interno sin nueva feature ni fix de bug |
| `perf`    | Mejora de rendimiento |
| `test`    | Añadir o ajustar tests |
| `build`   | Compilación, empaquetado o herramientas de build |
| `ci`      | Integración continua o pipelines |
| `chore`   | Mantenimiento (dependencias, tooling) que no encaja en `build` o `ci` |
| `revert`  | Revierte un commit anterior |

**Alcance (`scope`):** opcional; suele ser la capa o módulo, por ejemplo `feat(backend):`, `fix(frontend):`.