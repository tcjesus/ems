import Header from "components/Headers/Header.js";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Card,
  CardHeader,
  Container,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Row,
  Table,
  UncontrolledDropdown
} from "reactstrap";

const DefaultList = (service, resource, recordsName, headers, attributes) => {
  const BuiltList = () => {
    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
      async function fetchData() {
        try {
        const response = await service.list();
          setResults(response);
        } catch (error) {
          console.error(error);
          alert('Erro ao carregar registros');
        }
      }
      if (isLoading) {
        fetchData();
      }
      setIsLoading(false);
    }, [isLoading]);

    const deleteRecord = async (e) => {
      e.preventDefault();
      if (window.confirm('Deseja realmente excluir este registro?')) {
        try {
          await service.delete(e.target.value);
          setIsLoading(true);
        } catch (error) {
          console.error(error);
          alert('Erro ao excluir registro');
        }
      }
    };

    const RecordRow = (record) => {
      return (
        <tr>
          {
            attributes.map((attribute, index) => {
              // check if attribute is a function
              if (typeof attribute === 'function') {
                return (
                  <td key={`attribute_${index}`}>{attribute(record)}</td>
                )
              }

              return (
                <td key={`attribute_${index}`}>{record[attribute]}</td>
              )
            })
          }
          <td className="text-right">
            <UncontrolledDropdown>
              <DropdownToggle
                className="btn-icon-only text-light"
                role="button"
                size="sm"
                color=""
                onClick={(e) => e.preventDefault()}
              >
                <i className="fas fa-ellipsis-v" />
              </DropdownToggle>
              <DropdownMenu className="dropdown-menu-arrow" right>
                <DropdownItem
                  onClick={(e) => {
                    e.preventDefault();
                    navigate(`/admin/${resource}/edit/${record.id}`);
                  }}
                >
                  Editar
                </DropdownItem>
                <DropdownItem
                  onClick={deleteRecord}
                >
                  Remover
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          </td>
        </tr>
      );
    }

    return (
      <>
        <Header />
        <Container className="mt--7" fluid>
          <Row className="mt-5">
            <div className="col">
              <Card className="bg-default shadow">
                <CardHeader className="bg-transparent border-0">
                  <div className="d-flex justify-content-between">
                    <h3 className="text-white mb-0">Gerenciamento de {recordsName}</h3>
                    <Button
                      color="primary"
                      size="sm"
                      onClick={async () => {
                        navigate(`/admin/${resource}/edit`);
                      }}
                    >
                      Adicionar
                    </Button>
                  </div>
                </CardHeader>
                <Table
                  className="align-items-center table-dark table-flush"
                  responsive
                >
                  <thead className="thead-dark">
                    <tr>
                      {
                        headers.map((header, index) => (
                          <th scope="col" key={`header_${index}`}>{header}</th>
                        ))
                      }
                      <th scope="col" />
                    </tr>
                  </thead>
                  <tbody>
                    {
                      (results.length === 0) ? <tr><td colSpan="5">Nenhum registro encontrado</td></tr>
                        : results?.map((record) => {
                          return <RecordRow key={record.id} {...record} />
                        })
                    }
                  </tbody>
                </Table>
              </Card>
            </div>
          </Row>
        </Container>
      </>
    );
  }

  return BuiltList
};

export default DefaultList;
