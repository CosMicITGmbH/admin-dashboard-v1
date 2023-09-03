import axios from "axios";
import React, { useState } from "react";
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
import { groupTag } from "../../../helpers/appContants";
import DataTableCustom from "../../Widgets/DataTableCustom";
import CreateGroupModal from "./CreateGroupModal";

const AllGroups = (props) => {
  const columns = [
    {
      name: <span className="font-weight-bold fs-13">ID</span>,
      selector: (row) => row.id,
      sortable: true,
      cell: (row) => (
        <span>
          {
            <a
              href="#"
              rel="noreferrer"
              onClick={() => {
                props.history.push(
                  `/group/?groupid=${row.id}&groupname=${row.name}`
                );
              }}
            >
              {row.id}
            </a>
          }
        </span>
      ),
      wrap: true,
      database_name: "id",
    },
    {
      name: <span className="font-weight-bold fs-13">Name</span>,
      selector: (row) => row.name,
      sortable: true,
      cell: (row) => (
        <span>
          {
            <a
              href="#"
              rel="noreferrer"
              onClick={() => {
                props.history.push(
                  `/group/?groupid=${row.id}&groupname=${row.name}`
                );
              }}
            >
              {row.name}
            </a>
          }
        </span>
      ),
      database_name: "name",
    },
    {
      name: <span className="font-weight-bold fs-13">Members</span>,
      selector: (row) => row.member,
      // sortable: true,
      database_name: "users",
    },
    {
      name: <span className="font-weight-bold fs-13">Machine</span>,
      selector: (row) => row.machines,
      // sortable: true,
      // cell: (row) => <span>{row.machines.join(", ")}</span>,
      database_name: "machines",
      wrap: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Delete</span>,
      cell: (row, column) => (
        <Button
          color="danger"
          onClick={() => {
            console.log("grup to delete", row.id);
            setGrouptoDelete(row.id);
            setConfirmModal(true);
          }}
        >
          Delete
        </Button>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];
  const [reloading, setreLoading] = useState(false);
  const [successMsg, setSuccess] = useState({
    success: false,
    error: false,
    msg: "",
  });
  const [groupToDelete, setGrouptoDelete] = useState(null);
  const [OpenGroupModal, setOpenGroupModal] = useState(false);
  const [confirmModal, setConfirmModal] = useState(false);
  const [reloadData, setReload] = useState(false);

  document.title = "All Groups";

  const getUserResponse = (response) => {
    setConfirmModal(false);
    if (response) {
      deleteGroupById(groupToDelete);
    }
  };

  // const createGroupResponse = (response) => {
  //   console.log("respose adding  group:", response);
  //   setOpenGroupModal(false);
  //   // props.history.push(
  //   //   `/group/?groupid=${response.groupId}&groupname=${response.name}`
  //   // );
  // };

  const clearFields = (err) => {
    setSuccess({
      success: false,
      error: true,
      msg: err,
    });
  };

  const deleteGroupById = async (id) => {
    try {
      const delResp = await axios.delete(`/groups/${id}`);
      console.log("delREsp", delResp);
      if (delResp.status === 200) {
        setReload(true);
        setSuccess({
          success: true,
          error: false,
          msg: "Group deleted successfully.",
        });
      }
    } catch (error) {
      console.log("error from deletegrp", error);
      clearFields(error);
    }
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <>
            <Row>
              <Col lg="6">
                {successMsg.error === true ? (
                  <Alert color="danger">{successMsg.msg}</Alert>
                ) : successMsg.success === true ? (
                  <Alert color="success">{successMsg.msg}</Alert>
                ) : null}
              </Col>
            </Row>

            <Card>
              <CardTitle>
                <div className="group">
                  <div>
                    <Button
                      type="button"
                      color="success"
                      onClick={() => {
                        setOpenGroupModal(true);
                      }}
                    >
                      + ADD GROUP
                    </Button>
                  </div>
                </div>
              </CardTitle>
              <CardBody>
                <DataTableCustom
                  columns={columns}
                  url={"groups"}
                  expressions={["name"]}
                  reloadData={reloading}
                  tag={groupTag}
                />
              </CardBody>
            </Card>
            <ConfirmationModal
              title={`Do you wish to delete this user?`}
              getUserResponse={getUserResponse}
              modalState={confirmModal}
            />
            <CreateGroupModal
              title="Create new group"
              closeCreategrpModal={() => setOpenGroupModal(!OpenGroupModal)}
              modalState={OpenGroupModal}
              reload={() => setreLoading(true)}
              addUser={true}
              addMachine={true}
              action={"add"}
            />
          </>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default AllGroups;
