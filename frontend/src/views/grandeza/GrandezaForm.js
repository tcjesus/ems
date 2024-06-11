import { Col, FormGroup, Input, Row } from "reactstrap";
import GrandezaService from "services/GrandezaService";
import DefaultForm from "views/DefaultForm";

const target = '/admin/grandezas'
const resource = 'Grandeza'
const service = GrandezaService
const initalRecord = {
  id: '',
  nome: '',
  unidadeMedida: '',
  sigla: ''
}

const BuildForm = (record, onChange) => {
  return (
    <>
      <Row>
        <Col lg="4">
          <FormGroup>
            <label
              className="form-control-label"
              htmlFor="input-nome"
            >
              Nome
            </label>
            <Input
              id="input-nome"
              className="form-control-alternative"
              type="text"
              placeholder="Temperatura"
              name="nome"
              onChange={onChange}
              value={record.nome}
            />
          </FormGroup>
        </Col>
        <Col lg="3">
          <FormGroup>
            <label
              className="form-control-label"
              htmlFor="input-unidade-medida"
            >
              Unidade de Medida
            </label>
            <Input
              id="input-unidade-medida"
              className="form-control-alternative"
              type="text"
              placeholder="Celsius"
              name="unidadeMedida"
              onChange={onChange}
              value={record.unidadeMedida}
            />
          </FormGroup>
        </Col>
        <Col lg="2">
          <FormGroup>
            <label
              className="form-control-label"
              htmlFor="input-sigla"
            >
              Sigla
            </label>
            <Input
              id="input-sigla"
              className="form-control-alternative"
              type="text"
              placeholder="°C"
              name="sigla"
              onChange={onChange}
              value={record.sigla}
            />
          </FormGroup>
        </Col>
      </Row>
    </>
  )
}

export default DefaultForm(target, resource, service, initalRecord, BuildForm)