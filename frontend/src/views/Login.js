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

import { useState } from "react";
import {
  Button,
  Card,
  CardBody,
  Col,
  Form,
  FormGroup,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText
} from "reactstrap";
import { useNavigate } from "react-router-dom";

import AuthService from 'services/AuthService.js';
import LocalidadeService from 'services/LocalidadeService.js';

const Login = () => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  })

  const navigate = useNavigate();

  const signin = async (e) => {
    e.preventDefault();
    try {
      await AuthService.signIn(credentials);
      const localidade = await LocalidadeService.getLocalidade();
      if (!localidade) {
        navigate('/localidade');
        return
      }
      navigate('/admin/index');
    } catch (error) {
      console.error(error);
      alert('Credenciais inválidas!');
    }
  };

  const inputsHandler = (e) => {
    e.preventDefault();
    setCredentials({ ...credentials, [e.target.name]: e.target.value })
  }

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
              <small>Entrar com as credenciais</small>
            </div>
            <Form role="form">
              <FormGroup className="mb-3">
                <InputGroup className="input-group-alternative">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-email-83" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    placeholder="Email"
                    type="email"
                    name="email"
                    autoComplete="email"
                    onChange={inputsHandler}
                    onKeyUp={(e) => { if (e.key === 'Enter') signin(e) }}
                  />
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <InputGroup className="input-group-alternative">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-lock-circle-open" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    placeholder="Password"
                    type="password"
                    name="password"
                    autoComplete="password"
                    onChange={inputsHandler}
                    onKeyUp={(e) => { if (e.key === 'Enter') signin(e) }}
                  />
                </InputGroup>
              </FormGroup>
              <div className="text-center">
                <Button
                  color="primary"
                  type="button"
                  onClick={signin}
                >
                  Entrar
                </Button>
              </div>
            </Form>
          </CardBody>
        </Card>
      </Col>
    </>
  );
};

export default Login;
