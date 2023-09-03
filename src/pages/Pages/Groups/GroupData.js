import React, { useEffect, useState } from "react";
import Loader from "../../../Components/Common/Loader";
//for url query params
import { useLocation } from "react-router-dom";
//import { debounce } from "lodash";
import { useHistory } from "react-router-dom";
import {
  Alert,
  Button,
  Card,
  CardBody,
  CardTitle,
  Col,
  Container,
  Row,
} from "reactstrap";
import ConfirmationModal from "../../../Components/Reusable/ConfirmationModal";
import { getUserRole } from "../../../helpers/api_helper";
import {
  machineInAGroupTag,
  userInAGroupTag,
  userRole,
} from "../../../helpers/appContants";
import DataTableCustom from "../../Widgets/DataTableCustom";
import CreateGroupModal from "./CreateGroupModal";
// import { machineColumns } from "./MachineGroupdata";
import { AxiosInstance } from "../../../Axios/axiosConfig";
import "./groupStyles.css";

const GroupData = (props) => {
  const userColumns = [
    {
      name: <span className="font-weight-bold fs-13">ID</span>,
      selector: (row) => row.id,
      ////sortable: true,
      cell: (row) => (
        <span>
          {
            <a
              href="#"
              rel="noreferrer"
              onClick={() => {
                props.history.push(`/profile?profileID=${row.id}`);
              }}
            >
              {row.id}
            </a>
          }
        </span>
      ),
    },
    {
      name: <span className="font-weight-bold fs-13">First Name</span>,
      selector: (row) => row.firstName,
      //sortable: true,
      cell: (row) => (
        <span>
          {
            <a
              href="#"
              rel="noreferrer"
              onClick={() => {
                props.history.push(`/profile?profileID=${row.id}`);
              }}
            >
              {row.firstName}
            </a>
          }
        </span>
      ),
    },
    {
      name: <span className="font-weight-bold fs-13">Last Name</span>,
      selector: (row) => row.lastName,
      //sortable: true,
      cell: (row) => (
        <span>
          {
            <a
              href="#"
              rel="noreferrer"
              onClick={() => {
                props.history.push(`/profile?profileID=${row.id}`);
              }}
            >
              {row.lastName}
            </a>
          }
        </span>
      ),
    },
    {
      name: <span className="font-weight-bold fs-13">Role</span>,
      selector: (row) => row.role,
      //sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Action</span>,
      selector: (row) => row.id,
      //sortable: true,
      cell: (row) => (
        <Button
          type="button"
          color="danger"
          onClick={() => {
            //remove user from a particular group
            setUsertoDelete(row.id);
            setConfirmModal(true);
          }}
        >
          Delete
        </Button>
      ),
    },
  ];
  const machineColumns = [
    {
      name: <span className="font-weight-bold fs-13">Key</span>,
      selector: (row) => row.key,
      sortable: true,
      wrap: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Name</span>,
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Action</span>,
      selector: (row) => row.machine.id,
      sortable: true,
      cell: (row) => (
        <Button
          type="button"
          color="danger"
          onClick={() => {
            console.log("machine id to delete", row.machine.id);
            setMachinetoDelete(row.machine.id);
            setConfirmModalMachine(true);
          }}
        >
          Delete
        </Button>
      ),
    },
  ];

  const [reloading, setreLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [addUser, setAddUser] = useState(false);
  const [addMachine, setAddMachine] = useState(false);
  const [confirmModal, setConfirmModal] = useState(false);
  const [confirmModalMachine, setConfirmModalMachine] = useState(false);
  const [OpenGroupModal, setOpenGroupModal] = useState(false);
  const [successMsg, setSuccess] = useState({
    success: false,
    error: false,
    msg: "",
    // found: false
  });

  const searchParams = useLocation().search;
  const groupId = new URLSearchParams(searchParams).get("groupid");
  const groupname = new URLSearchParams(searchParams).get("groupname");
  const [userToDelete, setUsertoDelete] = useState(null);
  const [machineToDelete, setMachinetoDelete] = useState(null);
  console.log("detail group", { groupId, groupname });
  const history = useHistory();

  useEffect(() => {
    if (getUserRole() === userRole) {
      return history.push("/dashboard");
    }
  }, [groupId]);

  /** deletes a user*/
  const getUserResponse = async (response) => {
    setConfirmModal(false);
    if (response) {
      try {
        await AxiosInstance.delete(
          `/users/profile/${userToDelete}/groups/${groupId}`
        );
        setSuccess({
          ...successMsg,
          error: false,
          success: true,
          msg: "User deleted successfully.",
        });
        setreLoading(true);
        window.location.reload();
      } catch (error) {
        setSuccess({
          ...successMsg,
          error: true,
          msg: "Error ocurred while deleting user. " + error,
        });
      }
    }
  };

  //deletes a machine
  const getMachineResponse = async (resp) => {
    setConfirmModalMachine(false);
    if (resp) {
      try {
        await AxiosInstance.delete(
          `/groups/${groupId}/machines/${machineToDelete}`
        );
        setSuccess({
          ...successMsg,
          error: false,
          success: true,
          msg: "Machine deleted successfully.",
        });
        setreLoading(true);
      } catch (error) {
        setSuccess({
          ...successMsg,
          error: true,
          msg: "Error ocurred while deleting user. " + error,
        });
      }
    }
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {loading ? (
            <Loader />
          ) : (
            <>
              {/**FORM code */}
              <Row>
                <Col lg="12">
                  {successMsg.error || successMsg.success ? (
                    <Alert color={successMsg.success ? "success" : "error"}>
                      {successMsg.msg}
                    </Alert>
                  ) : null}
                </Col>
              </Row>
              <Card style={{ padding: "5px" }}>
                <CardTitle>
                  <div className="group">
                    <div>
                      <h4>GROUP NAME: {groupname}</h4>
                    </div>
                  </div>
                </CardTitle>
                <CardBody>
                  {/* USER TABLE */}
                  <DataTableCustom
                    columns={userColumns}
                    url={groupId}
                    expressions={["firstName", "lastName", "email"]}
                    tag={userInAGroupTag}
                    title="Users"
                  />
                  {/* Machine TABLE */}
                  <DataTableCustom
                    columns={machineColumns}
                    url={groupId}
                    expressions={["name", "endpoint"]}
                    tag={machineInAGroupTag}
                    title="Machines"
                    reloadData={reloading}
                  />

                  <ConfirmationModal
                    title={`Do you wish to remove this user from group?`}
                    confirmResp={getUserResponse}
                    modalState={confirmModal}
                  />
                  <ConfirmationModal
                    title={`Do you wish to remove this machine from group?`}
                    confirmResp={getMachineResponse}
                    modalState={confirmModalMachine}
                  />

                  <div
                    style={{
                      display: "flex",
                      flexWrap: "nowrap",
                      alignContent: "center",
                      justifyContent: "center",
                      alignItems: "center",
                      gap: "5px",
                    }}
                  >
                    <Button
                      type="button"
                      color="success"
                      onClick={() => {
                        setAddUser(true);
                        setAddMachine(false);
                        setOpenGroupModal(true);
                        setreLoading(false);
                      }}
                    >
                      Add User
                    </Button>

                    <Button
                      type="button"
                      color="secondary"
                      onClick={() => {
                        setAddUser(false);
                        setAddMachine(true);
                        setOpenGroupModal(true);
                        setreLoading(false);
                      }}
                    >
                      Add Machine
                    </Button>
                  </div>

                  <CreateGroupModal
                    title="Update Group"
                    closeCreategrpModal={() =>
                      setOpenGroupModal(!OpenGroupModal)
                    }
                    modalState={OpenGroupModal}
                    groupId={groupId}
                    groupName={groupname}
                    addUser={addUser}
                    addMachine={addMachine}
                    action={"update"}
                    reload={() => setreLoading(true)}
                  />
                </CardBody>
              </Card>
            </>
          )}
        </Container>
      </div>
    </React.Fragment>
  );
};

export default GroupData;
