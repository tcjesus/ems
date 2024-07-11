import { Chart } from 'chart.js';
import Header from 'components/Headers/Header';
import TipoEmergenciaSelect from 'components/Selects/TipoEmergenciaSelect';
import UdeSelect from 'components/Selects/UdeSelect';
import ZonaSelect from 'components/Selects/ZonaSelect';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import ReactSelect, { components } from "react-select";
import { Button, Card, CardBody, CardFooter, CardHeader, Col, Container, FormGroup, Input, Pagination, PaginationItem, PaginationLink, Row, Table } from 'reactstrap';
import GrandezaService from 'services/GrandezaService';
import MonitoramentoService from 'services/MonitoramentoService';
import { chartOptions, parseOptions } from 'variables/charts';

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
  const [rawDataTimer, setRawDataTimer] = useState();
  const [realTimeData, setRealTimeData] = useState({});
  const [isLoadingRealTimeData, setIsLoadingRealTimeData] = useState(true);
  const [isLoadingGrandezas, setIsLoadingGrandezas] = useState(true);
  const [grandezas, setGrandezas] = useState([]);
  const [grandezasSelected, setGrandezasSelected] = useState([]);

  if (window.Chart) {
    parseOptions(Chart, chartOptions());
  }

  useEffect(() => {
    async function fetchData() {
      try {

        let parsed = { ...filters };

        if (parsed.dataInicial) { parsed.dataInicial = filters.dataInicial; }
        if (parsed.dataFinal) { parsed.dataFinal = filters.dataFinal; }
        if (parsed.tipoEmergencia) { parsed.tipoEmergencia = filters.tipoEmergencia.id; }
        if (parsed.grandezas?.length) { parsed.grandezas = filters.grandezas.map((g) => g.id); }
        if (parsed.zona) { parsed.zona = filters.zona.id; }
        if (parsed.ude) { parsed.ude = filters.ude.id; }

        const response = await MonitoramentoService.listRawData(parsed);
        setRawDataPagination(response);
        setRawDataPages(Math.ceil(response.total / response.limit));

        const summary = await MonitoramentoService.getSummary(parsed);
        setRealTimeData(summary);

        MonitoramentoService.request(parsed);
        if (rawDataTimer) {
          clearTimeout(rawDataTimer);
        }
        const timer = setTimeout(() => {
          setIsLoadingRawData(true);
          setIsLoadingRealTimeData(true);
        }, filters.refreshRate * 1000);
        setRawDataTimer(timer);
      } catch (error) {
        console.error(error);
        alert("Erro ao carregar dados de monitoramento!");
      }
    }
    if (isLoadingRawData || isLoadingRealTimeData) {
      fetchData();
      setIsLoadingRawData(false);
      setIsLoadingRealTimeData(false);
    }

    return () => {
      if (rawDataTimer) {
        clearTimeout(rawDataTimer)
      }
    }
  }, [
    isLoadingRawData,
    isLoadingRealTimeData,
    filters,
    rawDataPagination,
    rawDataTimer,
  ]);

  useEffect(() => {
    async function fetchGrandezas() {
      try {
        const response = await GrandezaService.list();
        setGrandezas(response);
        setIsLoadingGrandezas(false);
      } catch (error) {
        console.error(error);
        alert('Erro ao carregar grandezas!');
      }
    }
    if (isLoadingGrandezas) {
      fetchGrandezas();
    }
  }, [isLoadingGrandezas]);

  const grandezasOnChange = (selected) => {
    setGrandezasSelected(selected);
    setFilters((prevDados) => ({
      ...prevDados,
      grandezas: selected,
    }))
  };

  const onChange = (event) => {
    const { name, value } = event.target;
    setFilters((prevDados) => ({
      ...prevDados,
      [name]: value,
    }));
  };

  const updatePage = (page) => {
    if (filters.page === page) {
      return;
    }

    setFilters((prevDados) => ({
      ...prevDados,
      page,
    }))
    setIsLoadingRawData(true);
    setIsLoadingRealTimeData(true);
  }

  const renderDadosBrutos = () => {
    return (
      <Row className="mt-5">
        <Col>
          <Card className="bg-default shadow">
            <CardHeader className="bg-transparent border-0">
              <h3 className="text-white mb-0">Raw Data</h3>
            </CardHeader>
            <Table
              className="align-items-center table-dark table-flush"
              responsive
            >
              <thead className="thead-dark">
                <tr>
                  <th scope="col">EDU</th>
                  <th scope="col">Sensor</th>
                  <th scope="col">Variable</th>
                  <th scope="col">Value</th>
                  <th scope="col">Start Date</th>
                  <th scope="col">End Date</th>
                </tr>
              </thead>
              <tbody>
                {
                  !rawDataPagination?.results?.length ? (
                    <tr>
                      <td colSpan="6">Records not found</td>
                    </tr>
                  ) : (
                    rawDataPagination?.results?.map((item, index) => {
                      return <tr key={`raw-data-record-${index}`}>
                        <td>{item.ude.label}</td>
                        <td>{item.sensor.modelo}</td>
                        <td>{`${item.grandeza.nome} (${item.grandeza.sigla})`}</td>
                        <td>{item.valor}</td>
                        <td>{item.dataInicial}</td>
                        <td>{item.dataFinal}</td>
                      </tr>
                    })
                  )
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
                  {rawDataPages && filters.page < rawDataPages ? (<PaginationItem>
                    <PaginationLink onClick={() => updatePage(filters.page < rawDataPages ? filters.page + 1 : rawDataPages)}>{filters.page + 1}</PaginationLink>
                  </PaginationItem>) : <></>}
                  <PaginationItem>
                    <PaginationLink
                      onClick={() => updatePage(filters.page < rawDataPages ? filters.page + 1 : rawDataPages || 1)}
                    >
                      <i className="fas fa-angle-right" />
                      <span className="sr-only">Next</span>
                    </PaginationLink>
                  </PaginationItem>
                </Pagination>
              </nav>
            </CardFooter>
          </Card>
        </Col>
      </Row>
    );
  };

  return (
    <>
      <Header />
      <Container className="mt--7" fluid>
        <Row className="mt-5">
          <Col>
            <Card className="bg-default shadow mb-4">
              <CardHeader className="bg-transparent border-0">
                <h3 className="text-white mb-0">Monitoring</h3>
              </CardHeader>
              <CardBody>
                <div className="pl-lg-4">
                  <Row>
                    <Col md="4" xl="3">
                      <FormGroup className="mb-0">
                        <label
                          className="form-control-label mb-0"
                          htmlFor={`input-data-inicial`}
                        >
                          Start Date
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
                          htmlFor={`input-data-final`}
                        >
                          End Date
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
                          htmlFor={`input-tipo-emergencia`}
                        >
                          Emergency Type
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
                          htmlFor={`input-zona`}
                        >
                          Zone
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
                          htmlFor={`input-ude`}
                        >
                          EDU
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
                          Variables
                        </label>
                        <ReactSelect
                          id="input-grandezas"
                          className="form-control-alternative form-control-partial"
                          options={grandezas.map((g) => ({
                            value: g,
                            label: `${g.nome} (${g.sigla})`
                          }))}
                          isMulti
                          closeMenuOnSelect={false}
                          hideSelectedOptions={false}
                          components={{
                            Option,
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
                          htmlFor="input-refresh-rate"
                        >
                          Update Rate
                        </label>
                        <Input
                          id="input-refresh-rate"
                          className="form-control-alternative"
                          type="number"
                          placeholder="(In seconds)"
                          name="refreshRate"
                          onChange={(e) => {
                            onChange(e);
                            setIsLoadingRawData(true);
                            setIsLoadingRealTimeData(true);
                          }}
                          value={filters.refreshRate}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <div className="text-right mt-2">
                    <Button
                      color="primary"
                      onClick={() => {
                        setIsLoadingRawData(true);
                        setIsLoadingRealTimeData(true);
                      }}
                    >
                      Search
                    </Button>
                  </div>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
        {renderDadosBrutos()}
        <Row className="mt-5">
          {Object.keys(realTimeData).map((key, index) => (
            <Col md="12" key={index}>
              <Card className="bg-default shadow mb-4" style={{ height: "400px" }}>
                <CardHeader className="bg-transparent border-0">
                  <h3 className="text-white mb-0">{key}</h3>
              </CardHeader>
              <CardBody>
                  {realTimeData[key] &&
                    realTimeData[key].x &&
                    realTimeData[key].y && (
                      <Line
                        data={{
                          labels: realTimeData[key].x.map((d) => moment(d).format("DD/MM/YYYY HH:mm:ss")),
                          datasets: [
                            {
                              label: "Valor",
                              data: realTimeData[key].y,
                              units: realTimeData[key].units,
                              borderColor: "rgba(94, 114, 228)",
                              backgroundColor: "rgba(94, 114, 228, 0.2)",
                              borderWidth: 2,
                              lineTension: 0.4,
                            },
                          ],
                        }}
                        options={{
                          scales: {
                            yAxes: [
                              {
                                gridLines: {
                                  color: "#505050",
                                  zeroLineColor: "#505050",
                                },
                                ticks: {
                                  callback: (value) => {
                                    const units = value.units ? ` ${value.units}` : "";
                                    return `${value}${units}`;
                                  },
                                  fontColor: "#ffffff",
                                },
                              },
                            ],
                            xAxes: [
                              {
                                ticks: {
                                  fontColor: "#ffffff",
                                },
                              },
                            ],
                          },
                          tooltips: {
                            callbacks: {
                              label: (item, data) => {
                                let label = data.datasets[item.datasetIndex].label || "";
                                let yLabel = item.yLabel;
                                let content = "";

                                if (data.datasets.length > 1) {
                                  content += label;
                                }

                                const units = yLabel.units ? ` ${yLabel.units}` : "";

                                content += `${yLabel}${units}`;
                                return content;
                              },
                            },
                            backgroundColor: "#ffffff",
                            titleFontColor: "#212529",
                            bodyFontColor: "#212529",
                          },
                        }}
                        getDatasetAtEvent={(e) => console.log(e)}
                      />
                    )}
              </CardBody>
            </Card>
          </Col>
          ))}
        </Row>
      </Container>
    </>
  );
};

export default Monitoramento;
