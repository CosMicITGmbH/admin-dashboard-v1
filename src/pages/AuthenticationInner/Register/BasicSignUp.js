import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardBody,
  Col,
  Container,
  Row,
  Alert,
  Button,
  Label,
  Input,
  FormFeedback,
  Form,
} from "reactstrap";
import ParticlesAuth from "../ParticlesAuth";
// Formik Validation
import * as Yup from "yup";
import { useFormik } from "formik";
import axios from "axios";
//import images
import logoLight from "../../../assets/images/logo-light.png";

const BasicSignUp = () => {
  const [registration, setRegistration] = useState({
    error: false,
    success: false,
    msg: "",
  });
  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      firstName: "",
      password: "",
      lastName: "",
      role: "",
      email: "",
    },
    validationSchema: Yup.object({
      firstName: Yup.string().required("Please Enter Your First Name"),
      password: Yup.string().required("Please Enter Your Password"),
      lastName: Yup.string().required("Please Enter Your Last Name"),
      role: Yup.string().required(
        "Please Enter Your Role ex: user,admin or manager"
      ),
      email: Yup.string().required("Please Enter Your Email"),
    }),
    onSubmit: (values) => {
      // console.log("values on submit", values);
      if (
        typeof values.role === "string" &&
        values.role.toLowerCase() === "admin"
      ) {
        values.role = 1;
      } else if (
        typeof values.role === "string" &&
        values.role.toLowerCase() === "manager"
      ) {
        values.role = 2;
      } else {
        //for normal user
        values.role = 3;
      }
      // console.log("edited profile ", values);
      try {
        axios
          .post("/auth/user/register", values)
          .then((data) => {
            //   console.log("post data", data);
            let username = values.firstName || "user";
            setRegistration({
              error: false,
              success: true,
              msg: `${username} || successfully registered. `,
            });
          })
          .catch((err) => {
            //    console.log("post data", err);
            setRegistration({
              error: true,
              success: false,
              msg: `Error: ${err} Please try again later! `,
            });
          });
      } catch (error) {
        setRegistration({
          error: true,
          success: false,
          msg: `${values.firstName} successfully registered. `,
        });
      }

      // if (
      //   typeof values.role === "string" &&
      //   values.role.toLowerCase() === "admin"
      // ) {
      //   values.role = 1;
      // } else if (
      //   typeof values.role === "string" &&
      //   values.role.toLowerCase() === "manager"
      // ) {
      //   values.role = 2;
      // } else {
      //   //for normal user
      //   values.role = 3;
      // }
      //   console.log("edited profile ", values);
      // dispatch(editProfile(values));
    },
  });

  document.title = "Basic SignUp | Velzon - React Admin & Dashboard Template";
  return (
    <React.Fragment>
      <ParticlesAuth>
        <div className="auth-page-content">
          <Container>
            <Row>
              <Col lg={12}>
                {registration.error ? (
                  <Alert color="danger">{registration.msg}</Alert>
                ) : null}
                {registration.success ? (
                  <Alert color="success">User Successfully Registered.</Alert>
                ) : null}
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
                      <h5 className="text-primary">User Registation form</h5>
                      {/* <p className="text-muted">
                        Get your free velzon account now
                      </p> */}
                    </div>
                    <div className="p-2 mt-4">
                      <Form
                        className="form-horizontal"
                        onSubmit={(e) => {
                          e.preventDefault();
                          validation.handleSubmit();
                          return false;
                        }}
                      >
                        <div className="form-group">
                          <Label className="form-label">First Name</Label>
                          <Input
                            name="firstName"
                            // value={name}
                            className="form-control"
                            placeholder="Enter Fisrt Name"
                            type="text"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.firstName || ""}
                            //disabled={userData.role === "user"}
                            invalid={
                              validation.touched.firstName &&
                              validation.errors.firstName
                                ? true
                                : false
                            }
                          />
                          {validation.touched.firstName &&
                          validation.errors.firstName ? (
                            <FormFeedback type="invalid">
                              {validation.errors.firstName}
                            </FormFeedback>
                          ) : null}
                          {/* <Input
                            name="idx"
                            value={userData.idx}
                            type="hidden"
                          /> */}
                        </div>
                        {/*last name */}
                        <div className="form-group">
                          <Label className="form-label">Last Name</Label>
                          <Input
                            name="lastName"
                            // value={name}
                            className="form-control"
                            placeholder="Enter Last Name"
                            type="text"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.lastName || ""}
                            invalid={
                              validation.touched.lastName &&
                              validation.errors.lastName
                                ? true
                                : false
                            }
                            //  disabled={userData.role === "user"}
                          />
                          {validation.touched.lastName &&
                          validation.errors.lastName ? (
                            <FormFeedback type="invalid">
                              {validation.errors.lastName}
                            </FormFeedback>
                          ) : null}
                          {/* <Input
                            name="idx"
                            value={userData.idx}
                            type="hidden"
                          /> */}
                        </div>

                        {/*email*/}
                        <div className="form-group">
                          <Label className="form-label">Email</Label>
                          <Input
                            name="email"
                            // value={name}
                            className="form-control"
                            placeholder="Enter User Name"
                            type="text"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.email || ""}
                            invalid={
                              validation.touched.email &&
                              validation.errors.email
                                ? true
                                : false
                            }
                            // disabled={userData.role === "user"}
                          />
                          {validation.touched.email &&
                          validation.errors.email ? (
                            <FormFeedback type="invalid">
                              {validation.errors.email}
                            </FormFeedback>
                          ) : null}
                          {/* <Input
                            name="idx"
                            value={userData.idx}
                            type="hidden"
                          /> */}
                        </div>
                        {/*password*/}
                        <div className="form-group">
                          <Label className="form-label">Password</Label>
                          <Input
                            name="password"
                            // value={name}
                            className="form-control"
                            placeholder="Enter Your Password"
                            type="password"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.password || ""}
                            invalid={
                              validation.touched.password &&
                              validation.errors.password
                                ? true
                                : false
                            }
                            // disabled={userData.role === "user"}
                          />
                          {validation.touched.password &&
                          validation.errors.password ? (
                            <FormFeedback type="invalid">
                              {validation.errors.password}
                            </FormFeedback>
                          ) : null}
                          {/* <Input
                            name="idx"
                            value={userData.idx}
                            type="hidden"
                          /> */}
                        </div>
                        {/*role*/}
                        <div className="form-group">
                          <Label className="form-label">Role</Label>
                          <Input
                            name="role"
                            // value={name}
                            className="form-control"
                            placeholder="Enter User Name"
                            type="text"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.role}
                            // value={
                            //   validation.values.role === 1
                            //     ? "admin"
                            //     : validation.values.role === 2
                            //     ? "manager"
                            //     : validation.values.role === 3
                            //     ? "user"
                            //     : validation.values.role
                            // }
                            invalid={
                              validation.touched.role && validation.errors.role
                                ? true
                                : false
                            }
                            // disabled={userData.role === "user"}
                          />
                          {validation.touched.role && validation.errors.role ? (
                            <FormFeedback type="invalid">
                              {validation.errors.role}
                            </FormFeedback>
                          ) : null}
                          {/* <Input
                            name="idx"
                            value={userData.idx}
                            type="hidden"
                          /> */}
                        </div>

                        <div className="text-center mt-4 mx-2">
                          <Button
                            type="submit"
                            color="danger"
                            //  disabled={userData.role === "user"}
                          >
                            Register
                          </Button>

                          {/* <Button
                            type="button"
                            color="info"
                            disabled={userData.role === "user"}
                            onClick={() => changePassword()}
                          >
                            Change Password
                          </Button> */}
                        </div>
                      </Form>
                      {/* <form className="needs-validation" action="#">
                        <div className="mb-3">
                          <label htmlFor="useremail" className="form-label">
                            Email <span className="text-danger">*</span>
                          </label>
                          <input
                            type="email"
                            className="form-control"
                            id="useremail"
                            placeholder="Enter email address"
                            required
                          />
                          <div className="invalid-feedback">
                            Please enter email
                          </div>
                        </div>
                        <div className="mb-3">
                          <label htmlFor="username" className="form-label">
                            Username <span className="text-danger">*</span>
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="username"
                            placeholder="Enter username"
                            required
                          />
                          <div className="invalid-feedback">
                            Please enter username
                          </div>
                        </div>

                        <div className="mb-3">
                          <label
                            className="form-label"
                            htmlFor="password-input"
                          >
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
                              pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                              required
                            />
                            <button
                              className="btn btn-link position-absolute end-0 top-0 text-decoration-none text-muted password-addon"
                              type="button"
                              id="password-addon"
                            >
                              <i className="ri-eye-fill align-middle"></i>
                            </button>
                            <div className="invalid-feedback">
                              Please enter password
                            </div>
                          </div>
                        </div>

                        <div className="mb-2">
                          <label htmlFor="userpassword" className="form-label">
                            Password <span className="text-danger">*</span>
                          </label>
                          <input
                            type="password"
                            className="form-control"
                            id="userpassword"
                            placeholder="Enter password"
                            required
                          />
                          <div className="invalid-feedback">
                            Please enter password
                          </div>
                        </div>

                        <div className="mb-4">
                          <p className="mb-0 fs-12 text-muted fst-italic">
                            By registering you agree to the Velzon
                            <Link
                              to="#"
                              className="text-primary text-decoration-underline fst-normal fw-medium"
                            >
                              {" "}
                              Terms of Use
                            </Link>
                          </p>
                        </div>

                        <div
                          id="password-contain"
                          className="p-3 bg-light mb-2 rounded"
                        >
                          <h5 className="fs-13">Password must contain:</h5>
                          <p id="pass-length" className="invalid fs-12 mb-2">
                            Minimum <b>8 characters</b>
                          </p>
                          <p id="pass-lower" className="invalid fs-12 mb-2">
                            At <b>lowercase</b> letter (a-z)
                          </p>
                          <p id="pass-upper" className="invalid fs-12 mb-2">
                            At least <b>uppercase</b> letter (A-Z)
                          </p>
                          <p id="pass-number" className="invalid fs-12 mb-0">
                            A least <b>number</b> (0-9)
                          </p>
                        </div>

                        <div className="mt-4">
                          <button
                            className="btn btn-success w-100"
                            type="submit"
                          >
                            Sign Up
                          </button>
                        </div>

                       
                      </form> */}
                    </div>
                  </CardBody>
                </Card>

                <div className="mt-4 text-center">
                  <p className="mb-0">
                    Already have an account ?{" "}
                    <Link
                      to="/auth-signin-basic"
                      className="fw-semibold text-primary text-decoration-underline"
                    >
                      {" "}
                      Signin{" "}
                    </Link>{" "}
                  </p>
                </div>
              </Col>
            </Row>
          </Container>
        </div>
      </ParticlesAuth>
    </React.Fragment>
  );
};

export default BasicSignUp;
