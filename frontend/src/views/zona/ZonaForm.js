import { Col, FormGroup, Input, Row } from "reactstrap";
import ZonaService from "services/ZonaService";
import DefaultForm from "views/DefaultForm";

const target = '/admin/zonas'
const resource = 'Zona'
const service = ZonaService
const initalRecord = {
  id: '',
  nome: ''
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
              placeholder="Zona X"
              name="nome"
              onChange={onChange}
              value={record.nome}
            />
          </FormGroup>
        </Col>
      </Row>
    </>
  )
}

export default DefaultForm(target, resource, service, initalRecord, BuildForm)
