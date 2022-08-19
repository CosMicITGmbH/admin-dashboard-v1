import React, { useState, useEffect, useMemo } from "react";
import Loader from "../../../Components/Common/Loader";
import { debounce } from "lodash";
import {
  Container,
  Button,
  Card,
  CardBody,
  InputGroup,
  Input,
  Row,
  Col,
} from "reactstrap";
import axios from "axios";
import DataTable from "react-data-table-component";
const Groups = (props) => {
  const columns = [
    {
      name: <span className="font-weight-bold fs-13">ID</span>,
      selector: (row) => row.id,
      sortable: true,
      cell: (row) => (
        <span>
          {
            <a href={`/group/?groupid=${row.id}&groupname=${row.name}`}>
              {row.id}
            </a>
          }
        </span>
      ),
    },
    {
      name: <span className="font-weight-bold fs-13">Name</span>,
      selector: (row) => row.name,
      sortable: true,
      cell: (row) => (
        <span>
          {
            <a href={`/group/?groupid=${row.id}&groupname=${row.name}`}>
              {row.name}
            </a>
          }
        </span>
      ),
    },
    {
      name: <span className="font-weight-bold fs-13">Members</span>,
      selector: (row) => row.member,
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Machine</span>,
      selector: (row) => row.machines,
      sortable: true,
      cell: (row) => <span>{row.machines.join(", ")}</span>,
    },
  ];
  const [loading, setLoading] = useState(false);
  const [groupData, setgroupData] = useState([]);
  const [perPage, setPerPage] = useState(10);
  //id,name,Members,machines
  const getAllGroup = (pageNo, per_Page) => {
    axios
      .post(`/groups?page=${pageNo}&itemsPerPage=${per_Page}`, {})
      .then((res) => {
        console.log(res.items);
        setgridData(res.items);
      })
      .catch((err) => {
        console.log(err);
        if (err.split(" ").includes("401")) {
          props.history.push("/login");
        }
        setLoading(false);
      });
  };

  const setgridData = (data) => {
    let a = [];
    let gridData = data.map((item) => {
      return {
        id: item.groupId,
        name: item.name,
        member: item?.users.length || 0,
        machines: item?.machines.map((machine) => {
          return a.push(`${machine.name}`);
        }),
      };
    });
    gridData[0].machines = a;
    console.log("final res", gridData, a);
    setgroupData(gridData);
  };
  useEffect(() => {
    getAllGroup(1, 10);
  }, []);

  const handlePageChange = (page) => {
    console.log("handlePageChange", page);
    getAllGroup(page, perPage);
    //setTotalRows(totalRows - perPage);
  };
  const handlePerRowsChange = async (newPerPage, page) => {
    //let url = `/users?page=${page}&itemsPerPage=${newPerPage}`;
    console.log(
      `newPerPage=${newPerPage} page=${page} url=/groups?page=${page}&itemsPerPage=${newPerPage}`
    );
    try {
      setLoading(true);
      const response = await axios.post(
        `/groups?page=${page}&itemsPerPage=${newPerPage}`,
        {}
      );
      setLoading(false);
      setgridData(response.items);
    } catch (error) {
      console.log("Err", error);
      setLoading(false);
    }
  };
  const changeHandler = (event) => {
    console.log("event.target.value", event.target.value);
    //setFilterText(event.target.value);
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
              {/**FORM code */}
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
                        //  setFilterText("");
                        // getAllUsers(1)
                      }}
                    >
                      Reset
                    </Button>
                  </InputGroup>
                </Col>
              </Row>
              <Card>
                <CardBody>
                  <DataTable
                    title="List of Groups"
                    columns={columns}
                    data={groupData}
                    pagination
                    paginationServer
                    // paginationTotalRows={totalRows}
                    onChangePage={handlePageChange}
                    onChangeRowsPerPage={handlePerRowsChange}
                    paginationRowsPerPageOptions={[10, 15, 25, 50]}
                    fixedHeader
                  />
                  {/*ALL CODE ABOVE THIS: update profile and change pwd button below*/}
                  <div className="text-center my-4 mx-2">
                    <Button
                      type="button"
                      color="info"
                      onClick={() => {
                        //  setmodalService(true);
                      }}
                    >
                      Add Group
                    </Button>

                    <Button
                      type="button"
                      color="success"
                      onClick={() => {
                        //  setmodalMachine(true);
                      }}
                      style={{ marginLeft: "3px" }}
                    >
                      Add Machine
                    </Button>
                  </div>
                </CardBody>
              </Card>
            </>
          )}
        </Container>
      </div>
    </React.Fragment>
  );
};

export default Groups;
