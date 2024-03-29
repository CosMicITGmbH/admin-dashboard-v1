/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { Alert, Button, Col, Container, Row } from "reactstrap";
import ConfirmationModal from "../../../Components/Reusable/ConfirmationModal";
import { PROFILE_ID_API, userTag } from "../../../helpers/appContants";
import DataTableCustom from "../../Widgets/DataTableCustom";
import RegisterUserModal from "./RegisterUserModal";
import { useTranslation } from "react-i18next";
const AllUsers = () => {
  const { t } = useTranslation();
  const columns = [
    {
      name: <span className="font-weight-bold fs-13">{t("ID")}</span>,
      selector: (row) => row.id,
      sortable: true,
      database_name: "id",
    },
    {
      name: <span className="font-weight-bold fs-13">{t("First Name")}</span>,
      selector: (row) => row.firstName,
      database_name: "firstName",
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">{t("Last Name")}</span>,
      selector: (row) => row.lastName,
      database_name: "lastName",
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">{t("Email")}</span>,
      selector: (row) => row.email,
      database_name: "email",
      sortable: true,
      wrap: true,
    },
    {
      name: <span className="font-weight-bold fs-13">{t("Role")}</span>,
      selector: (row) => row.role,
      database_name: "role",
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">{t("Open")}</span>,
      cell: (row) => (
        <a
          href="#"
          onClick={(ev) => {
            ev.preventDefault();
            openProfilePage(row.id);
          }}
          rel="noreferrer"
        >
          {t("Profile")}
        </a>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
    {
      name: <span className="font-weight-bold fs-13"> {t("Delete")}</span>,
      cell: (row, column) => (
        <Button
          color="danger"
          onClick={() => {
            setUsertoDelete(row.id);
            setConfirmModal(true);
          }}
        >
          {t("Delete")}
        </Button>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];
  const history = useHistory();

  const openProfilePage = (profid) => {
    const profileUrl = `${PROFILE_ID_API}${profid}`;
    history.push(profileUrl);
  };
  const [successMsg, setSuccess] = useState({
    success: false,
    error: false,
    msg: "",
  });
  const [reloadData, setReload] = useState(false);
  const [userToDelete, setUsertoDelete] = useState(null);
  const [confirmModal, setConfirmModal] = useState(false);
  const [modal_RegistrationModal, setmodal_RegistrationModal] = useState(false);

  document.title = t("All Users");

  const getUserResponse = (response) => {
    setConfirmModal(false);
    if (response) {
      deleteUserById(userToDelete);
    }
  };

  const clearFields = (err) => {
    setSuccess({
      success: false,
      error: true,
      msg: err,
    });
  };

  const deleteUserById = async (id) => {
    try {
      const resp = await axios.delete(`/users/${id}`);
      if (resp.status === 200) {
        setReload(true);
        setSuccess({
          success: true,
          error: false,
          msg: t("User deleted successfully."),
        });
      }
    } catch (error) {
      console.log("Error from all users:", error);
      clearFields(error);
    }
  };

  return (
    <div className="page-content">
      <Container>
        <Row>
          <Col lg="12" md="6" sm={12}>
            {successMsg.error === true ? (
              <Alert color="danger">{successMsg.msg}</Alert>
            ) : successMsg.success === true ? (
              <Alert color="success">{successMsg.msg}</Alert>
            ) : null}
          </Col>
        </Row>
        <div className="mx-auto mb-2 w-25">
          <Button
            type="button"
            color="success"
            onClick={() => {
              setReload(false);
              setmodal_RegistrationModal(true);
            }}
          >
            + {t("Add User")}
          </Button>
        </div>
        <DataTableCustom
          title={"Users"}
          columns={columns}
          url={"users"}
          expressions={["firstname", "lastname", "email"]}
          reloadData={reloadData}
          tag={userTag}
        />
        <RegisterUserModal
          modalState={modal_RegistrationModal}
          closeRegModal={() => {
            setmodal_RegistrationModal(!modal_RegistrationModal);
            setReload(true);
          }}
        />
        <ConfirmationModal
          title={t(`Do you wish to delete this user?`)}
          confirmResp={getUserResponse}
          modalState={confirmModal}
        />
      </Container>
    </div>
  );
};

export default AllUsers;
