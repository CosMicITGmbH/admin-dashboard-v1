import React from "react";
import { Link } from "react-router-dom";
import { Button, Card, CardBody, Col, Container, Row } from "reactstrap";
import ParticlesAuth from "../ParticlesAuth";
import logoLight from "../../../assets/images/logo-light.png";
import axios from "axios";
const BasicPasswCreate = (props) => {
  document.title =
    "Create New Password | Velzon - React Admin & Dashboard Template";

  const changePassword = (e) => {
    //hit the url and save the pwd
    //  console.log("event", e);
    e.preventDefault();
    const pwd = document.getElementById("password-input").value;
    const ConfirmPwd = document.getElementById("confirm-password-input").value;
    //  console.log(pwd, ConfirmPwd);
    if (pwd.toLowerCase() === ConfirmPwd.toLowerCase()) {
      axios
        .post("/users/profile/1/password", {
          password: pwd,
        })
        .then((data) => {
          if (data.status === 200) {
            //redirect to login page with a message
            //   console.log("pwd successfully changed");
            props.history.push("/login");
          }
        })
        .catch((err) => console.log("error while resetting pwd", err));
    }
  };
  return (
    <ParticlesAuth>
      <div className="auth-page-content">
        <Container>
          <Row>
            <Col lg={12}>
              <div className="text-center mt-sm-5 mb-4 text-white-50">
                <div>
                  <Link to="/" className="d-inline-block auth-logo">
                    <img src={logoLight} alt="" height="20" />
                  </Link>
                </div>
                <p className="mt-3 fs-15 fw-medium">
                  Premium Admin & Dashboard Template
                </p>
              </div>
            </Col>
          </Row>
          <Row className="justify-content-center">
            <Col md={8} lg={6} xl={5}>
              <Card className="mt-4">
                <CardBody className="p-4">
                  <div className="text-center mt-2">
                    <h5 className="text-primary">Reset Password</h5>
                    <p className="text-muted">
                      Your new password must be different from previous used
                      password.
                    </p>
                  </div>

                  <div className="p-2">
                    {/* <form action="/auth-signin-basic"> */}
                    <form action="#" onSubmit={(e) => changePassword(e)}>
                      <div className="mb-3">
                        <label className="form-label" htmlFor="password-input">
                          Password
                        </label>
                        <div className="position-relative auth-pass-inputgroup">
                          <input
                            type="password"
                            className="form-control pe-5 password-input"
                            // onpaste="return false"
                            placeholder="Enter password"
                            id="password-input"
                            aria-describedby="passwordInput"
                            // pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                            required
                          />
                          <Button
                            color="link"
                            className="position-absolute end-0 top-0 text-decoration-none text-muted password-addon"
                            type="button"
                            id="password-addon"
                          >
                            <i className="ri-eye-fill align-middle"></i>
                          </Button>
                        </div>
                        <div id="passwordInput" className="form-text">
                          Must be at least 5 characters.
                        </div>
                      </div>

                      {/* confirm password */}
                      <div className="mb-3">
                        <label
                          className="form-label"
                          htmlFor="confirm-password-input"
                        >
                          Confirm Password
                        </label>
                        <div className="position-relative auth-pass-inputgroup mb-3">
                          <input
                            type="password"
                            className="form-control pe-5 password-input"
                            // onpaste="return false"
                            placeholder="Confirm password"
                            // pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                            id="confirm-password-input"
                            required
                          />
                          <Button
                            color="link"
                            className="position-absolute end-0 top-0 text-decoration-none text-muted password-addon"
                            type="button"
                          >
                            <i className="ri-eye-fill align-middle"></i>
                          </Button>
                        </div>
                      </div>

                      <div className="mt-4">
                        <Button color="success" className="w-100" type="submit">
                          Reset Password
                        </Button>
                      </div>
                    </form>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </ParticlesAuth>
  );
};

export default BasicPasswCreate;
