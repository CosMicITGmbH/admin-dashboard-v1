import { debounce } from "lodash";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import AsyncSelect from "react-select/async";
import "react-toastify/dist/ReactToastify.css";
import {
  Alert,
  Button,
  CardBody,
  Col,
  Input,
  Modal,
  ModalBody,
  Row,
} from "reactstrap";
import { AxiosInstance } from "../../../Axios/axiosConfig";
import { GROUPS_API, USERS_API } from "../../../helpers/appContants";
import MachineSearch from "./MachineSearch";
import { useTranslation } from "react-i18next";

const CreateGroupModal = (props) => {
  const history = useHistory();
  const { t } = useTranslation();
  const [groupName, setGroupName] = useState("");
  const [userFilter, setUserFilter] = useState({});
  const [groupId, setGroupid] = useState("");
  const [userId, setUserId] = useState([]);
  const [machineId, setMachineId] = useState([]);
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
      setSetup({ ...setSetup, loading: true });
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
      } else {
        callback([]);
      }

      setSetup({ ...setSetup, loading: false });
    } catch (error) {
      console.log("**error from load options", error);
    }
  }, 300);

  const onSearchChange = debounce((selectedOption) => {
    if (selectedOption) {
      setUserFilter({ selectedOption });
    }
  }, 300);

  const getSelectedMachine = (selectedMachine, action) => {
    console.log("selected machine", { selectedMachine, action });
    // setMachineId(selectedMachine.id);
    if (action.action === "remove-value") {
      const machine = machineId.filter(
        (id) => id !== action["removedValue"]["id"]
      );
      setMachineId(machine);
    } else {
      // action==="select-option"
      setMachineId([...machineId, action.option.id]);
    }
  };

  const handleFormSubmit = async () => {
    console.log("group new payload", {
      groupName,
      userId,
      machineId,
    });

    if (props.action === "add") {
      if (!groupName) {
        setSetup({ ...setup, error: true, msg: t("Group Name required") });
        return;
      }
      const payload = {
        name: groupName,
        userIds: [],
        machineIds: [],
      };
      try {
        const resp = await AxiosInstance.put(`${GROUPS_API}`, { ...payload });
        setSetup({
          success: true,
          msg: t("Group added successfully. Redirecting..."),
        });

        setTimeout(
          () =>
            history.push(
              `/group/?groupid=${resp.groupId}&groupname=${resp.name}`
            ),
          3000
        );
      } catch (error) {
        setSetup({
          error: true,
          msg: "" + error,
        });
      }
    } else {
      if (props.addUser) {
        console.log("userId", userId);
        if (!userId.length) {
          setSetup({
            ...setup,
            error: true,
            msg: t("Please select a user to add"),
          });
          return;
        }
        try {
          await Promise.all(
            userId.map(async (id) => {
              const resp = await AxiosInstance.put(
                `${GROUPS_API}/${groupId}/users/${Number(id)}`,
                {}
              );
            })
          );
          setSetup({
            success: true,
            msg: t("User added successfully"),
          });
        } catch (error) {
          setSetup({
            error: true,
            msg: t("Error occured") + " : " + error,
          });
        }
      } else {
        if (!machineId.length) {
          setSetup({
            ...setup,
            error: true,
            msg: t("Please select a machine to add"),
          });
          return;
        }
        try {
          await Promise.all(
            machineId.map(async (id) => {
              const resp = await AxiosInstance.put(
                `${GROUPS_API}/${groupId}/machines/${id}`,
                {}
              );
            })
          );

          setSetup({
            success: true,
            msg: t("Machine added successfully"),
          });
        } catch (error) {
          setSetup({
            error: true,
            msg: t("Error occured") + " : " + error,
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
          <h5 className="card-title mb-3">{t(props.title)}</h5>
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
            </Row>
          )}
          <CardBody>
            <div className="m-auto mb-2">
              <Col md={8} className="my-2">
                <label htmlFor="createGroup">{t("Group Name")}</label>
                <Input
                  type="text"
                  className="form-control"
                  id="createGroup"
                  placeholder={t("Enter New Group Name")}
                  disabled={props.action === "update"}
                  value={
                    props.action === "update" ? props.groupName : groupName
                  }
                  onChange={(e) => {
                    setGroupName(e.target.value);
                  }}
                />
              </Col>
              {props.action === "update" && props.addUser && (
                <Col md={8} className="my-2">
                  <label htmlFor="createGroup">{t("User")}</label>
                  <AsyncSelect
                    isLoading={setup.loading}
                    loadOptions={loadOptions}
                    isMulti
                    isClearable={true}
                    isSearchable={true}
                    onInputChange={onSearchChange}
                    value={userFilter.value}
                    placeholder={t("search user to add")}
                    onChange={(user, action) => {
                      console.log("userId", { user, action });

                      if (action.action === "remove-value") {
                        const newUserIds = userId.filter(
                          (id) => id !== action["removedValue"]["value"]
                        );
                        setUserId(newUserIds);
                      } else {
                        // action==="select-option"
                        setUserId([...userId, action.option.value]);
                      }
                    }}
                  />
                </Col>
              )}
              {props.action === "update" && props.addMachine && (
                <Col md={8} className="mb-2">
                  <label htmlFor="createGroup">{t("Machine")}</label>
                  <MachineSearch
                    selectedMachine={getSelectedMachine}
                    isMulti={true}
                    isClearable={true}
                    isSearchable={true}
                  />
                </Col>
              )}

              <div className="my-2 m-auto">
                <Button type="button" color="info" onClick={handleFormSubmit}>
                  {props.action === "add" ? t("Create") : t("Update")}
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
