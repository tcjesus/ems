import Header from "components/Headers/Header";
import CidadeSelect from "components/Selects/CidadeSelect";
import EstadoSelect from "components/Selects/EstadoSelect";
import { useEffect, useState } from "react";
import {
  useNavigate,
  useParams,
} from "react-router-dom";
import { Button, Card, CardBody, CardHeader, Container, Form, Input, Row } from "reactstrap";

import { Col, FormGroup } from "reactstrap";
import UsuarioService from "services/UsuarioService";

const target = '/admin/users'
const resource = 'User'
const service = UsuarioService

const PermissionComponent = ({ index, id, localidade, role, onChange, enableRemove, onRemove }) => {
  const [estado, setEstado] = useState(localidade?.cidade?.estado || '');

  const _onChange = (e) => {
    if (!onChange) {
      return;
    }

    onChange(index, e.target.name, e.target.value);
  }

  const _onCidadeChange = (e) => {
    if (!onChange) {
      return;
    }

    onChange(index, 'localidade', { cidade: e.target.value });
  }

  return (
    <>
      <Input
        id={`input-permission-id-${index}`}
        type="hidden"
        name="id"
        value={id}
        onChange={_onChange}
      />
      <div className="d-flex justify-content-flex-start align-items-center">
        <Row>
          <Col sm="6" lg="4">
            <FormGroup>
              <label
                className="form-control-label"
                htmlFor={`input-permission-estado-${index}`}
              >
                State
              </label>
              <EstadoSelect
                id={`input-permission-estado-${index}`}
                name="estado"
                value={estado}
                onChange={(e) => { setEstado(e.target.value) }}
              />
            </FormGroup>
          </Col>
          <Col sm="6" lg="4">
            <FormGroup>
              <label
                className="form-control-label"
                htmlFor={`input-permission-cidade-${index}`}
              >
                City
              </label>
              <CidadeSelect
                id={`input-permission-cidade-${index}`}
                name="cidade"
                estado={estado}
                value={localidade?.cidade}
                onChange={_onCidadeChange}
              />
            </FormGroup>
          </Col>
          <Col sm="6" lg="4">
            <FormGroup>
              <label
                className="form-control-label"
                htmlFor="input-permission-role"
              >
                Role
              </label>
              <Input
                id="input-permission-role"
                className="form-control-alternative"
                type="select"
                placeholder="ADMIN"
                name="role"
                onChange={_onChange}
                value={role}
              >
                <option value="">Selecione uma Role</option>
                <option value="ADMIN">Admin</option>
                <option value="USER">User</option>
                <option value="GUEST">Guest</option>
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

const UsuarioForm = () => {
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  const params = useParams()
  const id = params?.id;

  const [record, setRecord] = useState({
    id: '',
    nome: '',
    email: '',
    isSuperAdmin: false,
    permissions: []
  })

  const onChange = (e) => {
    if (e.preventDefault) e.preventDefault();

    inputsHandler(e.target.name, e.target.value);
  }

  const onChangeBoolean = (e) => {
    if (!onChange) {
      return;
    }

    inputsHandler(e.target.name, e.target.checked);
  }

  const inputsHandler = (property, value) => {
    setRecord({ ...record, [property]: value })
  }

  const permissionOnChange = (index, property, value) => {
    const newList = [...record.permissions];
    newList[index][property] = value;

    inputsHandler('permissions', newList);
  }

  const permissionOnRemove = (index) => {
    if (record.permissions.length <= 1) {
      return
    }

    if (window.confirm('Deseja realmente excluir este registro?')) {
      const newList = [...record.permissions]
      newList.splice(index, 1)
      inputsHandler('permissions', newList);
    }
  }

  const save = async (e) => {
    try {
      e.preventDefault();
      const _record = { ...record };
      _record.permissions = _record.permissions.filter(e => e.localidade?.cidade && e.role);
      _record.permissions.forEach(e => {
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
                            htmlFor="input-nome"
                          >
                            Name
                          </label>
                          <Input
                            id="input-nome"
                            className="form-control-alternative"
                            type="text"
                            placeholder="Matheus B."
                            name="nome"
                            onChange={onChange}
                            value={record.nome}
                          />
                        </FormGroup>
                      </Col>
                      <Col lg="3">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-email"
                          >
                            Email
                          </label>
                          <Input
                            id="input-email"
                            className="form-control-alternative"
                            type="email"
                            placeholder="email@example.com"
                            name="email"
                            autoComplete="new-email"
                            onChange={onChange}
                            value={record.email}
                          />
                        </FormGroup>
                      </Col>
                      <Col lg="3">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-password"
                          >
                            Password
                          </label>
                          <Input
                            id="input-password"
                            className="form-control-alternative"
                            type="password"
                            placeholder="123456"
                            name="password"
                            autoComplete="new-password"
                            onChange={onChange}
                            value={record.password}
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <FormGroup className="m-0 pl-4 custom-checkbox">
                          <Input
                            id={`input-is-super-admin`}
                            name="isSuperAdmin"
                            type="checkbox"
                            style={{ transform: 'scale(1.5)' }}
                            onChange={onChangeBoolean}
                            checked={record.isSuperAdmin}
                          />
                          <label
                            className="ml-2 form-control-label"
                            htmlFor={`input-is-super-admin`}
                          >
                            <span className="text-muted">
                              Is SUPER ADMIN?
                            </span>
                          </label>
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col lg="12">
                        <FormGroup>
                          <div className="d-flex align-items-center">
                            <h4 className="mb-0 text-white">Permissions</h4>
                            <Button
                              className="ml-3 rounded-circle shadow"
                              color="primary"
                              size="sm"
                              onClick={() => {
                                const newList = [...record.permissions];
                                newList.push({ id: '', estado: '', localidade: { cidade: '' }, role: '' });

                                inputsHandler('permissions', newList)
                              }}
                            >
                              <i className="fas fa-plus" />
                            </Button>
                          </div>
                          {
                            record.permissions.map((permission, index) => {
                              return (
                                <Row key={`permission-${index}`}>
                                  <Col lg="12">
                                    <PermissionComponent
                                      index={index}
                                      id={permission.id}
                                      estado={permission.estado}
                                      localidade={permission.localidade}
                                      role={permission.role}
                                      onChange={permissionOnChange}
                                      enableRemove={record.permissions.length > 1}
                                      onRemove={permissionOnRemove}
                                    />
                                    {index < record.permissions.length - 1 && <hr className="mt-2 mb-4 bg-white" />}
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

export default UsuarioForm;