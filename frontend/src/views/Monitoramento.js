import Header from 'components/Headers/Header';
import TipoEmergenciaSelect from 'components/Selects/TipoEmergenciaSelect';
import UdeSelect from 'components/Selects/UdeSelect';
import ZonaSelect from 'components/Selects/ZonaSelect';
import moment from 'moment';
import { useEffect, useState } from 'react';
import ReactSelect, { components } from "react-select";
import { Button, Card, CardBody, CardFooter, CardHeader, Col, Container, FormGroup, Input, Pagination, PaginationItem, PaginationLink, Row, Table } from 'reactstrap';
import GrandezaService from 'services/GrandezaService';
import MonitoramentoService from 'services/MonitoramentoService';

const Option = (props) => {
  return (
    <div>
      <components.Option {...props}>
        <div className="d-flex justify-content-between">
          <label>{props.label}</label>
          <input
            type="checkbox"
            checked={props.isSelected}
            onChange={() => null}
          />{" "}
        </div>
      </components.Option>
    </div>
  );
};

const Monitoramento = () => {
  // Estado para armazenar os dados inseridos pelo usuário para monitoramento
  const [filters, setFilters] = useState({
    zona: '',
    tipoEmergencia: '',
    grandezas: [],
    ude: '',
    dataInicial: moment().subtract(30, 'days').format("YYYY-MM-DD"),
    dataFinal: '',
    page: 1,
    limit: 7,
    refreshRate: 5,
  });
  // Estado para armazenar os dados brutos pesquisados
  const [rawDataPagination, setRawDataPagination] = useState([]);
  const [rawDataPages, setRawDataPages] = useState(1);
  const [isLoadingRawData, setIsLoadingRawData] = useState(true);
  const [rawDataTimer, setRawDataTimer] = useState()

  useEffect(() => {
    async function fetchData() {
      try {

        let parsed = {}

        if (filters.dataInicial) { parsed.dataInicial = filters.dataInicial }
        if (filters.dataFinal) { parsed.dataFinal = filters.dataFinal }
        if (filters.tipoEmergencia) { parsed.tipoEmergencia = filters.tipoEmergencia.id }
        if (filters.grandezas?.length) { parsed.grandezas = filters.grandezas.map((g) => g.id) }
        if (filters.zona) { parsed.zona = filters.zona.id }
        if (filters.ude) { parsed.ude = filters.ude.id }
        if (filters.limit) { parsed.limit = filters.limit }
        if (filters.page) { parsed.page = filters.page }

        const response = await MonitoramentoService.listRawData(parsed);
        setRawDataPagination(response);
        setRawDataPages(Math.ceil(response.total / response.limit))

        MonitoramentoService.request(parsed)
        if (rawDataTimer) {
          clearTimeout(rawDataTimer)
        }
        const timer = setTimeout(() => {
          setIsLoadingRawData(true)
        }, filters.refreshRate * 1000);
        setRawDataTimer(timer)
      } catch (error) {
        console.error(error);
        alert('Erro ao carregar dados brutos!');
      }
    }
    if (isLoadingRawData) {
      fetchData();
      setIsLoadingRawData(false);
    }
  }, [isLoadingRawData, filters, rawDataPagination, rawDataTimer]);

  const [isLoadingGrandezas, setIsLoadingGrandezas] = useState(true);
  const [grandezas, setGrandezas] = useState([]);
  const [grandezasSelected, setGrandezasSelected] = useState();

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await GrandezaService.list();
        setGrandezas(response);
        setGrandezasSelected([])
      } catch (error) {
        console.error(error);
        alert('Erro ao carregar grandezas!');
      }
    }
    if (isLoadingGrandezas) {
      fetchData();
      setIsLoadingGrandezas(false);
    }
  }, [isLoadingGrandezas]);

  const grandezasOnChange = (selected) => {
    setGrandezasSelected(selected);
    setFilters((prevDados) => ({
      ...prevDados,
      grandezas: selected.map(s => s.value)
    }))
  };

  // Estado para armazenar as informações em tempo real sobre temperatura e pressão
  const [infoTempoReal] = useState({
    temperatura: '',
    pressao: ''
  });

  // Função para lidar com a mudança nos inputs de monitoramento
  const onChange = (event) => {
    const { name, value } = event.target;
    setFilters((prevDados) => ({
      ...prevDados,
      [name]: value
    }));
  };

  const updatePage = (page) => {
    if (filters.page === page) {
      return
    }

    setFilters((prevDados) => ({
      ...prevDados,
      page
    }))
    setIsLoadingRawData(true)
  }

  // Função para renderizar os dados brutos em uma tabela
  const renderDadosBrutos = () => {
    return (
      <>
        <Card className="bg-default shadow">
          <CardHeader className="bg-transparent border-0">
            <h3 className="text-white mb-0">Dados Brutos</h3>
          </CardHeader>
          <Table
            className="align-items-center table-dark table-flush"
            responsive
          >
            <thead className="thead-dark">
              <tr>
                <th scope="col">UDE</th>
                <th scope="col">Sensor</th>
                <th scope="col">Grandeza</th>
                <th scope="col">Valor</th>
                <th scope="col">Data Inicial</th>
                <th scope="col">Data Final</th>
              </tr>
            </thead>
            <tbody>
              {
                (!rawDataPagination?.results?.length) ? <tr><td colSpan="6">Nenhum registro encontrado</td></tr>
                  : (rawDataPagination?.results?.map((item, index) => {
                    return <tr key={`raw-data-record-${index}`}>
                      <td>{item.ude.label}</td>
                      <td>{item.sensor.modelo}</td>
                      <td>{`${item.grandeza.nome} (${item.grandeza.sigla})`}</td>
                      <td>{item.valor}</td>
                      <td>{item.dataInicial}</td>
                      <td>{item.dataFinal}</td>
                    </tr>
                  }))
              }
            </tbody>
          </Table>
          <CardFooter className="bg-default shadow">
            <nav aria-label="...">
              <Pagination
                className="pagination justify-content-end mb-0"
                listClassName="justify-content-end mb-0"
              >
                <PaginationItem>
                  <PaginationLink
                    onClick={() => updatePage(filters.page > 1 ? filters.page - 1 : 1)}
                  >
                    <i className="fas fa-angle-left" />
                    <span className="sr-only">Previous</span>
                  </PaginationLink>
                </PaginationItem>
                {filters.page > 1 && (<PaginationItem>
                  <PaginationLink onClick={() => updatePage(filters.page > 1 ? filters.page - 1 : 1)}>{filters.page - 1}</PaginationLink>
                </PaginationItem>)}
                <PaginationItem className="active">
                  <PaginationLink onClick={(e) => e.preventDefault()}>{filters.page}</PaginationLink>
                </PaginationItem>
                {rawDataPages && filters.page < rawDataPages && (<PaginationItem>
                  <PaginationLink onClick={() => updatePage(filters.page < rawDataPages ? filters.page + 1 : rawDataPages)}>{filters.page + 1}</PaginationLink>
                </PaginationItem>)}
                <PaginationItem>
                  <PaginationLink
                    onClick={() => updatePage(filters.page < rawDataPages ? filters.page + 1 : rawDataPages)}
                  >
                    <i className="fas fa-angle-right" />
                    <span className="sr-only">Next</span>
                  </PaginationLink>
                </PaginationItem>
              </Pagination>
            </nav>
          </CardFooter>
        </Card>
      </>
    );
  };

  return (
    <>
      <Header />
      <Container className="mt--7" fluid>
        <Row className="mt-5">
          <Col>
            <Card className="bg-default shadow">
              <CardHeader className="bg-transparent border-0">
                <h3 className="text-white mb-0">Monitoramento</h3>
              </CardHeader>
              <CardBody>
                <div className="pl-lg-4">
                  <Row>
                    <Col md="4" xl="3">
                      <FormGroup className="mb-0">
                        <label
                          className="form-control-label mb-0"
                          for={`input-data-inicial`}
                        >
                          Data Inicial
                        </label>
                        <Input
                          id="input-data-inicial"
                          name="dataInicial"
                          type="date"
                          value={filters.dataInicial}
                          onChange={onChange} />
                      </FormGroup>
                    </Col>
                    <Col md="4" xl="3">
                      <FormGroup className="mb-0">
                        <label
                          className="form-control-label mb-0"
                          for={`input-data-final`}
                        >
                          Data Final
                        </label>
                        <Input
                          id="input-data-final"
                          name="dataFinal"
                          type="date"
                          value={filters.dataFinal}
                          onChange={onChange} />
                      </FormGroup>
                    </Col>
                    <Col md="4" xl="3">
                      <FormGroup className="mb-0">
                        <label
                          className="form-control-label mb-0"
                          for={`input-tipo-emergencia`}
                        >
                          Tipo de Emergência
                        </label>
                        <TipoEmergenciaSelect
                          id={`input-tipo-emergencia`}
                          className="form-control-alternative"
                          name="tipoEmergencia"
                          onChange={onChange}
                          value={filters.tipoEmergencia}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col md="4" xl="3">
                      <FormGroup className="mb-0">
                        <label
                          className="form-control-label mb-0"
                          for={`input-zona`}
                        >
                          Zona
                        </label>
                        <ZonaSelect
                          id="input-zona"
                          className="form-control-alternative"
                          name="zona"
                          onChange={onChange}
                          value={filters.zona}
                        />
                      </FormGroup>
                    </Col>
                    <Col md="4" xl="3">
                      <FormGroup className="mb-0">
                        <label
                          className="form-control-label mb-0"
                          for={`input-ude`}
                        >
                          UDE
                        </label>
                        <UdeSelect
                          id="input-ude"
                          className="form-control-alternative"
                          name="ude"
                          onChange={onChange}
                          value={filters.ude}
                        />
                      </FormGroup>
                    </Col>
                    <Col md="4" xl="3">
                      <FormGroup>
                        <label
                          className="form-control-label"
                        >
                          Grandezas
                        </label>
                        <ReactSelect
                          id="input-grandezas"
                          className="form-control-alternative form-control-partial"
                          options={grandezas.map((g) => ({ value: g, label: `${g.nome} (${g.sigla})` }))}
                          isMulti
                          closeMenuOnSelect={false}
                          hideSelectedOptions={false}
                          components={{
                            Option
                          }}
                          onChange={grandezasOnChange}
                          allowSelectAll={true}
                          value={grandezasSelected}
                          placeholder="Selecione a(s) Grandezas"
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col md="4" xl="3">
                      <FormGroup className="mb-0">
                        <label
                          className="form-control-label mb-0"
                          for="input-refresh-rate"
                        >
                          Taxa de Atualização
                        </label>
                        <Input
                          id="input-refresh-rate"
                          className="form-control-alternative"
                          type="number"
                          placeholder="(Em segundos)"
                          name="refreshRate"
                          onChange={(e) => {
                            onChange(e)
                            setIsLoadingRawData(true)
                          }}
                          value={filters.refreshRate}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <div className="text-right">
                    <Button
                      color="primary"
                      onClick={() => setIsLoadingRawData(true)}
                    >
                      Buscar
                    </Button>
                  </div>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Row className="mt-5">
          <Col>
            {renderDadosBrutos()}
          </Col>
        </Row>
        <Row className="mt-5">
          <Col md="6">
            <Card className="bg-default shadow">
              <CardHeader className="bg-transparent border-0">
                <h3 className="text-white mb-0">Temperatura</h3>
              </CardHeader>
              <CardBody>
                <p>{infoTempoReal.temperatura}</p>
              </CardBody>
            </Card>
          </Col>
          <Col md="6">
            <Card className="bg-default shadow">
              <CardHeader className="bg-transparent border-0">
                <h3 className="text-white mb-0">Pressão</h3>
              </CardHeader>
              <CardBody>
                <p>{infoTempoReal.pressao}</p>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Monitoramento;
