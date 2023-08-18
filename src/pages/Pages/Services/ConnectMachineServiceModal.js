import React, { useEffect, useState } from "react";
import {
  Alert,
  Button,
  CardBody,
  Form,
  Label,
  Modal,
  ModalBody,
  Row,
} from "reactstrap";
import Loader from "../../../Components/Common/Loader";
// Formik Validation
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import "react-toastify/dist/ReactToastify.css";
import { customAxios } from "../../../Axios/axiosConfig";
import {
  ALL_MACHINES_API,
  ALL_SERVICES_API,
  CONNECT_MACHINE_SERVICE_API,
  GET_CONNECTED_SERVICE_API,
  REACT_APP_API_REPORTING_URL,
} from "../../../helpers/appContants";
import {
  serviceFetchFailed,
  setConnectSuccess,
  setServiceLoading,
  setServiceSuccess,
} from "../../../store/services/action";

const ConnectMachineServiceModal = (props) => {
  const dispatch = useDispatch();

  const [machines, setMachines] = useState([]);
  const [selectedMachine, setSelectedMachine] = useState(null);
  const [selectedservice, setSelectedservice] = useState(null);
  const [filteredServices, setFilteredServices] = useState([]);

  const [errors, setErrors] = useState({
    error: false,
    success: false,
    msg: "",
    loading: false,
    disable: false,
  });

  const fetchMachines = async () => {
    try {
      let reportInstance = customAxios(
        process.env.REACT_APP_API_REPORTING_URL || REACT_APP_API_REPORTING_URL
      );
      const response = await reportInstance.post(`/${ALL_MACHINES_API}`, {
        sort: "Id ASC",
        expression: "",
      });
      const { items } = response.data;
      console.log("machine all:", response);
      if (items.length) {
        const options = items.map((item) => ({
          label: item.uid,
          value: item.id,
        }));
        setMachines([{ options }]);
      }
    } catch (error) {
      setErrors({
        ...errors,
        error: true,
        msg: `Error: ${error}`,
      });
    }
  };

  useEffect(() => {
    fetchMachines();
  }, []);

  const { loading, services, error, msg, success } = useSelector(
    (state) => state.Services
  );

  console.log("redux", { loading, services, error, msg, success });
  /**
   *
   * @param machine obj which has label = uid || name and value: id
   * notes: once the machine is selected we need to fetch all the services and then filter those which are not connected to this machine
   */
  const fetchUnConnectedService = async (machine) => {
    try {
      const unConnectedServiceResp = await axios.post(
        `${GET_CONNECTED_SERVICE_API}/${machine.value}/notconnected`,
        {}
      );

      if (unConnectedServiceResp.items.length) {
        const options = unConnectedServiceResp.items.map((item) => ({
          label: `${item.name}`,
          value: item.key,
        }));
        setFilteredServices([{ options }]);
      }
    } catch (error) {
      console.log("error from GET_CONNECTED_SERVICE_API", error);
    }
  };

  const closeModal = () => {
    dispatch(serviceFetchFailed(""));
    setSelectedservice(null);
    setSelectedMachine(null);
    setFilteredServices(null);
    props.closeConnectModal();
  };

  const handleSubmit = async (e) => {
    console.log("submitting form:", selectedservice, selectedMachine);
    if (!selectedservice || !selectedMachine) {
      return dispatch(serviceFetchFailed("Please select Machine and Service"));
    }

    try {
      const submitResp = await axios.post(
        `${CONNECT_MACHINE_SERVICE_API}/${selectedservice.value}/${selectedMachine.value}`
      );
      console.log("submit resp", submitResp);
      dispatch(
        setConnectSuccess(
          `${selectedservice.label} successfully connected to ${selectedMachine.label} !!`
        )
      );
    } catch (error) {
      console.log("Error saving response:", error);
      dispatch(serviceFetchFailed(error));
    }
  };

  return (
    <React.Fragment>
      <Modal
        isOpen={props.modalState}
        toggle={() => {
          closeModal();
        }}
        size="lg"
        style={{ minWidth: "55%" }}
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
              Connect Machine & Service
            </h5>
          </div>
          <div>
            <Button
              type="button"
              onClick={() => {
                closeModal();
              }}
              className="btn-close" // m-lg-auto
              aria-label="Close"
            ></Button>
          </div>
        </div>

        <ModalBody className="p-0">
          <Row className="justify-content-center">
            {loading ? (
              <Loader />
            ) : (
              <CardBody className="p-4">
                {Boolean(msg) && (
                  <Alert color={success ? "success" : "danger"}>{msg}</Alert>
                )}

                <Form
                  className="form-horizontal"
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmit(e);
                    return false;
                  }}
                >
                  <div className="d-flex gap-3">
                    {/* MACHINES DROPDOWN */}
                    <div className="form-group mb-1">
                      <Label className="form-label">Select Machine</Label>
                      <Select
                        value={selectedMachine}
                        onChange={(machine) => {
                          console.log("selected machine", machine);
                          setSelectedMachine(machine);
                          fetchUnConnectedService(machine);
                        }}
                        options={machines}
                        id="choices-single-default"
                        className="role-select"
                        name="machine"
                      />
                    </div>

                    {/* SERVICES DROPDOWN */}
                    <div
                      className="form-group mb-1"
                      styles={{ width: "300px" }}
                    >
                      <Label className="form-label">Select Service</Label>
                      <Select
                        value={selectedservice}
                        onChange={(selectedVal) => {
                          console.log("selected service", selectedVal);
                          setSelectedservice(selectedVal);
                        }}
                        options={filteredServices}
                        id="choices-single-default"
                        styles={{ width: "300px !important" }}
                        className="role-select"
                        name="service"
                        isDisabled={!selectedMachine}
                      />
                    </div>
                  </div>

                  <div className="text-center mt-4 mx-2">
                    <Button
                      type="submit"
                      color="success"
                      disabled={!selectedservice}
                    >
                      Connect
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

export default ConnectMachineServiceModal;