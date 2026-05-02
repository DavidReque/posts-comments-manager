// prueba para el pipe de truncado de texto
import { TruncatePipe } from './truncate.pipe';

describe('TruncatePipe', () => {
  const pipe = new TruncatePipe();

  it('devuelve texto vacio cuando el valor no existe', () => { // prueba para verificar que se devuelve texto vacio cuando el valor no existe
    // verifica que se devuelve texto vacio cuando el valor no existe
    expect(pipe.transform(null)).toBe('');
    expect(pipe.transform(undefined)).toBe('');
  });

  it('no recorta textos menores al limite', () => {
    expect(pipe.transform('  texto corto  ', 20)).toBe('texto corto');
  });

  it('recorta textos mayores al limite', () => {
    expect(pipe.transform('Este texto es demasiado largo', 10)).toBe(
      'Este texto...',
    );
  });
});
