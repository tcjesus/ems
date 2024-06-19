import { Controller, Get } from '@nestjs/common'
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'

import { EstadoFacade } from '@/locality/services/EstadoFacade'
import { EstadoResponse } from '@/locality/structures/responses/EstadoResponse'

@Controller({ version: '1', path: 'estados' })
@ApiTags('estados')
@ApiBearerAuth('Role Access Token')
export class EstadoController {
  constructor(private readonly estadoFacade: EstadoFacade) { }

  @Get('/')
  @ApiOperation({ summary: 'Lista os Estados cadastrados no sistema' })
  @ApiOkResponse({ type: EstadoResponse, isArray: true })
  list(
  ): Promise<EstadoResponse[]> {
    return this.estadoFacade.list()
  }
}
