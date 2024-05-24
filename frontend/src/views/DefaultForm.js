import Header from "components/Headers/Header";
import { useEffect, useState } from "react";
import {
  useNavigate,
  useParams,
} from "react-router-dom";
import { Button, Card, CardBody, CardHeader, Container, Form, Input, Row } from "reactstrap";

const DefaultForm = (target, resource, service, initialRecord, buildForm) => {
  const BuiltForm = () => {
    const [isLoading, setIsLoading] = useState(true);

    const navigate = useNavigate();

    const params = useParams()
    const id = params?.id;

    const [record, setRecord] = useState(initialRecord)

    const onChange = (e) => {
      if (e.preventDefault) e.preventDefault();

      inputsHandler(e.target.name, e.target.value);
    }

    const inputsHandler = (property, value) => {
      setRecord({ ...record, [property]: value })
    }

    const save = async (e) => {
      try {
        e.preventDefault();
        await service.save(record);
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
                  <h3 className="text-white mb-0">{id ? `Editar ${resource}` : `Adicionar ${resource}`}</h3>
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
                      {buildForm(record, onChange)}
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

  return BuiltForm;
}

export default DefaultForm;