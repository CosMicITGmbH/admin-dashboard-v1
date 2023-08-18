import React, { useEffect, useState } from "react";
import Loader from "../../../Components/Common/Loader";
//for url query params
import { useLocation } from "react-router-dom";
//import { debounce } from "lodash";
import axios from "axios";
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
  GROUPS_API,
  machineInAGroupTag,
  userInAGroupTag,
  userRole,
} from "../../../helpers/appContants";
import DataTableCustom from "../../Widgets/DataTableCustom";
import { machineColumns } from "./MachineGroupdata";
import "./groupStyles.css";
import CreateGroupModal from "./CreateGroupModal";

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
  const [addUser, setAddUser] = useState(false);
  const [addMachine, setAddMachine] = useState(false);
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
  const history = useHistory();

  useEffect(
    () => {
      if (getUserRole() === userRole) {
        return history.push("/dashboard");
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

        setMachieItems(data);
        setTotalRowsUser(data.users.length);
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
                  {/* <div className="flexSearchBox">
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
                  </div> */}
                  {/* <DataTable
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
                  /> */}
                  <DataTableCustom
                    columns={userColumns}
                    url={groupId}
                    expressions={["firstName", "lastName", "email"]}
                    tag={userInAGroupTag}
                    title="Users"
                  />

                  <DataTableCustom
                    columns={machineColumns}
                    url={groupId}
                    expressions={["name", "endpoint"]}
                    tag={machineInAGroupTag}
                    title="Machines"
                  />

                  <ConfirmationModal
                    title={`Do you wish to delete ${groupname} group?`}
                    getUserResponse={getUserResponse}
                    modalState={confirmModal}
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
