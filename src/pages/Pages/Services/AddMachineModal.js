import React, { useState } from "react";
import Loader from "../../../Components/Common/Loader";
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
  Alert,
} from "reactstrap";
// Formik Validation
import * as Yup from "yup";
import { useFormik } from "formik";

//import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import CopyInput from "../../../Components/Reusable/CopyInput";

const AddMachineModal = (props) => {
  // const [loading, setLoading] = useState(false);
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
      //  nameService: "",
      endpoint: "",
      password: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Please Enter Machine Name"),

      endpoint: Yup.string().required("Please Enter Endpoint"),
      password: Yup.string().required("Please Enter password"),
    }),
    onSubmit: (values, { resetForm }) => {
      try {
        setService({ ...service, loading: true });
        axios
          .post("/auth/machine/register", values)
          .then((data) => {
            setService({
              error: false,
              success: true,
              msg: `${values.name} successfully registered. The Password and Secret data are only displayed once. Kindly copy them now.`,
              loading: false,
              disable: true,
            });
            setResponse(data);
            resetForm({ values: "" });
          })
          .catch((err) => {
            setService({
              error: true,
              success: false,
              msg: `Error: ${err}. Please try again later! `,
              loading: false,
            });
          });
      } catch (err) {
        setService({
          error: true,
          success: false,
          msg: `Error: ${err}. Please try again later! `,
          loading: false,
        });
      }
    },
  });
  const closeModal = () => {
    props.closeMachineModal();
    setService({
      error: false,
      success: false,
      msg: "",
      loading: false,
      disable: false,
    });
    setResponse(null);
  };
  return (
    <React.Fragment>
      <Modal
        isOpen={props.modalState}
        toggle={() => {
          closeModal();
        }}
      >
        <ModalHeader style={{ marginLeft: "auto" }}>
          <div>
            <Button
              type="button"
              onClick={() => {
                closeModal();
              }}
              className="btn-close m-lg-auto"
              aria-label="Close"
            ></Button>
          </div>
        </ModalHeader>
        <ModalBody>
          <Row className="justify-content-center">
            {service.loading ? (
              <Loader />
            ) : (
              <CardBody className="p-4">
                {service.success && (
                  <Alert
                    variant={service.success === true ? "success" : "danger"}
                  >
                    {service.msg}
                  </Alert>
                )}
                <h5 className="text-primary text-center">
                  Add Machine-Service form
                </h5>

                <Form
                  className="form-horizontal"
                  onSubmit={(e) => {
                    e.preventDefault();
                    validation.handleSubmit();
                    return false;
                  }}
                >
                  <div className="form-group">
                    <Label className="form-label">Name</Label>
                    <Input
                      name="name"
                      className="form-control"
                      placeholder="Enter Name"
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
                  <div className="form-group">
                    <Label className="form-label">Endpoint</Label>
                    <Input
                      name="endpoint"
                      // value={name}
                      className="form-control"
                      placeholder="Enter end point"
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
                  <div className="form-group">
                    <Label className="form-label">Password</Label>
                    <Input
                      name="password"
                      className="form-control"
                      placeholder="Enter Password"
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
                      Add
                    </Button>
                  </div>
                </Form>
                {response && (
                  <div style={{ width: "100%", marginTop: "2rem" }}>
                    <CopyInput title="Name" value={response.api.name} />
                    <CopyInput title="Key" value={response.api.apiKey} />
                    <CopyInput title="Secret" value={response.api.apiSecret} />
                    <CopyInput
                      title="Passphrase"
                      value={response.api.apiPassphrase}
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

export default AddMachineModal;
