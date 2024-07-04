/*!

=========================================================
* Argon Dashboard React - v1.2.4
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-react
* Copyright 2024 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/

import LocalidadeSelect from "components/Selects/LocalidadeSelect";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Card,
  CardBody,
  Col,
  Form,
  FormGroup
} from "reactstrap";

import LocalidadeService from 'services/LocalidadeService.js';

const Localidade = () => {
  const [localidade, setLocalidade] = useState('')

  const navigate = useNavigate();

  const onConfirm = async (e) => {
    e.preventDefault();
    try {
      if (!localidade) {
        alert('Selecione uma localidade antes de continuar!');
        return;
      }

      await LocalidadeService.setLocalidade(localidade);
      navigate('/admin/index');
    } catch (error) {
      console.error(error);
      alert('Falha ao selecionar localidade!');
    }
  };

  return (
    <>
      <Col lg="5" md="7">
        <Card className="bg-secondary shadow border-0">
          <CardBody className="px-lg-5 py-lg-5">
            {/* Center div */}
            <div className="text-center text-muted mb-4">
              <img
                style={{ width: '80%', height: 'auto' }}
                alt="..."
                src={require("../assets/img/brand/ems-logo.png")}
              />
            </div>
            <div className="text-center text-muted mb-4">
              <small>&nbsp;</small>
            </div>
            <Form role="form">
              <FormGroup className="mb-3">
                <LocalidadeSelect
                  id="input-localidade"
                  className="form-control-alternative"
                  name="localidade"
                  onChange={(e) => setLocalidade(e.target.value)}
                  value={localidade}
                />
              </FormGroup>
              <div className="text-center">
                <Button
                  color="primary"
                  type="button"
                  onClick={onConfirm}
                >
                  Confirmar
                </Button>
              </div>
            </Form>
          </CardBody>
        </Card>
      </Col>
    </>
  );
};

export default Localidade;
