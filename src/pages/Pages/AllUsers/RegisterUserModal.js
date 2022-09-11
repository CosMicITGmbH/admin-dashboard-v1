import React, { useState } from "react";
import {
  Row,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  CardBody,
  Input,
  Label,
  Form,
  FormFeedback,
  Col,
  Alert,
} from "reactstrap";

// Formik Validation
import * as Yup from "yup";
import { useFormik } from "formik";

//import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import Loader from "../../../Components/Common/Loader";

const RegisterUserModal = (props) => {
  const [registration, setRegistration] = useState({
    error: false,
    success: false,
    msg: "",
    loading: false,
  });
  const [successMsg, setSuccess] = useState({
    success: false,
    error: false,
    msg: "",
    // found: false
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
    onSubmit: (values, { resetForm }) => {
      let newVal = { ...values };
      if (
        typeof newVal.role === "string" &&
        newVal.role.toLowerCase() === "admin"
      ) {
        newVal.role = 1;
      } else if (
        typeof newVal.role === "string" &&
        newVal.role.toLowerCase() === "manager"
      ) {
        newVal.role = 2;
      } else {
        //for normal user
        newVal.role = 3;
      }

      try {
        setRegistration({ ...registration, loading: true });
        axios
          .post("/auth/user/register", newVal)
          .then((data) => {
            let username = newVal.firstName || "user";
            setRegistration({
              error: false,
              success: true,
              msg: `${username} Successfully Registered. `,
              loading: false,
            });

            setTimeout(() => {
              props.closeRegModal();
              setRegistration({
                error: false,
                success: false,
              });
            }, 2000);
            resetForm();
          })
          .catch((err) => {
            setRegistration({
              error: true,
              success: false,
              msg: `Error: ${err} Please try again later! `,
              loading: false,
            });
          });
      } catch (err) {
        setRegistration({
          error: true,
          success: false,
          msg: `Error: ${err} Please try again later! `,
          loading: false,
        });
      }
    },
  });

  return (
    <React.Fragment>
      {/* modal to change Register */}
      <Modal
        isOpen={props.modalState}
        toggle={() => {
          props.closeRegModal();
        }}
      >
        <ModalHeader style={{ marginLeft: "auto" }}>
          {/* <h6>Close</h6> */}
          <div>
            <Button
              type="button"
              onClick={() => {
                // setmodal_Register(false);
                props.closeRegModal();
              }}
              className="btn-close m-lg-auto"
              aria-label="Close"
            ></Button>
          </div>
        </ModalHeader>
        <ModalBody>
          <Row className="justify-content-center">
            {registration.loading ? (
              <Loader />
            ) : (
              <CardBody className="p-4">
                <h5 className="text-primary text-center">
                  User Registation form
                </h5>
                <Row>
                  <Col lg="12">
                    {registration.error === true ? (
                      <Alert color="danger">{registration.msg}</Alert>
                    ) : registration.success === true ? (
                      <Alert color="success">{registration.msg}</Alert>
                    ) : null}
                  </Col>
                </Row>

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
                        validation.touched.email && validation.errors.email
                          ? true
                          : false
                      }
                      // disabled={userData.role === "user"}
                    />
                    {validation.touched.email && validation.errors.email ? (
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
                  </div>
                </Form>
              </CardBody>
            )}
          </Row>
        </ModalBody>
      </Modal>
    </React.Fragment>
  );
};

export default RegisterUserModal;
