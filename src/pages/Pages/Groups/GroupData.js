import React, { useState, useEffect, useMemo } from "react";
import Loader from "../../../Components/Common/Loader";
import AsyncSelect from "react-select/async";
//for url query params
import { useLocation } from "react-router-dom";
//import { debounce } from "lodash";
import "./groupStyles.css";
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
import MachineGroupdata from "./MachineGroupdata";

const GroupData = (props) => {
  const userColumns = [
    {
      name: <span className="font-weight-bold fs-13">ID</span>,
      selector: (row) => row.id,
      ////sortable: true,
      cell: (row) => (
        <span>{<a href={`/profile?profileID=${row.id}`}>{row.id}</a>}</span>
      ),
    },
    {
      name: <span className="font-weight-bold fs-13">First Name</span>,
      selector: (row) => row.firstName,
      //sortable: true,
      cell: (row) => (
        <span>
          {<a href={`/profile?profileID=${row.id}`}>{row.firstName}</a>}
        </span>
      ),
    },
    {
      name: <span className="font-weight-bold fs-13">Last Name</span>,
      selector: (row) => row.lastName,
      //sortable: true,
      cell: (row) => (
        <span>
          {<a href={`/profile?profileID=${row.id}`}>{row.lastName}</a>}
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

  const [loading, setLoading] = useState(false);
  const [groupData, setgroupData] = useState([]);
  // const [machineData, setMachieItems] = useState([]);
  const [confirmModal, setConfirmModal] = useState(false);
  const [OpenGroupModal, setOpenGroupModal] = useState(false);
  const [successMsg, setSuccess] = useState({
    success: false,
    error: false,
    msg: "",
    // found: false
  });

  const [userFilter, setUserFilter] = useState({});
  const searchParams = useLocation().search;
  const groupId = new URLSearchParams(searchParams).get("groupid");
  const groupname = new URLSearchParams(searchParams).get("groupname");
  const [items, setItems] = useState([]);
  const [itemMachine, setMachieItems] = useState([]);
  const [totalRowsUser, setTotalRowsUser] = useState(0);
  const [userToDelete, setUsertoDelete] = useState(null);
  const [totalRowsMachine, setTotalRowsMachine] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [page, setPage] = useState(1);

  const [sort, setSort] = useState("id asc");
  const [search, setSearch] = useState("");
  const [expression, setExpression] = useState("");

  useEffect(
    () => {
      //check for role:if user then show error msg
      let role = JSON.parse(sessionStorage.getItem("authUser")).data.role;

      setSuccess({
        error: false,
        msg: "",
        success: false,
      });
      if (role.toLowerCase() === "user") {
        setSuccess({
          error: true,
          msg: "You are not authorized to access this page.",
        });

        return props.history.push("/dashboard");
      }

      if (groupId) {
        // fetchGroupData();
        fetchData();
      }
    },
    [groupId]
    // [groupId, page, perPage, sort, expression]
  );
  /**For Async select starts */
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

          if (data) {
            if (data.items.length) {
              data.items.forEach((element) => {
                tempArray.push({
                  label: `${element.firstName} ${element.lastName}`,
                  value: `${element.id}`,
                });
              });
            }
          }

          callback(tempArray);
        })
        .catch((error) => {
          //console.log(error, "catch the hoop");
        });
    }, 500);
  };

  const onSearchChange = (selectedOption) => {
    if (selectedOption) {
      setUserFilter({ selectedOption });
    }
  };
  const addToGroup = (type, value) => {
    setLoading(true);
    if (type == "user") {
      axios
        .put(`/users/profile/${value.value}/groups/${groupId}`)
        .then((data) => {
          setLoading(false);
          setSuccess({
            success: true,
            msg: "User successfully added to the group.",
          });
          fetchDataDefault();
        })
        .catch((e) => {
          setLoading(false);
          setSuccess({
            error: true,
            msg: "Error Ocurred while adding user to the group. " + e,
          });
        });
    } else {
      //add machie to group
    }
  };
  /**For Async select ends */
  const getUserResponse = (response) => {
    setConfirmModal(false);
    if (response) {
      setLoading(true);
      axios
        .delete(`/users/profile/${userToDelete}/groups/${groupId}`)
        .then((data) => {
          setLoading(false);
          if (data.status === 200) {
            setSuccess({
              ...successMsg,
              error: false,
              success: true,
              msg: "User deleted successfully.",
            });
            fetchDataDefault();
          } else {
            setSuccess({
              error: true,
              msg: "Error ocurred while deleting user. " + data.message,
            });
          }
        })
        .catch((err) => {
          setLoading(false);
          setSuccess({
            ...successMsg,
            error: true,
            msg: "Error ocurred while deleting user. " + err,
          });
        });
    }
  };
  const fetchDataDefault = async () => {
    fetchData(page, perPage, sort, expression);
  };
  const fetchData = async () => {
    setLoading(true);
    axios
      .get(`/groups/${groupId}`)
      .then((data) => {
        setLoading(false);

        if (data?.users) {
          setItems(data.users);
        } else {
          setItems([]);
        }

        if (data?.machines) {
          let machineData = data?.machines.map((machine) => {
            return {
              id: machine.key,
              name: machine.name,
            };
          });
          setMachieItems(data.machines);
        } else {
          setMachieItems([]);
        }

        setTotalRowsUser(data.users.length);
        setTotalRowsMachine(data.machines.length);
      })
      .catch((err) => {
        setLoading(false);
        setSuccess({
          error: true,
          success: false,
          msg: `Error: ${err} Please try again later! `,
        });
      });
  };

  const handlePageChange = (page) => {
    setPage(page);
  };

  const handlePerRowsChange = async (newPerPage, page) => {
    setPerPage(newPerPage);
  };

  const handleInputExpression = async (e) => {
    var val = e.target.value.toLowerCase();
    setSearch(val);
    if (val == "") setExpression("");
    else setExpression(`name.Contains("${val}")`);
    // fetchData(page, perPage, sort, val);
  };
  const handleSort = async (column, sortDirection) => {
    // console.log({ column: column.database_name, sortDirection });
    try {
      let sort = column.database_name + " " + sortDirection;

      //console.log({ sort });
      setSort(column.database_name + " " + sortDirection);
    } catch (err) {
      //console.log(err);
      setSuccess({
        error: true,
        success: false,
        msg: `Error: ${err} Please try again later! `,
      });
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
                      <h4>GROUP NAME: {groupname}</h4>
                    </div>
                  </div>
                </CardTitle>
                <CardBody>
                  {/* for users table */}

                  <div className="flexSearchBox">
                    <div>
                      <Label
                        htmlFor="choices-single-no-search"
                        className="form-label text-muted"
                      >
                        Search User
                      </Label>
                      <AsyncSelect
                        loadOptions={loadOptions}
                        onInputChange={onSearchChange}
                        value={userFilter.value}
                        placeholder="Type to search user and add..."
                        onChange={(value) => {
                          addToGroup("user", value);
                        }}
                      />
                    </div>
                  </div>

                  <DataTable
                    title="Users"
                    columns={userColumns}
                    data={items}
                    pagination
                    // paginationServer
                    paginationTotalRows={totalRowsUser}
                    //  paginationRowsPerPageOptions={[5, 10, 25, 50]}
                    onChangePage={handlePageChange}
                    onChangeRowsPerPage={handlePerRowsChange}
                    // sortServer
                    //  onSort={handleSort}
                  />

                  {/* FOR MACHINES */}
                  <MachineGroupdata machineList={itemMachine} />
                  <ConfirmationModal
                    title={`Do you wish to delete ${groupname} group?`}
                    getUserResponse={getUserResponse}
                    modalState={confirmModal}
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
