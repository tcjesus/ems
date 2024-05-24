import { Row } from "reactstrap";

import Header from "components/Headers/Header";
import { Card, CardBody, CardHeader, Container } from "reactstrap";

const Monitoramento = () => {
  return (
    <>
      <Header />
      <Container className="mt--7" fluid>
        <Row className="mt-5">
          <div className="col">
            <Card className="bg-default shadow">
              <CardHeader className="bg-transparent border-0">
                <h3 className="text-white mb-0">Monitoramento</h3>
              </CardHeader>
              <CardBody>
                <div>
                  Monitoramento
                </div>
              </CardBody>
            </Card>
          </div>
        </Row>
      </Container>
    </>
  );
}

export default Monitoramento;