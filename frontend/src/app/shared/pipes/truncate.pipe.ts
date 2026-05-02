// pipe para truncar el texto
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncate',
  standalone: true,
})
export class TruncatePipe implements PipeTransform { // pipe para truncar el texto
  transform(value: string | null | undefined, maxLength = 120): string {
    // verifica si el valor es null o undefined
    if (!value) {
      // retorna una cadena vacia
      return '';
    }

    const normalizedValue = value.trim();

    if (normalizedValue.length <= maxLength) {
      return normalizedValue;
    }

    return `${normalizedValue.slice(0, maxLength).trimEnd()}...`;
  }
}
