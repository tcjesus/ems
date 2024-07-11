import Header from "components/Headers/Header";
import { useEffect, useState } from "react";
import {
  useNavigate,
  useParams,
} from "react-router-dom";
import { Button, Card, CardBody, CardHeader, Container, Form, Input, Row } from "reactstrap";

import GrandezaSelect from "components/Selects/GrandezaSelect";
import { Col, FormGroup } from "reactstrap";
import SensorService from "services/SensorService";

const target = '/admin/sensors'
const resource = 'Zone'
const service = SensorService

const EspecificacaoComponent = ({ index, id, grandeza, valorMinimo, valorMaximo, sinal, onChange, enableRemove, onRemove }) => {
  const _onChange = (e) => {
    if (!onChange) {
      return;
    }

    onChange(index, e.target.name, e.target.value);
  }

  const onChangeNumber = (e) => {
    if (e.preventDefault) e.preventDefault();

    const value = e.target.value ? parseFloat(e.target.value) : ''
    onChange(index, e.target.name, value);
  }

  return (
    <>
      <Input
        id={`input-especificacao-id-${index}`}
        type="hidden"
        name="id"
        value={id}
        onChange={_onChange}
      />
      <div className="d-flex align-items-center">
        <Row>
          <Col lg="4" sm="6">
            <FormGroup>
              <label
                className="form-control-label"
                htmlFor={`input-especificacao-grandeza-${index}`}
              >
                Grandeza
              </label>
              <GrandezaSelect
                id={`input-especificacao-grandeza-${index}`}
                name="grandeza"
                value={grandeza}
                onChange={_onChange}
              />
            </FormGroup>
          </Col>
          <Col lg="2" sm="3">
            <FormGroup>
              <label
                className="form-control-label"
                htmlFor={`input-especificacao-valor-minimo-${index}`}
              >
                Valor Mínimo
              </label>
              <Input
                id={`input-especificacao-valor-minimo-${index}`}
                className="form-control-alternative"
                type="number"
                placeholder="0"
                name="valorMinimo"
                value={valorMinimo}
                onChange={onChangeNumber}
              />
            </FormGroup>
          </Col>
          <Col lg="2" sm="3">
            <FormGroup>
              <label
                className="form-control-label"
                htmlFor={`input-especificacao-valor-maximo-${index}`}
              >
                Valor Máximo
              </label>
              <Input
                id={`input-especificacao-valor-maximo-${index}`}
                className="form-control-alternative"
                type="number"
                placeholder="100"
                name="valorMaximo"
                onChange={onChangeNumber}
                value={valorMaximo}
              />
            </FormGroup>
          </Col>
          <Col lg="4" sm="6">
            <FormGroup>
              <label
                className="form-control-label"
                htmlFor={`input-especificacao-sinal-${index}`}
              >
                Tipo de Sinal
              </label>
              <Input
                id={`input-especificacao-sinal-${index}`}
                className="form-control-alternative"
                type="select"
                placeholder="DIGITAL"
                name="sinal"
                onChange={_onChange}
                value={sinal}
              >
                <option value="">Selecione um Sinal</option>
                <option value="DIGITAL">Digital</option>
                <option value="ANALOGICO">Analógico</option>
              </Input>
            </FormGroup>
          </Col>
        </Row>
        {enableRemove && (
          <Button
            color="danger rounded-circle shadow"
            size="sm"
            className="ml-3 ml-sm-4"
            onClick={() => onRemove(index)}
          >
            <i className="fas fa-close" />
          </Button>
        )}
      </div>
    </>
  )
}

const SensorForm = () => {
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  const params = useParams()
  const id = params?.id;

  const [record, setRecord] = useState({
    id: '',
    modelo: '',
    descricao: '',
    especificacoes: [{
      id: '',
      grandeza: '',
      valorMinimo: '',
      valorMaximo: '',
      sinal: ''
    }],
  })

  const onChange = (e) => {
    if (e.preventDefault) e.preventDefault();

    inputsHandler(e.target.name, e.target.value);
  }

  const inputsHandler = (property, value) => {
    setRecord({ ...record, [property]: value })
  }

  const especificacaoOnChange = (index, property, value) => {
    const newList = [...record.especificacoes];
    newList[index][property] = value;

    inputsHandler('especificacoes', newList);
  }

  const especificacaoOnRemove = (index) => {
    if (record.especificacoes.length <= 1) {
      return
    }

    if (window.confirm('Deseja realmente excluir este registro?')) {
      const newList = [...record.especificacoes]
      newList.splice(index, 1)
      inputsHandler('especificacoes', newList);
    }
  }

  const save = async (e) => {
    try {
      e.preventDefault();
      const _record = { ...record };
      _record.especificacoes = _record.especificacoes.filter(e => e.grandeza);
      _record.especificacoes.forEach(e => {
        Object.keys(e).forEach(key => {
          if (e[key] === '') {
            e[key] = null;
          }
        })
      })
      await service.save(_record);
      navigate(target);
    } catch (error) {
      console.error(error);
      alert('Erro ao salvar registro!');
    }
  }

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await service.get(id);
        setRecord(response);
      } catch (error) {
        console.error(error);
        alert('Erro ao buscar registro!');
      }
    }
    if (isLoading && id) {
      fetchData();
    }
    setIsLoading(false);
  }, [id, isLoading]);

  return (
    <>
      <Header />
      <Container className="mt--7" fluid>
        <Row className="mt-5">
          <div className="col">
            <Card className="bg-default shadow">
              <CardHeader className="bg-transparent border-0">
                <h3 className="text-white mb-0">{id ? `Edit ${resource}` : `Add ${resource}`}</h3>
              </CardHeader>
              <CardBody>
                <Form>
                  <div className="pl-lg-4">
                    <Input
                      id="input-id"
                      type="hidden"
                      name="id"
                      value={record.id}
                    />
                    <Row>
                      <Col lg="4">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-modelo"
                          >
                            Modelo
                          </label>
                          <Input
                            id="input-modelo"
                            className="form-control-alternative"
                            type="text"
                            placeholder="CM18-2008A"
                            name="modelo"
                            onChange={onChange}
                            value={record.modelo}
                          />
                        </FormGroup>
                      </Col>
                      <Col lg="8">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-descricao"
                          >
                            Descrição
                          </label>
                          <Input
                            id="input-descricao"
                            className="form-control-alternative"
                            type="text"
                            placeholder="Sensor com cabo capacitivo..."
                            name="descricao"
                            onChange={onChange}
                            value={record.descricao}
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col lg="12">
                        <FormGroup>
                          <div className="d-flex align-items-center">
                            <h4 className="mb-0 text-white">Especificações</h4>
                            <Button
                              className="ml-3 rounded-circle shadow"
                              color="primary"
                              size="sm"
                              onClick={() => {
                                const newList = [...record.especificacoes];
                                newList.push({ id: '', grandeza: '', valorMinimo: '', valorMaximo: '', sinal: '' });

                                inputsHandler('especificacoes', newList)
                              }}
                            >
                              <i className="fas fa-plus" />
                            </Button>
                          </div>
                          {
                            record.especificacoes.map((especificacao, index) => {
                              return (
                                <Row key={`especificacao-${index}`}>
                                  <Col lg="12">
                                    <EspecificacaoComponent
                                      index={index}
                                      id={especificacao.id}
                                      grandeza={especificacao.grandeza}
                                      valorMinimo={especificacao.valorMinimo}
                                      valorMaximo={especificacao.valorMaximo}
                                      sinal={especificacao.sinal}
                                      onChange={especificacaoOnChange}
                                      enableRemove={record.especificacoes.length > 1}
                                      onRemove={especificacaoOnRemove}
                                    />
                                    {index < record.especificacoes.length - 1 && <hr className="mt-2 mb-4 bg-white" />}
                                  </Col>
                                </Row>
                              )
                            })
                          }
                        </FormGroup>
                      </Col>
                    </Row >
                    <div className="text-right">
                      <Button
                        color="danger"
                        onClick={() => {
                          navigate(target);
                        }}
                      >
                        Cancelar
                      </Button>

                      <Button
                        color="success"
                        onClick={save}
                      >
                        Salvar
                      </Button>
                    </div>
                  </div>
                </Form>
              </CardBody>
            </Card>
          </div>
        </Row>
      </Container>
    </>
  );
}

export default SensorForm;