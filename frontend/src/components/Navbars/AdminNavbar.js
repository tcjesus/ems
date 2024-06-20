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
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
// reactstrap components
import {
  Container,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Media,
  Nav,
  Navbar,
  UncontrolledDropdown
} from "reactstrap";

import AuthService from 'services/AuthService.js';
import LocalidadeService from 'services/LocalidadeService.js';
import UsuarioService from "services/UsuarioService";

const AdminNavbar = (props) => {
  const navigate = useNavigate();

  const [account, setAccount] = useState({});
  const [localidade, setLocalidade] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const account = await AuthService.getAccount();
      if (account) {
        let response = undefined
        try {
          response = await UsuarioService.get(account.id);
        } catch (error) {
          console.error(error);
        }
        setAccount(response || account);
      }

      const localidade = await LocalidadeService.getLocalidade();
      setLocalidade(localidade);
    }
    if (isLoading) {
      fetchData();
    }
    setIsLoading(false);
  }, [isLoading]);

  const logout = async (e) => {
    e.preventDefault();
    try {
      await AuthService.signOut();
      navigate("/login");
    } catch (error) {
      console.error(error);
      alert('Erro ao sair');
    }
  }

  const handleLocalidadeChange = async (e) => {
    const localidade = e.target.value;
    setLocalidade(localidade)
    await LocalidadeService.setLocalidade(localidade);

    setTimeout(() => {
      window.location.reload();
    }, 100);
  }

  return (
    <>
      <Navbar className="navbar-top navbar-dark" expand="md" id="navbar-main">
        <Container fluid>
          <Link
            className="h4 mb-0 text-white text-uppercase d-none d-lg-inline-block"
            to="/"
          >
            {/* {props.brandText} */}
          </Link>
          {/* <Form className="navbar-search navbar-search-dark form-inline mr-3 d-none d-md-flex ml-lg-auto">
            <FormGroup className="mb-0">
              <InputGroup className="input-group-alternative">
                <InputGroupAddon addonType="prepend">
                  <InputGroupText>
                    <i className="fas fa-search" />
                  </InputGroupText>
                </InputGroupAddon>
                <Input placeholder="Search" type="text" />
              </InputGroup>
            </FormGroup>
          </Form> */}
          <Nav className="align-items-center d-none d-md-flex" navbar>
            <LocalidadeSelect
              id="input-localidade"
              className="form-control-alternative"
              name="localidade"
              onChange={handleLocalidadeChange}
              value={localidade}
            />
            {account.id && (
              <UncontrolledDropdown nav>
                <DropdownToggle className="pr-0" nav>
                  <Media className="align-items-center">
                    <span className="avatar avatar-sm rounded-circle">
                      <img
                        alt="..."
                        src={require("../../assets/img/theme/profile.png")}
                      />
                    </span>
                    <Media className="ml-2 d-none d-lg-block">
                      <span className="mb-0 text-sm font-weight-bold" style={{ whiteSpace: 'nowrap' }}>
                        {account.nome}
                      </span>
                    </Media>
                  </Media>
                </DropdownToggle>
                <DropdownMenu className="dropdown-menu-arrow" right>
                  <DropdownItem className="noti-title" header tag="div">
                    <h6 className="text-overflow m-0">Bem Vindo!</h6>
                  </DropdownItem>
                  <DropdownItem href="#pablo" onClick={logout}>
                    <i className="ni ni-user-run" />
                    <span>Logout</span>
                  </DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
            )}
          </Nav>
        </Container>
      </Navbar>
    </>
  );
};

export default AdminNavbar;
