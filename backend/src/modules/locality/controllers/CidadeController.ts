import { Controller, Get, Query } from '@nestjs/common'
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger'

import { CidadeFacade } from '@/locality/services/CidadeFacade'
import { CidadeResponse } from '@/locality/structures/responses/CidadeResponse'

@Controller({ version: '1', path: 'cidades' })
  @ApiTags('cidades')
@ApiBearerAuth('Role Access Token')
export class CidadeController {
  constructor(private readonly cidadeFacade: CidadeFacade) { }

  @Get('/')
  @ApiOperation({ summary: 'Busca as Cidades cadastradas no sistema a partir da sigla do estado' })
  @ApiQuery({ name: 'sigla', description: 'Sigla do Estado', type: String, example: 'BA' })
  @ApiOkResponse({ type: CidadeResponse, isArray: true })
  findByEstado(
    @Query('sigla') siglaEstado: string,
  ): Promise<CidadeResponse[]> {
    return this.cidadeFacade.findByEstado(siglaEstado)
  }
}
