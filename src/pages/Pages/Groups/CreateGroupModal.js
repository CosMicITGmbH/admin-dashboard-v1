import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Button,
  CardBody,
  Col,
  Input,
  Modal,
  ModalBody,
  ModalHeader,
  Row,
} from "reactstrap";
import AsyncSelect from "react-select/async";
import "react-toastify/dist/ReactToastify.css";
import { debounce } from "lodash";
import MachineSearch from "./MachineSearch";
import { AxiosInstance } from "../../../Axios/axiosConfig";
import { GROUPS_API, USERS_API } from "../../../helpers/appContants";

const CreateGroupModal = (props) => {
  const [groupName, setGroupName] = useState("");
  const [userFilter, setUserFilter] = useState({});
  const [groupId, setGroupid] = useState("");
  const [userId, setUserId] = useState("");
  const [machineId, setMachineId] = useState("");
  const [setup, setSetup] = useState({
    loading: false,
    error: false,
    success: false,
    msg: "",
  });

  useEffect(() => {
    resetStates();
    setGroupid(props.groupId); //in case of adding a user or machine
  }, []);

  const resetStates = () => {
    setGroupName("");
    setUserFilter({});
    setUserId("");
    setMachineId("");
    setSetup({ loading: false, error: false, success: false, msg: "" });
  };
  const loadOptions = debounce(async (inputValue, callback) => {
    if (!inputValue) return;
    try {
      const list = await AxiosInstance.post(`${USERS_API}`, {
        expression: `firstName.contains("${inputValue}") || lastName.contains("${inputValue}") || email.contains("${inputValue}")`,
        sort: "Id ASC",
      });
      if (list.items.length) {
        const tempArray = [];
        list.items.forEach((element) => {
          tempArray.push({
            label: `${element.firstName} ${element.lastName}`,
            value: `${element.id}`,
          });
        });
        callback(tempArray);
      }
    } catch (error) {
      console.log("**error from load options", error);
    }
  }, 300);

  const onSearchChange = debounce((selectedOption) => {
    if (selectedOption) {
      setUserFilter({ selectedOption });
    }
  }, 300);

  const getSelectedMachine = (selectedMachine) => {
    console.log("selected machine", selectedMachine);
    setMachineId(selectedMachine.id);
  };

  const handleFormSubmit = async () => {
    console.log("group new payload", {
      groupName,
      userId,
      machineId,
    });

    if (props.action === "add") {
      if (!groupName || !userId || !machineId) {
        setSetup({ ...setup, error: true, msg: "All fields are required" });
        return;
      }
      const payload = {
        name: groupName,
        userIds: [userId],
        machineIds: [machineId],
      };
      try {
        const resp = await AxiosInstance.put(`${GROUPS_API}`, { ...payload });
        setSetup({
          success: true,
          msg: "Group added successfully",
        });
      } catch (error) {
        setSetup({
          error: true,
          msg: "Error Occured while adding record:" + error,
        });
      }
    } else {
      if (props.addUser) {
        if (!userId) {
          setSetup({
            ...setup,
            error: true,
            msg: "Please select a user to add",
          });
          return;
        }
        try {
          const resp = await AxiosInstance.put(
            `${GROUPS_API}/${groupId}/users/${userId}`,
            {}
          );
          setSetup({
            success: true,
            msg: "User added successfully",
          });
        } catch (error) {
          setSetup({
            error: true,
            msg: "Error Occured while adding record:" + error,
          });
        }
      } else {
        if (!machineId) {
          setSetup({
            ...setup,
            error: true,
            msg: "Please select a machine to add",
          });
          return;
        }
        try {
          const resp = await AxiosInstance.put(
            `${GROUPS_API}/${groupId}/machines/${machineId}`,
            {}
          );

          setSetup({
            success: true,
            msg: "Machine added successfully",
          });
        } catch (error) {
          setSetup({
            error: true,
            msg: "Error Occured while adding record:" + error,
          });
        }
      }
    }

    setTimeout(() => {
      resetStates();
      props.closeCreategrpModal();
      props.reload();
    }, 3000);
  };
  return (
    <React.Fragment>
      {/* modal to change Register */}
      <Modal
        isOpen={props.modalState}
        toggle={() => {
          resetStates();
          props.closeCreategrpModal();
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
          <h5 className="card-title mb-3">{props.title}</h5>
          <Button
            type="button"
            onClick={() => {
              resetStates();
              props.closeCreategrpModal();
            }}
            className="btn-close"
            aria-label="Close"
          ></Button>
        </div>
        <ModalBody style={{ padding: "0" }}>
          {(setup.error || setup.success) && (
            <Row>
              <Col md={11} className="m-auto">
                <Alert color={setup.error ? "danger" : "success"}>
                  {setup.msg}
                </Alert>
              </Col>
              {/* <Alert color={setup.error ? "danger" : "success"}>
                {setup.msg}
              </Alert> */}
            </Row>
          )}
          <CardBody>
            {/* <h5 className="text-primary text-center">{props.title}</h5> */}
            <div className="m-auto mb-2">
              <Col md={8} className="my-2">
                <label htmlFor="createGroup">Group Name</label>
                <Input
                  type="text"
                  className="form-control"
                  id="createGroup"
                  placeholder="Enter New Group Name"
                  disabled={props.action === "update"}
                  value={
                    props.action === "update" ? props.groupName : groupName
                  }
                  onChange={(e) => {
                    setGroupName(e.target.value);
                  }}
                />
              </Col>
              {props.addUser && (
                <Col md={8} className="my-2">
                  <label htmlFor="createGroup">User</label>
                  <AsyncSelect
                    loadOptions={loadOptions}
                    onInputChange={onSearchChange}
                    className="react-select-container"
                    value={userFilter.value}
                    placeholder="search user to add..."
                    onChange={(user) => {
                      console.log("user", user);
                      setUserId(Number(user.value));
                    }}
                  />
                </Col>
              )}
              {props.addMachine && (
                <Col md={8} className="mb-2">
                  <label htmlFor="createGroup">Machine</label>
                  <MachineSearch selectedMachine={getSelectedMachine} />
                </Col>
              )}

              <div className="my-2 m-auto">
                <Button type="button" color="info" onClick={handleFormSubmit}>
                  {props.action === "add" ? "Create" : "Update"}
                </Button>
              </div>
            </div>
          </CardBody>
        </ModalBody>
      </Modal>
    </React.Fragment>
  );
};

export default CreateGroupModal;
