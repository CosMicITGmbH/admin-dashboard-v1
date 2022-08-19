import React, { useState, useEffect } from "react";
import Loader from "../../../Components/Common/Loader";
//for url query params
import { useLocation } from "react-router-dom";
import {
  Container,
  Button,
  Card,
  CardBody,
  InputGroup,
  Input,
  Row,
  Col,
  Alert,
  CardTitle,
} from "reactstrap";
import axios from "axios";
import DataTable from "react-data-table-component";
import ConfirmationModal from "../../../Components/Reusable/ConfirmationModal";
import CreateGroupModal from "./CreateGroupModal";
const GroupData = (props) => {
  const userColumns = [
    {
      name: <span className="font-weight-bold fs-13">ID</span>,
      selector: (row) => row.id,
      sortable: true,
      cell: (row) => (
        <span>{<a href={`/profile?profileID=${row.id}`}>{row.id}</a>}</span>
      ),
    },
    {
      name: <span className="font-weight-bold fs-13">First Name</span>,
      selector: (row) => row.firstName,
      sortable: true,
      cell: (row) => (
        <span>
          {<a href={`/profile?profileID=${row.id}`}>{row.firstName}</a>}
        </span>
      ),
    },
    {
      name: <span className="font-weight-bold fs-13">Last Name</span>,
      selector: (row) => row.lastName,
      sortable: true,
      cell: (row) => (
        <span>
          {<a href={`/profile?profileID=${row.id}`}>{row.lastName}</a>}
        </span>
      ),
    },
    {
      name: <span className="font-weight-bold fs-13">Role</span>,
      selector: (row) => row.role,
      sortable: true,
    },
  ];
  const machineColumns = [
    {
      name: <span className="font-weight-bold fs-13">ID</span>,
      selector: (row) => row.id,
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Name</span>,
      selector: (row) => row.name,
      sortable: true,
    },
  ];
  const [loading, setLoading] = useState(false);
  const [groupData, setgroupData] = useState([]);
  const [machineData, setmachineData] = useState([]);
  const [confirmModal, setConfirmModal] = useState(false);
  const [OpenGroupModal, setOpenGroupModal] = useState(false);
  const [successMsg, setSuccess] = useState({
    success: false,
    error: false,
    msg: "",
    // found: false
  });

  const search = useLocation().search;
  const groupId = new URLSearchParams(search).get("groupid");
  const groupname = new URLSearchParams(search).get("groupname");

  useEffect(() => {
    //check for role:if user then show error msg
    let role = JSON.parse(sessionStorage.getItem("authUser")).data.role;
    console.log("role", role);
    if (role.toLowerCase() === "user") {
      return setSuccess({
        error: true,
        msg: "You are not authorized to access this page.",
      });
    }
    let res = {
      users: [
        {
          id: 1,
          email: "admin@example.com",
          firstName: "admin",
          lastName: "example",
          role: "admin",
        },
        {
          id: 2,
          email: "manager@example.com",
          firstName: "manager",
          lastName: "example",
          role: "manager",
        },
      ],
      groupId: 1,
      name: "Test Group",
      machines: [
        {
          key: "0dd27ca8-b303-4768-9185-f04bc7bde86a",
          name: "Test Machine #1",
          machine: {
            id: 1,
            connectedServices: [
              {
                key: "14b667f8-060b-4305-9fb9-d202066a0a1a",
                name: "api.reporting",
                endpoint: "https://report.csharpify.com/reporting/v1",
                insertedAt: "2022-07-28T09:47:00.9948781",
                updatedAt: "2022-07-28T09:47:00.9948781",
              },
            ],
          },
          endpoint: "1.1.1.1",
          insertedAt: "2022-07-28T08:35:45.1665621",
          updatedAt: "2022-07-28T08:35:45.1665621",
        },
        {
          key: "90d6f37b-e31e-494f-9130-df19244e75c9",
          name: "Test Machine #3",
          machine: {
            id: 3,
          },
          endpoint: "1.1.1.3",
          insertedAt: "2022-07-28T08:35:54.2450391",
          updatedAt: "2022-07-28T08:35:54.2450391",
        },
      ],
    };
    if (groupId) {
      makeGroupGridData(res);
    }
    return () => {
      //  cleanup;
    };
  }, [groupId]);

  const makeGroupGridData = (data) => {
    let grpData = data.users.map((user) => {
      return {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      };
    });
    //  console.log("group data", grpData);

    let machineData = data?.machines.map((machine) => {
      return {
        id: machine.key,
        name: machine.name,
      };
    });
    // console.log("group data", grpData);
    setgroupData(grpData);
    setmachineData(machineData);
  };
  const getUserResponse = (response) => {
    console.log("user response", response);
    if (response) {
      setLoading(true);
      axios
        .delete(`/groups/${groupId}`)
        .then(() => {
          setLoading(false);
          setSuccess({
            success: true,
            msg: "Group deleted successfully. Redirecting to all groups.",
          });
          setTimeout(() => {
            props.history.push("/groups");
          }, 3000);
        })
        .catch((err) => {
          setLoading(false);
        });
    }
    setConfirmModal(false);
  };
  const createGroupResponse = (response) => {
    console.log("group created", response);
    setOpenGroupModal(false);
    setgroupData([]);
    setmachineData([]);
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
                  {successMsg.error === true ? (
                    <Alert color="danger">{successMsg.msg}</Alert>
                  ) : successMsg.success === true ? (
                    <Alert color="danger">{successMsg.msg}</Alert>
                  ) : null}
                </Col>
              </Row>
              <Card style={{ padding: "5px" }}>
                <CardTitle>
                  <div className="group">
                    <div>
                      {" "}
                      <h4>{groupname}</h4>
                    </div>

                    <div className="group-action-button">
                      <Button
                        type="button"
                        color="success"
                        onClick={() => {
                          setOpenGroupModal(true);
                        }}
                      >
                        Create a Group
                      </Button>

                      <Button
                        type="button"
                        color="danger"
                        onClick={() => {
                          setConfirmModal(true);
                        }}
                        style={{ marginLeft: "3px" }}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardTitle>
                <CardBody>
                  {/* for users table */}
                  <DataTable
                    title="Users"
                    columns={userColumns}
                    data={groupData}
                    pagination
                    paginationServer
                    selectableRows
                    // paginationTotalRows={totalRows}
                    // onChangePage={handlePageChange}
                    // onChangeRowsPerPage={handlePerRowsChange}
                    paginationRowsPerPageOptions={[10, 15, 25, 50]}
                    fixedHeader
                  />
                  <input
                    type="text"
                    placeholder="use select and call api to filter user names"
                  />
                  {/* for machine table */}
                  <DataTable
                    title="Machines"
                    columns={machineColumns}
                    data={machineData}
                    pagination
                    paginationServer
                    selectableRows
                    // paginationTotalRows={totalRows}
                    // onChangePage={handlePageChange}
                    // onChangeRowsPerPage={handlePerRowsChange}
                    paginationRowsPerPageOptions={[10, 15, 25, 50]}
                    fixedHeader
                  />
                  <input
                    type="text"
                    placeholder="use select and call api to filter  machine names"
                  />
                  <ConfirmationModal
                    title="Do you wish to delete this group?"
                    getUserResponse={getUserResponse}
                    modalState={confirmModal}
                  />
                  <CreateGroupModal
                    title="Enter new group name"
                    closeCreategrpModal={() =>
                      setOpenGroupModal(!OpenGroupModal)
                    }
                    modalState={OpenGroupModal}
                    groupResponse={createGroupResponse}
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
