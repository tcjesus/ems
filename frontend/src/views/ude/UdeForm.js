import ZonaSelect from "components/Selects/ZonaSelect";
import { Col, FormGroup, Input, Row } from "reactstrap";
import UdeService from "services/UdeService";

import Header from "components/Headers/Header";
import { useEffect, useState } from "react";
import {
  useNavigate,
  useParams,
} from "react-router-dom";
import { Button, Card, CardBody, CardHeader, Container, Form } from "reactstrap";

import GrandezaSelect from "components/Selects/GrandezaSelect";
import SensorSelect from "components/Selects/SensorSelect";
import TipoEmergenciaSelect from "components/Selects/TipoEmergenciaSelect";

const target = '/admin/edus'
const resource = 'Emergency Detection Unit'
const service = UdeService

const MonitoramentoComponent = ({
  dIndex,
  mIndex,
  id,
  tipoEmergencia,
  sensor,
  grandeza,
  thresholdMinimo,
  thresholdMaximo,
  intervaloAmostragem,
  taxaVariacaoMinima,
  ativo,
  onChange,
  enableRemove,
  onRemove
}) => {
  const _onChange = (e) => {
    if (!onChange) {
      return;
    }

    onChange(dIndex, mIndex, e.target.name, e.target.value);
  }

  const onChangeNumber = (e) => {
    if (e.preventDefault) e.preventDefault();

    const value = e.target.value ? parseFloat(e.target.value) : ''
    onChange(dIndex, mIndex, e.target.name, value);
  }

  const onChangeBoolean = (e) => {
    if (!onChange) {
      return;
    }

    onChange(dIndex, mIndex, e.target.name, e.target.checked);
  }

  return (
    <>
      <Input
        id={`input-monitoramento-id-${dIndex}-${mIndex}`}
        type="hidden"
        name="id"
        value={id}
        onChange={_onChange}
      />
      <div className="d-flex align-items-center justify-content-between">
        <Row>
          <Col lg="12">
            <FormGroup className="mb-0">
              <label
                className="form-control-label mb-0"
                htmlFor={`input-monitoramento-sensor-${dIndex}-${mIndex}`}
              >
                Sensor
              </label>
              <SensorSelect
                id={`input-monitoramento-sensor-${dIndex}-${mIndex}`}
                className="form-control-alternative"
                name="sensor"
                filter={(sensor) => {
                  return !tipoEmergencia || sensor.especificacoes?.some(e => tipoEmergencia?.grandezas?.find(g => g.id === e.grandeza.id))
                }}
                onChange={(e) => {
                  const sensor = e.target.value;
                  if (sensor) {
                    _onChange({ target: { name: 'grandeza', value: sensor.especificacoes[0]?.grandeza } });
                  }
                  _onChange(e);
                }}
                value={sensor}
              />
            </FormGroup>
          </Col>
          <Col lg="12">
            <FormGroup className="mb-0">
              <label
                className="form-control-label mb-0"
                htmlFor={`input-monitoramento-grandeza-${dIndex}-${mIndex}`}
              >
                Variable
              </label>
              <GrandezaSelect
                id={`input-monitoramento-grandeza-${dIndex}-${mIndex}`}
                className="form-control-alternative"
                name="grandeza"
                filter={(grandeza) => {
                  return (!sensor && !tipoEmergencia)
                    || sensor?.especificacoes?.some(e => e.grandeza.id === grandeza.id)
                    || tipoEmergencia?.grandezas?.some(g => g.id === grandeza.id)
                }}
                onChange={_onChange}
                value={grandeza}
              />
            </FormGroup>
          </Col>
          <Col lg="6">
            <FormGroup className="mb-0">
              <label
                className="form-control-label mb-0"
                htmlFor={`input-monitoramento-threshold-minimo-${dIndex}-${mIndex}`}
              >
                Min. Threshold
              </label>
              <Input
                id={`input-monitoramento-threshold-minimo-${dIndex}-${mIndex}`}
                className="form-control-alternative"
                type="number"
                placeholder="Min. Threshold"
                name="thresholdMinimo"
                onChange={onChangeNumber}
                value={thresholdMinimo}
              />
            </FormGroup>
          </Col>
          <Col lg="6">
            <FormGroup className="mb-0">
              <label
                className="form-control-label mb-0"
                htmlFor={`input-monitoramento-threshold-maximo-${dIndex}-${mIndex}`}
              >
                Max. Threshold
              </label>
              <Input
                id={`input-monitoramento-threshold-maximo-${dIndex}-${mIndex}`}
                className="form-control-alternative"
                type="number"
                placeholder="Max. Threshold"
                name="thresholdMaximo"
                onChange={onChangeNumber}
                value={thresholdMaximo}
              />
            </FormGroup>
          </Col>
          <Col lg="6">
            <FormGroup className="mb-0">
              <label
                className="form-control-label mb-0"
                htmlFor={`input-monitoramento-intervalo-amostragem-${dIndex}-${mIndex}`}
              >
                Sampling Interval
              </label>
              <Input
                id={`input-monitoramento-intervalo-amostragem-${dIndex}-${mIndex}`}
                className="form-control-alternative"
                type="number"
                placeholder="In seconds"
                name="intervaloAmostragem"
                onChange={onChangeNumber}
                value={intervaloAmostragem}
              />
            </FormGroup>
          </Col>
          <Col lg="6">
            <FormGroup className="mb-0">
              <label
                className="form-control-label mb-0"
                htmlFor={`input-monitoramento-taxa-variacao-minima-${dIndex}-${mIndex}`}
              >
                Min Variation Rate (%)
              </label>
              <Input
                id={`input-monitoramento-taxa-variacao-minima-${dIndex}-${mIndex}`}
                className="form-control-alternative"
                type="number"
                placeholder="0.1"
                min="0"
                max="1"
                name="taxaVariacaoMinima"
                onChange={onChangeNumber}
                value={taxaVariacaoMinima}
              />
            </FormGroup>
          </Col>
          <Col xs="12">
            <div className="mt-2 d-flex align-items-center justify-content-between">
              <FormGroup className="m-0 pl-4 custom-checkbox">
                <Input
                  id={`input-monitoramento-ativo-${dIndex}-${mIndex}`}
                  name="ativo"
                  type="checkbox"
                  style={{ transform: 'scale(1.8)' }}
                  onChange={onChangeBoolean}
                  checked={ativo}
                />
                <label
                  className="ml-2 form-control-label"
                  style={{ fontSize: '1rem' }}
                  htmlFor={`input-monitoramento-ativo-${dIndex}-${mIndex}`}
                >
                  <span className="text-muted">
                    Enabled
                  </span>
                </label>
              </FormGroup>
              {enableRemove && (
                <Button
                  color="danger rounded-circle shadow"
                  size="sm"
                  className="ml-3 ml-sm-4"
                  onClick={() => onRemove(dIndex, mIndex)}
                >
                  <i className="fas fa-trash" />
                </Button>
              )}
            </div>
          </Col>
        </Row>
      </div>
    </>
  )
}

const DeteccaoEmergenciaComponent = ({
  index,
  id,
  tipoEmergencia,
  monitoramentos,
  onChange,
  enableRemove,
  onRemove,
  monitoramentoOnChange,
  monitoramentoOnRemove
}) => {
  const _onChange = (e) => {
    if (!onChange) {
      return;
    }

    onChange(index, e.target.name, e.target.value);
  }

  return (
    <>
      <Input
        id={`input-deteccao-id-${index}`}
        type="hidden"
        name="id"
        value={id}
        onChange={_onChange}
      />
      <div className="mb-2 d-flex align-items-center justify-content-between">
        <div>
          <Row>
            <Col lg="4" className="d-flex align-items-center">
              <FormGroup>
                <label
                  className="form-control-label"
                  htmlFor={`input-deteccao-tipo-emergencia-${index}`}
                >
                  Emergency Types
                </label>
                <TipoEmergenciaSelect
                  id={`input-deteccao-tipo-emergencia-${index}`}
                  className="form-control-alternative"
                  name="tipoEmergencia"
                  onChange={_onChange}
                  value={tipoEmergencia}
                />
              </FormGroup>
              {enableRemove && (
                <Button
                  color="danger rounded-circle shadow"
                  size="sm"
                  className="ml-3 ml-sm-4"
                  onClick={() => onRemove(index)}
                >
                  <i className="fas fa-close" />
                </Button>
              )
              }
            </Col>
          </Row>
          <Row>
            <Col lg="12">
              <div className="d-flex align-items-center">
                <h5 className="mb-0 text-white">Monitoring</h5>
                <Button
                  className="ml-3 rounded-circle shadow"
                  color="primary"
                  size="sm"
                  onClick={() => {
                    const newList = [...monitoramentos];
                    newList.push({ id: '', sensor: '', grandeza: '', thresholdMinimo: '', thresholdMaximo: '', ativo: true });

                    _onChange({ target: { name: 'monitoramentos', value: newList } });
                  }}
                >
                  <i className="fas fa-plus" />
                </Button>
              </div>
            </Col>
          </Row>
          <Row>
            {
              monitoramentos?.map((monitoramento, _index) => {
                return (
                  <Col lg="4" key={`monitoramento-${_index}`}>
                    <MonitoramentoComponent
                      dIndex={index}
                      mIndex={_index}
                      id={monitoramento.id}
                      tipoEmergencia={tipoEmergencia}
                      sensor={monitoramento.sensor}
                      grandeza={monitoramento.grandeza}
                      thresholdMinimo={monitoramento.thresholdMinimo}
                      thresholdMaximo={monitoramento.thresholdMaximo}
                      intervaloAmostragem={monitoramento.intervaloAmostragem}
                      taxaVariacaoMinima={monitoramento.taxaVariacaoMinima}
                      ativo={monitoramento.ativo}
                      onChange={monitoramentoOnChange}
                      enableRemove={monitoramentos.length > 1}
                      onRemove={monitoramentoOnRemove}
                    />
                  </Col>
                )
              })
            }
          </Row>
        </div >
      </div >
    </>
  )
}

const UdeForm = () => {
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  const params = useParams()
  const id = params?.id;

  const [record, setRecord] = useState({
    tipo: '',
    label: '',
    mac: '',
    latitude: '',
    longitude: '',
    operatingRange: '',
    zona: {},
    deteccoesEmergencia: [{
      id: '',
      tipoEmergencia: '',
      monitoramentos: [{
        id: '',
        sensor: '',
        grandeza: '',
        thresholdMinimo: '',
        thresholdMaximo: '',
        intervaloAmostragem: '',
        taxaVariacaoMinima: '',
        ativo: true,
      }],
    }],
  })

  const onChange = (e) => {
    if (e.preventDefault) e.preventDefault();

    inputsHandler(e.target.name, e.target.value);
  }

  const onChangeNumber = (e) => {
    if (e.preventDefault) e.preventDefault();

    const value = e.target.value ? parseFloat(e.target.value) : ''
    inputsHandler(e.target.name, value);
  }

  const inputsHandler = (property, value) => {
    setRecord({ ...record, [property]: value })
  }

  const deteccaoOnChange = (index, property, value) => {
    const newList = [...record.deteccoesEmergencia];
    newList[index][property] = value;

    inputsHandler('deteccoesEmergencia', newList);
  }

  const monitoramentoOnChange = (dIndex, mIndex, property, value) => {
    const newList = [...record.deteccoesEmergencia];
    newList[dIndex].monitoramentos[mIndex][property] = value;

    inputsHandler('deteccoesEmergencia', newList);
  }

  const deteccaoOnRemove = (index) => {
    if (record.deteccoesEmergencia.length <= 1) {
      return
    }

    if (window.confirm('Deseja realmente excluir este registro?')) {
      const newList = [...record.deteccoesEmergencia]
      newList.splice(index, 1)
      inputsHandler('deteccoesEmergencia', newList);
    }
  }

  const monitoramentoOnRemove = (dIndex, mIndex) => {
    if (record.deteccoesEmergencia[dIndex].monitoramentos.length <= 1) {
      return
    }

    if (window.confirm('Deseja realmente excluir este registro?')) {
      const newList = [...record.deteccoesEmergencia]
      const m = [...newList[dIndex].monitoramentos]
      m.splice(mIndex, 1)
      newList[dIndex].monitoramentos = m

      inputsHandler('deteccoesEmergencia', newList);
    }
  }

  const save = async (e) => {
    try {
      e.preventDefault();
      const _record = { ...record };
      _record.deteccoesEmergencia = _record.deteccoesEmergencia.filter(e => e.tipoEmergencia);
      _record.deteccoesEmergencia.forEach(d => {
        Object.keys(d).forEach(key => {
          if (d[key] === '') {
            d[key] = null;
          }
        })
        d.monitoramentos = d.monitoramentos.filter(m => m.sensor && m.grandeza);
        d.monitoramentos.forEach(m => {
          Object.keys(m).forEach(key => {
            if (m[key] === '') {
              m[key] = null;
            }
          })
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
                      <Col xl="2" md="3">
                        <FormGroup className="mb-0">
                          <label
                            className="form-control-label"
                            htmlFor="input-tipo"
                          >
                            Type
                          </label>
                          <Input
                            id="input-tipo"
                            className="form-control-alternative"
                            type="select"
                            name="tipo"
                            onChange={onChange}
                            value={record.tipo}
                          >
                            <option value="">Selecione um Tipo</option>
                            <option value="APC">HPC</option>
                            <option value="MBC">MBC</option>
                            <option value="BPC">LPC</option>
                          </Input>
                        </FormGroup>
                      </Col>
                      <Col xl="3" md="5">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-label"
                          >
                            Label
                          </label>
                          <Input
                            id="input-label"
                            className="form-control-alternative"
                            type="text"
                            placeholder="Label"
                            name="label"
                            onChange={onChange}
                            value={record.label}
                          />
                        </FormGroup>
                      </Col>
                      <Col xl="2" md="4">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-mac"
                          >
                            MAC
                          </label>
                          <Input
                            id="input-mac"
                            className="form-control-alternative"
                            type="text"
                            placeholder="MAC"
                            name="mac"
                            onChange={onChange}
                            value={record.mac}
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col xl="2" md="3">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-zona"
                          >
                            Zone
                          </label>
                          <ZonaSelect
                            id="input-zona"
                            className="form-control-alternative"
                            name="zona"
                            onChange={onChange}
                            value={record.zona}
                          />
                        </FormGroup>
                      </Col>
                      <Col xl="2" md="4">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-latitude"
                          >
                            Latitude
                          </label>
                          <Input
                            id="input-latitude"
                            className="form-control-alternative"
                            type="number"
                            placeholder="Latitude"
                            name="latitude"
                            onChange={onChangeNumber}
                            value={record.latitude}
                          />
                        </FormGroup>
                      </Col>
                      <Col xl="2" md="4">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-longitude"
                          >
                            Longitude
                          </label>
                          <Input
                            id="input-longitude"
                            className="form-control-alternative"
                            type="number"
                            placeholder="Longitude"
                            name="longitude"
                            onChange={onChangeNumber}
                            value={record.longitude}
                          />
                        </FormGroup>
                      </Col>
                      <Col xl="2" md="4">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-operating-range"
                          >
                            Op. Range (meters)
                          </label>
                          <Input
                            id="input-operating-range"
                            className="form-control-alternative"
                            type="number"
                            placeholder="Op. Range"
                            name="operatingRange"
                            onChange={onChangeNumber}
                            value={record.operatingRange}
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col lg="12">
                        <div className="d-flex align-items-center">
                          <h4 className="mb-0 text-white">Detections</h4>
                          <Button
                            className="ml-3 rounded-circle shadow"
                            color="primary"
                            size="sm"
                            onClick={() => {
                              const newList = [...record.deteccoesEmergencia];
                              newList.push({ id: '', tipoEmergencia: '', monitoramentos: [{ id: '', sensor: '', grandeza: '', thresholdMinimo: '', thresholdMaximo: '', ativo: true }] });

                              inputsHandler('deteccoesEmergencia', newList)
                            }}
                          >
                            <i className="fas fa-plus" />
                          </Button>
                        </div>
                      </Col>
                    </Row>
                    {
                      record.deteccoesEmergencia?.map((deteccao, index) => {
                        return (
                          <Row key={`deteccao-${index}`}>
                            <Col lg="12">
                              <DeteccaoEmergenciaComponent
                                index={index}
                                id={deteccao.id}
                                tipoEmergencia={deteccao.tipoEmergencia}
                                monitoramentos={deteccao.monitoramentos}
                                onChange={deteccaoOnChange}
                                enableRemove={record.deteccoesEmergencia.length > 1}
                                onRemove={deteccaoOnRemove}
                                monitoramentoOnChange={monitoramentoOnChange}
                                monitoramentoOnRemove={monitoramentoOnRemove}
                              />
                              {index < record.deteccoesEmergencia.length - 1 && <hr className="mt-4 mb-4 bg-white" />}
                            </Col>
                          </Row>
                        )
                      })
                    }
                    <div className="text-right">
                      <Button
                        color="danger"
                        onClick={() => {
                          navigate(target);
                        }}
                      >
                        Cancel
                      </Button>

                      <Button
                        color="success"
                        onClick={save}
                      >
                        Save
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

export default UdeForm;