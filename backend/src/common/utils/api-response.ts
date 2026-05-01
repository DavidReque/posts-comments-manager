// utilidad para manejar las respuestas de la API
export class ApiResponse {
  // metodo para manejar las respuestas exitosas
  static success(data: any, message = 'OK') {
    return { success: true, message, data };
  }

  static error(message: string, status = 400) {
    return { success: false, message, status };
  }
}
