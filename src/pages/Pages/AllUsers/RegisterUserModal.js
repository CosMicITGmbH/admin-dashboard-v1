import React, { useEffect, useState } from "react";
import {
  Alert,
  Button,
  CardBody,
  Col,
  Form,
  FormFeedback,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalHeader,
  Row,
} from "reactstrap";

// Formik Validation
import { useFormik } from "formik";
import * as Yup from "yup";

//import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "../../../Components/Common/Loader";
import { fetchRoles } from "../../../helpers/api_helper";
import { AxiosInstance } from "../../../Axios/axiosConfig";
import { REGISTER_USER_API } from "../../../helpers/appContants";
import { useTranslation } from "react-i18next";

const RegisterUserModal = (props) => {
  const { t } = useTranslation();
  const [roles, setRoles] = useState([]);
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

  useEffect(() => {
    async function getRoles() {
      const resp = await fetchRoles();
      console.log("roles:", resp[0].options);
      setRoles(resp[0].options);
    }
    getRoles();
  }, []);

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
      firstName: Yup.string().required(t("Please Enter First Name")),
      password: Yup.string().required(t("Please Enter Password")),
      lastName: Yup.string().required(t("Please Enter Last Name")),
      role: Yup.number().required(
        t("Please Enter Role ex: user, admin or manager")
      ),
      email: Yup.string().required(t("Please Enter Email")),
    }),
    onSubmit: async (values, { resetForm }) => {
      let newVal = { ...values, role: Number(values.role) };

      console.log("values***", values);
      try {
        setRegistration({ ...registration, loading: true });
        const resp = await AxiosInstance.post(`${REGISTER_USER_API}`, newVal);
        console.log("REGISTER RESP:", resp);
        setRegistration({
          error: false,
          success: true,
          msg: `${newVal.firstName} ${t("successfully registered")}.`,
          loading: false,
        });

        setTimeout(() => {
          resetForm();
          props.closeRegModal();
          setRegistration({
            error: false,
            success: false,
          });
        }, 2000);
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
        unmountOnClose={true}
      >
        <ModalHeader style={{ marginLeft: "auto" }}>
          {/* <h6>Close</h6> */}
          <div>
            <Button
              type="button"
              onClick={() => {
                validation.resetForm();
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
                  {t("User Registation form")}
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
                    <Label className="form-label">{t("First Name")}</Label>
                    <Input
                      name="firstName"
                      className="form-control"
                      placeholder={t("Enter First Name")}
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
                  </div>
                  {/*last name */}
                  <div className="form-group">
                    <Label className="form-label">{t("Last Name")}</Label>
                    <Input
                      name="lastName"
                      className="form-control"
                      placeholder={t("Enter Last Name")}
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
                    />
                    {validation.touched.lastName &&
                    validation.errors.lastName ? (
                      <FormFeedback type="invalid">
                        {validation.errors.lastName}
                      </FormFeedback>
                    ) : null}
                  </div>

                  {/*email*/}
                  <div className="form-group">
                    <Label className="form-label">{t("Email")}</Label>
                    <Input
                      name="email"
                      className="form-control"
                      placeholder={t("Enter User Name")}
                      type="text"
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.email || ""}
                      invalid={
                        validation.touched.email && validation.errors.email
                          ? true
                          : false
                      }
                    />
                    {validation.touched.email && validation.errors.email ? (
                      <FormFeedback type="invalid">
                        {validation.errors.email}
                      </FormFeedback>
                    ) : null}
                  </div>
                  {/*password*/}
                  <div className="form-group">
                    <Label className="form-label">{t("Password")}</Label>
                    <Input
                      name="password"
                      className="form-control"
                      placeholder={t("Enter Your Password")}
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
                    />
                    {validation.touched.password &&
                    validation.errors.password ? (
                      <FormFeedback type="invalid">
                        {validation.errors.password}
                      </FormFeedback>
                    ) : null}
                  </div>
                  {/*role*/}
                  <div className="form-group">
                    <Label className="form-label">{t("Role")}</Label>
                    <select
                      {...validation.getFieldProps("role")}
                      className={`form-control ${
                        validation.touched.role && validation.errors.role
                          ? "is-invalid"
                          : ""
                      }`}
                    >
                      <option value="" label={t("Select a role")} disabled />
                      {roles.map((role) => (
                        <option key={role.value} value={role.value}>
                          {role.label.toUpperCase()}
                        </option>
                      ))}
                    </select>
                    {validation.touched.role && validation.errors.role && (
                      <div className="invalid-feedback">
                        {validation.errors.role}
                      </div>
                    )}
                  </div>

                  <div className="text-center mt-4 mx-2">
                    <Button type="submit" color="danger">
                      {t("Register")}
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
