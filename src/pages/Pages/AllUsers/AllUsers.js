import React, { useState, useEffect, useMemo } from "react";
import { isEmpty } from "lodash";
import axios from "axios";
import { Grid, _ } from "gridjs-react";
import { Container, Button, InputGroup, Input, Row, Col } from "reactstrap";
import DataTable from "react-data-table-component";
// import { Cell } from "gridjs";
import RegisterUserModal from "./RegisterUserModal";
import Loader from "../../../Components/Common/Loader";
import Groups from "../Groups/Groups";
import { debounce } from "lodash";
import Select from "../../../Components/Reusable/SelectPage";
//let pages = [5, 10, 20, 30, 40, 50];

const AllUsers = (props) => {
  const [userData, setUserData] = useState([]);
  const [data, setData] = useState([
    {
      id: 1,
      Name: "admin example",
      Email: "admin@example.com",
      Role: "admin",
    },
    {
      id: 2,
      Name: "manager example",
      Email: "manager@example.com",
      Role: "manager",
    },
    {
      id: 3,
      Name: "user example",
      Email: "user@example.com",
      Role: "user",
    },
    {
      id: 4,
      Name: "admin1 admin11",
      Email: "admin1@example.com",
      Role: "admin",
    },
    {
      id: 5,
      Name: "admin2 admin11",
      Email: "admin2@example.com",
      Role: "admin",
    },
  ]);
  // const [page, setPage] = useState(pages[0]);
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(10);

  const [modal_RegistrationModal, setmodal_RegistrationModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [filterText, setFilterText] = React.useState("");
  const [resetPaginationToggle, setResetPaginationToggle] =
    React.useState(false);
  function getRole(role) {
    let newRole;
    switch (role) {
      case "1":
        newRole = "admin";
        break;
      case "2":
        newRole = "manager";
        break;
      case "3":
        newRole = "user";
        break;
      default:
        newRole = role;
        break;
    }
    return newRole;
  }
  const columns = [
    {
      name: <span className="font-weight-bold fs-13">ID</span>,
      selector: (row) => row.id,
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Name</span>,
      selector: (row) => row.Name,
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Email</span>,
      selector: (row) => row.Email,
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Role</span>,
      selector: (row) => row.Role,
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Open</span>,
      cell: (row) => <a href={"/profile?profileID=" + row.id}>Profile</a>,
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Delete</span>,
      cell: (row, column) => (
        <Button
          onClick={() => {
            console.log("button clicked", row.id);
            deleteUserById(row.id);
          }}
        >
          Delete
        </Button>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Groups</span>,
      columns: [
        {
          name: "ID",
        },
        {
          name: "Name",
        },
      ],
    },
  ];
  function getAllUsers(pageNo, per_Page) {
    setLoading(true);
    console.log(`url=/users?page=${pageNo}&itemsPerPage=${per_Page}`);
    axios
      .post(`/users?page=${pageNo}&itemsPerPage=${per_Page}`, {})
      .then((data) => {
        console.log(data);
        //  let newArr = [];
        let res1 = data.items.map((item) => {
          return {
            id: item.id,
            Name: item.firstName + " " + item.lastName,
            Email: item.email,
            Role: getRole(item.role),
          };
        });
        // getRole(item.role)
        console.log("res1", res1, data.totalItems);
        // console.log("newArr", newArr);
        setTotalRows(data.totalItems);
        setUserData(res1);
        setLoading(false);
      })

      .catch((err) => {
        console.log(err);
        if (err.split(" ").includes("401")) {
          props.history.push("/login");
        }
        setLoading(false);
      });
  }
  useEffect(() => {
    let pageLimit = 1;
    // let itemsPerPage = 5;
    //check role n
    let userRole = JSON.parse(sessionStorage.getItem("authUser")).data.role;
    console.log("user role", userRole);
    if (userRole !== "user") {
      getAllUsers(1, 10);
    } else {
      //redirect to dashboard
      props.history.push("/dashboard");
    }
  }, []);

  const deleteUserById = (id) => {
    console.log("id to be deleted", id);
    axios
      .delete(`/users/${id}`)
      .then((data) => {
        //  console.log("data delete successfully");

        getAllUsers(1, perPage); //already handles loading
      })
      .catch((err) => {
        console.log("err occurred while delete data", err);
        alert(err);
        setLoading(false);
      });
  };

  const handlePageChange = (page) => {
    console.log("handlePageChange", page);
    getAllUsers(page, perPage);
    setTotalRows(totalRows - perPage);
  };
  const handlePerRowsChange = async (newPerPage, page) => {
    //let url = `/users?page=${page}&itemsPerPage=${newPerPage}`;
    console.log(
      `newPerPage=${newPerPage} page=${page} url=/users?page=${page}&itemsPerPage=${newPerPage}`
    );
    try {
      setLoading(true);
      const response = await axios.post(
        `/users?page=${page}&itemsPerPage=${newPerPage}`,
        {}
      );
      console.log("items:", response);
      let res1 = response.items.map((item) => {
        return {
          id: item.id,
          Name: item.firstName + " " + item.lastName,
          Email: item.email,
          Role: getRole(item.role),
        };
      });
      setUserData(res1);
      setPerPage(newPerPage);
      setLoading(false);
    } catch (error) {
      console.log("Err", error);
      setLoading(false);
    }
  };

  const changeHandler = (event) => {
    console.log("event.target.value", event.target.value);
    setFilterText(event.target.value);
  };
  const debouncedChangeHandler = useMemo(
    () => debounce(changeHandler, 300),
    []
  );
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {loading ? (
            <Loader />
          ) : (
            <>
              <Row>
                <Col>
                  <InputGroup>
                    <Input
                      // value={filterText}
                      type="text"
                      placeholder="Search any field..."
                      onChange={debouncedChangeHandler}
                    />
                    <Button
                      onClick={() => {
                        console.log("clear button clicked");
                        setFilterText("");
                        // getAllUsers(1)
                      }}
                    >
                      Reset
                    </Button>
                  </InputGroup>
                </Col>
                <Col>
                  <Button
                    type="button"
                    color="info"
                    //  disabled={userData.currentRole === "user"}
                    onClick={() => {
                      //  changePassword();
                      setmodal_RegistrationModal(true);

                      console.log("open register gui");
                    }}
                    style={{ marginLeft: "3px" }}
                  >
                    Register a user
                  </Button>{" "}
                </Col>
              </Row>

              <DataTable
                title="List of Users"
                columns={columns}
                data={userData}
                pagination
                paginationServer
                paginationTotalRows={totalRows}
                onChangePage={handlePageChange}
                onChangeRowsPerPage={handlePerRowsChange}
                paginationRowsPerPageOptions={[10, 15, 25, 50]}
                fixedHeader
                //paginationTotalRows
                //  paginationDefaultPage={perPage}
                //fixedHeaderScrollHeight="500px"
                //selectableRows
                //persistTableHead
                //subHeader
                // subHeaderComponent={subHeaderComponentMemo}
              />
            </>
          )}
          <RegisterUserModal
            modalState={modal_RegistrationModal}
            closeRegModal={() => {
              setmodal_RegistrationModal(!modal_RegistrationModal);
            }}
          />
        </Container>
      </div>
    </React.Fragment>
  );
};

export default AllUsers;
