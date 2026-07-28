# Formato de preguntas

El archivo de preguntas es un JSON que contiene un array de objetos `Question`. Cada pregunta pertenece a un examen de certificación identificado por `certificationExamId`.

## Estructura

| Propiedad        | Tipo      | Descripción                                                    |
| ---------------- | --------- | -------------------------------------------------------------- |
| `id`             | `string`  | Identificador único de la pregunta.                            |
| `certificationExamId` | `string`  | Identificador del examen de certificación al que pertenece.    |
| `topic`          | `string`  | Tema al que pertenece la pregunta.                             |
| `difficulty`     | `string`  | Dificultad: `easy`, `medium` o `hard`.                         |
| `type`           | `string`  | Tipo: `single_choice` o `multiple_choice`.                     |
| `question`       | `string`  | Enunciado de la pregunta.                                      |
| `options`        | `array`   | Lista de opciones. Cada opción tiene `id` y `text`.            |
| `correctAnswers` | `array`   | IDs de las opciones correctas.                                 |
| `explanation`    | `string`  | Explicación de la respuesta correcta.                          |

## Reglas

- Para `single_choice`, `correctAnswers` debe contener exactamente un `id`.
- Para `multiple_choice`, `correctAnswers` debe contener al menos dos `id`.
- Cada valor de `correctAnswers` debe coincidir con el `id` de una opción existente.
- Los nombres de propiedades coinciden con el modelo TypeScript.

## Ejemplo

```json
[
  {
    "id": "q001",
    "certificationExamId": "saa-c03",
    "topic": "Azure Compute",
    "difficulty": "easy",
    "type": "single_choice",
    "question": "¿Qué servicio de Azure permite ejecutar contenedores sin administrar servidores?",
    "options": [
      { "id": "opt1", "text": "Azure Container Instances" },
      { "id": "opt2", "text": "Azure Virtual Machines" },
      { "id": "opt3", "text": "Azure App Service" }
    ],
    "correctAnswers": ["opt1"],
    "explanation": "Azure Container Instances permite ejecutar contenedores sin gestionar infraestructura."
  }
]
```
