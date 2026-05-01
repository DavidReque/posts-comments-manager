import { Controller, Get } from '@nestjs/common';
import { ApiResponse } from './common/utils/api-response';

@Controller()
export class AppController {
  @Get()
  root() {
    return ApiResponse.success({ ok: true }, 'API funcionando correctamente');
  }
}
