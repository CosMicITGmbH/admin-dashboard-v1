import React, { useState, useEffect, useMemo } from "react";
import Loader from "../../../Components/Common/Loader";
import AsyncSelect from "react-select/async";
//for url query params
import { useLocation } from "react-router-dom";
//import { debounce } from "lodash";
import "./groupStyles.css";
import {
  Container,
  Button,
  Card,
  CardBody,
  Input,
  Row,
  Col,
  Alert,
  CardTitle,
  Label,
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
    {
      name: <span className="font-weight-bold fs-13">Action</span>,
      selector: (row) => row.id,
      sortable: true,
      cell: (row) => (
        <Button
          type="button"
          color="danger"
          onClick={() => {
            console.log("deletable  id", row.id);
            //remove user from a particular group
            axios
              .delete(`/users/profile/${row.id}/groups/${groupId}`)
              .then((data) => {
                console.log(data);
                setSuccess({
                  ...successMsg,
                  success: true,
                  msg: "User deleted successfully.",
                });
                fetchGroupData();
              })
              .catch((err) => {
                console.log(err);
                setSuccess({
                  ...successMsg,
                  error: true,
                  msg: "Error ocurred while deleting user. " + err,
                });
              });
          }}
        >
          Delete
        </Button>
      ),
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
    {
      name: <span className="font-weight-bold fs-13">Action</span>,
      selector: (row) => row.id,
      sortable: true,
      cell: (row) => (
        <Button
          type="button"
          color="danger"
          onClick={() => {
            console.log("deletable  id", row.id);
          }}
        >
          Delete
        </Button>
      ),
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

  const [userFilter, setUserFilter] = useState({});
  const search = useLocation().search;
  const groupId = new URLSearchParams(search).get("groupid");
  const groupname = new URLSearchParams(search).get("groupname");

  const fetchGroupData = () => {
    axios
      .get(`/groups/${groupId}`)
      .then((data) => {
        console.log("group data", data);
        makeGroupGridData(data);
      })
      .catch((err) => {
        console.log("error while fethcing the data", err);
        setSuccess({
          ...successMsg,
          error: true,
          msg: "No Results found.",
        });
        if (err.split(" ").includes("401")) {
          props.history.push("/login");
        }
        // console.log("error while fethcing the data", err);
      });
  };
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

    if (groupId) {
      fetchGroupData();
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
            props.history.push("/all-groups");
          }, 2000);
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
    props.history.push(
      `/group/?groupid=${response.groupId}&groupname=${response.name}`
    );
  };

  const loadOptions = (inputValue, callback) => {
    if (!inputValue) return;
    setTimeout(() => {
      axios
        .post(`/users`, {
          expression: `firstName.contains("${inputValue}") || lastName.contains("${inputValue}") || email.contains("${inputValue}")`,
          sort: "Id ASC",
        })
        .then((data) => {
          const tempArray = [];
          console.log("data", data);
          if (data) {
            if (data.items.length) {
              console.log("in if");
              data.items.forEach((element) => {
                tempArray.push({
                  label: `${element.firstName} ${element.lastName}`,
                  value: `${element.id}`,
                });
              });
            }
          }
          console.log("tempArray", tempArray);
          callback(tempArray);
        })
        .catch((error) => {
          console.log(error, "catch the hoop");
        });
    }, 1000);
  };

  const onSearchChange = (selectedOption) => {
    console.log("on srch change", selectedOption);
    if (selectedOption) {
      setUserFilter({ selectedOption });
    }
  };
  const addUsertoGroup = (value) => {
    setLoading(true);
    axios
      .put(`/users/profile/${value.value}/groups/${groupId}`)
      .then((data) => {
        setLoading(false);
        setSuccess({
          success: true,
          msg: "User successfully added to the group.",
        });
        fetchGroupData();
      })
      .catch((e) => {
        setLoading(false);
        setSuccess({
          error: true,
          msg: "Error Ocurred while adding user to the group. " + e,
        });
      });
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
                    <Alert color="success">{successMsg.msg}</Alert>
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

                    <div>
                      <Button
                        type="button"
                        color="success"
                        onClick={() => {
                          setOpenGroupModal(true);
                        }}
                      >
                        Create new Group
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
                  <div className="flexSearchBox">
                    <div className="sss-3">
                      <Label
                        htmlFor="choices-single-no-search"
                        className="form-label text-muted"
                      >
                        Search User
                      </Label>
                      <AsyncSelect
                        // cacheOptions
                        loadOptions={loadOptions}
                        //   defaultOptions
                        onInputChange={onSearchChange}
                        value={userFilter.value}
                        placeholder="Type to search user"
                        onChange={(value) => {
                          addUsertoGroup(value);
                        }}
                      />
                    </div>
                    <div>
                      <Button
                        type="button"
                        color="success"
                        onClick={() => {
                          console.log("clear state");
                          setUserFilter({ value: "" });
                        }}
                      >
                        Clear
                      </Button>
                    </div>
                  </div>

                  <DataTable
                    title="Users"
                    columns={userColumns}
                    data={groupData}
                    pagination
                    paginationServer
                    //selectableRows
                    // paginationTotalRows={totalRows}
                    // onChangePage={handlePageChange}
                    // onChangeRowsPerPage={handlePerRowsChange}
                    paginationRowsPerPageOptions={[10, 15, 25, 50]}
                    fixedHeader
                  />

                  {/* for machine table */}
                  {/* <div className="flexSearchBox">
                    <div className="sss-3">
                      <Label
                        htmlFor="choices-single-no-search"
                        className="form-label text-muted"
                      >
                        Search Machine
                      </Label>
                      <AsyncSelect
                        // cacheOptions
                        loadOptions={loadOptions}
                        //   defaultOptions
                        onInputChange={onSearchChange}
                        value={userFilter.value}
                        placeholder="Type to add machine"
                        onChange={(value) => {
                          addMachinetoGroup(value);
                        }}
                      />
                    </div>
                    <div>
                      <Button
                        type="button"
                        color="success"
                        onClick={() => {
                          console.log("clear state");
                          setUserFilter({ value: "" });
                        }}
                      >
                        Clear
                      </Button>
                    </div>
                  </div> */}
                  <DataTable
                    title="Machines"
                    columns={machineColumns}
                    data={machineData}
                    pagination
                    paginationServer
                    //selectableRows
                    // paginationTotalRows={totalRows}
                    // onChangePage={handlePageChange}
                    // onChangeRowsPerPage={handlePerRowsChange}
                    paginationRowsPerPageOptions={[10, 15, 25, 50]}
                    fixedHeader
                  />

                  <ConfirmationModal
                    title={`Do you wish to delete ${groupname} group?`}
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
