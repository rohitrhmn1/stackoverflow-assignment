import { Navbar, Container, Nav, NavDropdown } from "react-bootstrap";
import React from "react";
import { NavLink } from "react-router-dom";

function Header() {
  return (
    <Navbar expand="lg" id="navbar" variant="dark">
      <Container fluid>
        <Navbar.Brand to="/" as={NavLink}>
          STO
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <NavLink
              to="/"
              className={(status) =>
                "nav-link" + (status.isActive ? " active" : "")
              }
            >
              Home
            </NavLink>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;
