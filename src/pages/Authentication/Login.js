import React, { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  Col,
  Container,
  Input,
  Label,
  Row,
  Button,
  Form,
  FormFeedback,
  Alert,
} from "reactstrap";
import ParticlesAuth from "../AuthenticationInner/ParticlesAuth";

//redux
import { useSelector, useDispatch } from "react-redux";

import { withRouter, Link } from "react-router-dom";

// Formik validation
import * as Yup from "yup";
import { useFormik } from "formik";

import { loginUser, resetLoginFlag } from "../../store/actions";

import logoLight from "../../assets/images/logo-light.png";
import Loader from "../../Components/Common/Loader";
import { useTranslation } from "react-i18next";

const Login = (props) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { user } = useSelector((state) => ({
    user: state.Account.user,
  }));
  const { loading } = useSelector((state) => state.Login);
  const [userLogin, setUserLogin] = useState([]);
  // const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user && user) {
      setUserLogin({
        email: user.user.email,
        password: user.user.confirm_password,
      });
    }
  }, [user]);

  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      email: userLogin.email || "admin@example.com" || "",
      password: userLogin.password || "admin" || "",
    },
    validationSchema: Yup.object({
      email: Yup.string().required("Please Enter Your Email"),
      password: Yup.string().required("Please Enter Your Password"),
    }),
    onSubmit: (values) => {
      //setLoading(true);
      dispatch(loginUser(values, props.history));
      // setLoading(false);
    },
  });

  const { error } = useSelector((state) => ({
    error: state.Login.error,
  }));

  useEffect(() => {
    setTimeout(() => {
      dispatch(resetLoginFlag());
      // setLoading(false);
    }, 3000);
  }, [dispatch, error]);

  useEffect(() => {
    sessionStorage.clear();
  }, []);

  document.title = t("Sign In");
  return (
    <React.Fragment>
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
                  <p className="mt-3 fs-15 fw-medium">LOGIN</p>
                </div>
              </Col>
            </Row>

            <Row className="justify-content-center">
              <Col md={8} lg={6} xl={5}>
                <Card className="mt-4">
                  <CardBody className="p-4">
                    <div className="text-center mt-2">
                      <h5 className="text-primary">{t("Welcome")} !</h5>
                      {/* <p className="text-muted">
                        Sign in to continue to Velzon.
                      </p> */}
                    </div>
                    {error && error ? (
                      <Alert color="danger"> {error} </Alert>
                    ) : null}
                    <div className="p-2 mt-4">
                      {loading ? (
                        <Loader />
                      ) : (
                        <Form
                          onSubmit={(e) => {
                            e.preventDefault();
                            validation.handleSubmit();
                            return false;
                          }}
                          action="#"
                        >
                          <div className="mb-3">
                            <Label htmlFor="email" className="form-label">
                              {t("Email")}
                            </Label>
                            <Input
                              name="email"
                              className="form-control"
                              placeholder={t("Enter email")}
                              type="email"
                              onChange={validation.handleChange}
                              onBlur={validation.handleBlur}
                              value={validation.values.email || ""}
                              invalid={
                                validation.touched.email &&
                                validation.errors.email
                                  ? true
                                  : false
                              }
                            />
                            {validation.touched.email &&
                            validation.errors.email ? (
                              <FormFeedback type="invalid">
                                {validation.errors.email}
                              </FormFeedback>
                            ) : null}
                          </div>

                          <div className="mb-3">
                            {/* <div className="float-end">
                                                        <Link to="/forgot-password" className="text-muted">Forgot password?</Link>
                                                    </div> */}
                            <Label
                              className="form-label"
                              htmlFor="password-input"
                            >
                              {t("Password")}
                            </Label>
                            <div className="position-relative auth-pass-inputgroup mb-3">
                              <Input
                                name="password"
                                value={validation.values.password || ""}
                                type="password"
                                className="form-control pe-5"
                                placeholder={t("Enter Password")}
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                invalid={
                                  validation.touched.password &&
                                  validation.errors.password
                                    ? true
                                    : false
                                }
                              />
                              {validation.touched.password &&
                              validation.errors.password ? (
                                <FormFeedback type="invalid">
                                  {validation.errors.password}
                                </FormFeedback>
                              ) : null}
                              <button
                                className="btn btn-link position-absolute end-0 top-0 text-decoration-none text-muted"
                                type="button"
                                id="password-addon"
                              >
                                <i className="ri-eye-fill align-middle"></i>
                              </button>
                            </div>
                          </div>

                          <div className="mt-4">
                            <Button
                              color="success"
                              className="btn btn-success w-100"
                              type="submit"
                              disabled={loading}
                            >
                              {t("Sign In")}
                            </Button>
                          </div>
                        </Form>
                      )}
                    </div>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </Container>
        </div>
      </ParticlesAuth>
    </React.Fragment>
  );
};

export default withRouter(Login);
