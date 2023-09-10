import React, { useState } from "react";
import {
  Alert,
  Button,
  CardBody,
  Form,
  FormFeedback,
  Input,
  Label,
  Modal,
  ModalBody,
  Row,
} from "reactstrap";
import Loader from "../../../Components/Common/Loader";
// Formik Validation
import { useFormik } from "formik";
import * as Yup from "yup";

import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import CopyInput from "../../../Components/Reusable/CopyInput";
import {
  REGISTER_SERVICE,
  REGISTER_SERVICE_API,
} from "../../../helpers/appContants";
import { useTranslation } from "react-i18next";

const AddServiceModal = (props) => {
  const { t } = useTranslation();
  const [service, setService] = useState({
    error: false,
    success: false,
    msg: "",
    loading: false,
    disable: false,
  });
  const [response, setResponse] = useState(null);

  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      name: "",
      endpoint: "",
      password: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required(t("Please Enter Name")),
      endpoint: Yup.string().required(t("Please Enter Endpoint")),
      password: Yup.string().required(t("Please Enter password")),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        setService({ ...service, loading: true });
        const resp = await axios.post(REGISTER_SERVICE_API, values);
        setService({
          error: false,
          success: true,
          msg: `${values.name} ${t("successfully registered")}. ${t(
            "The Password and Secret data are only displayed once. Kindly copy them now."
          )}`,
          loading: false,
          disable: true,
        });
        setResponse(resp);
        resetForm({ values: "" });
      } catch (err) {
        setService({
          error: true,
          success: false,
          msg: `${t("Error occured")} : ${t(err)}`,
          loading: false,
        });
        console.log("Error from add service:", err);
      }
    },
  });

  const closeModal = () => {
    props.closeServiceModal();
    setService({
      error: false,
      success: false,
      msg: "",
      loading: false,
      disable: false,
    });
    setResponse(null);
    validation.resetForm();
  };
  return (
    <React.Fragment>
      <Modal
        isOpen={props.modalState}
        toggle={() => {
          closeModal();
        }}
        unmountOnClose={true}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "15px",
          }}
        >
          <div>
            <h5 className="text-primary text-center">
              {t("Register Service")}
            </h5>
          </div>
          <div>
            <Button
              type="button"
              onClick={() => {
                closeModal();
              }}
              className="btn-close"
              aria-label="Close"
            ></Button>
          </div>
        </div>
        <ModalBody>
          <Row className="justify-content-center">
            {service.loading ? (
              <Loader />
            ) : (
              <CardBody className="p-2">
                {service.success && (
                  <Alert
                    variant={service.success === true ? "success" : "danger"}
                  >
                    {service.msg}
                  </Alert>
                )}

                <Form
                  className="form-horizontal"
                  onSubmit={(e) => {
                    e.preventDefault();
                    validation.handleSubmit();
                    return false;
                  }}
                >
                  <div className="form-group mb-1">
                    <Label className="form-label">{t("Name")}</Label>
                    <Input
                      name="name"
                      className="form-control"
                      placeholder={t("Enter Name")}
                      type="text"
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.name || ""}
                      invalid={
                        validation.touched.name && validation.errors.name
                          ? true
                          : false
                      }
                    />
                    {validation.touched.name && validation.errors.name ? (
                      <FormFeedback type="invalid">
                        {validation.errors.name}
                      </FormFeedback>
                    ) : null}
                  </div>
                  {/*last name */}
                  <div className="form-group mb-1">
                    <Label className="form-label">{t("Endpoint")}</Label>
                    <Input
                      name="endpoint"
                      className="form-control"
                      placeholder={t("Enter end point")}
                      type="text"
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.endpoint || ""}
                      invalid={
                        validation.touched.endpoint &&
                        validation.errors.endpoint
                          ? true
                          : false
                      }
                    />
                    {validation.touched.endpoint &&
                    validation.errors.endpoint ? (
                      <FormFeedback type="invalid">
                        {validation.errors.endpoint}
                      </FormFeedback>
                    ) : null}
                  </div>

                  {/*email*/}
                  <div className="form-group mb-1">
                    <Label className="form-label">{t("Password")}</Label>
                    <Input
                      name="password"
                      className="form-control"
                      placeholder={t("Enter Password")}
                      type="text"
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

                  <div className="text-center mt-4 mx-2">
                    <Button
                      type="submit"
                      color="danger"
                      disabled={service.disable}
                    >
                      {t("Add")}
                    </Button>
                  </div>
                </Form>
                {response && (
                  <div style={{ width: "100%", marginTop: "2rem" }}>
                    <CopyInput title="Key" value={response.apiKey} />
                    <CopyInput title="Secret" value={response.apiSecret} />
                    <CopyInput
                      title="Passphrase"
                      value={response.apiPassphrase}
                    />
                  </div>
                )}
              </CardBody>
            )}
          </Row>
        </ModalBody>
      </Modal>
    </React.Fragment>
  );
};

export default AddServiceModal;
