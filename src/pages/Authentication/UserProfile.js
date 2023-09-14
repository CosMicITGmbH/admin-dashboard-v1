/* eslint-disable jsx-a11y/anchor-is-valid */
//
import { Grid, _ } from "gridjs-react";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Card,
  CardBody,
  Col,
  Container,
  Form,
  FormFeedback,
  Input,
  Label,
  Modal,
  ModalBody,
  Row,
} from "reactstrap";
// Formik Validation
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import { AxiosInstance as axios } from "../../Axios/axiosConfig";
import { getLoggedinUser, getUserRole } from "../../helpers/api_helper";
import {
  UPDATE_PROFILE_API,
  adminRole,
  managerRole,
  userRole,
} from "../../helpers/appContants";
import RoleOptions from "../Forms/Select2/RoleOptions";
import { useTranslation } from "react-i18next";

const UserProfile = () => {
  const { t } = useTranslation();
  const history = useHistory();
  //const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccess] = useState({
    success: false,
    error: false,
    msg: "",
    // found: false
  });
  const [userData, setUserData] = useState({
    idx: 0,
    firstName: "",
    lastName: "",
    email: "",
    role: "user",
    currentRole: "",
    groups: [],
  });
  const [userGroup, setUserGroup] = useState([]);
  const [modal_grid, setmodal_grid] = useState(false);

  function tog_grid() {
    setmodal_grid(!modal_grid);
  }
  const [modal_role, setmodal_role] = useState(false);

  function getRole(value) {
    setUserData({ ...userData, role: value.label });
    setmodal_role(false);
  }

  function tog_roleModal() {
    setmodal_role(!modal_role);
  }
  const { user, success, error } = useSelector((state) => ({
    user: state.Profile.user,
    success: state.Profile.success,
    error: state.Profile.error,
  }));
  const search = useLocation().search;
  let profid = new URLSearchParams(search).get("profileID"); //|| getLoggedinUser().data.id;

  const updateUserDataAndGroups = async (profid) => {
    const data = await axios.get(`${UPDATE_PROFILE_API}/${profid}`);
    setUserData({
      ...userData,
      idx: data.id,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      role: data.role,
      currentRole: getUserRole(),
      groups: data.groups,
    });
    setGroupArr(data.groups);
  };
  useEffect(() => {
    if (profid) {
      updateUserDataAndGroups(profid);
    } else {
      const userData = getLoggedinUser().data;
      if (userData) {
        // if (!isEmpty(user)) {
        //   userData.firstName = user.firstName;
        //   sessionStorage.removeItem("authUser");
        //   sessionStorage.setItem("authUser", JSON.stringify(obj));
        // }

        setUserData({
          ...userData,
          idx: userData.id,
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
          role: userData.role,
          groups: userData.groups,
        });

        setGroupArr(userData.groups);

        // setTimeout(() => {
        //   dispatch(resetProfileFlag());
        // }, 3000);
      }
    }
  }, [user, profid]);

  const setGroupArr = (groups) => {
    const newArr = groups.map((item) => [item.groupId, item.name]);
    setUserGroup(newArr);
  };

  const deleteUserGroupId = (id) => {
    let newGroup = userData.groups.filter((item) => item.groupId !== id);
    setUserData({ ...userData, groups: newGroup });
    setGroupArr(newGroup);
  };

  const resetPwdValidation = useFormik({
    enableReinitialize: true,
    initialValues: {
      password: "",
      changePassword: "",
    },
    validationSchema: Yup.object({
      password: Yup.string()
        .required(t("New Password is required"))
        .min(4, t("Password should be minimum 4 characters long")),
      changePassword: Yup.string().when("password", {
        is: (val) => (val && val.length > 0 ? true : false),
        then: Yup.string().oneOf(
          [Yup.ref("password")],
          t("Passwords must match")
        ),
      }),
    }),
    onSubmit: async (values) => {
      try {
        const resp = await axios.post(
          `${UPDATE_PROFILE_API}/${validation.initialValues.idx}/password`,
          {
            password: values.password,
          }
        );
        setSuccess({
          success: true,
          error: false,
          msg: t("Password Changed successfully"),
        });

        setTimeout(() => {
          setmodal_grid(false);
        }, 3000);
      } catch (err) {
        setSuccess({
          success: false,
          error: true,
          msg: err,
        });
      }
    },
  });

  const getRoleId = (values) => {
    if (
      typeof values.role === "string" &&
      values.role.toLowerCase() === adminRole
    ) {
      return 1;
    } else if (
      typeof values.role === "string" &&
      values.role.toLowerCase() === managerRole
    ) {
      return 2;
    } else {
      //for normal user
      return 3;
    }
  };

  const clearReload = () => {
    setLoading(true);
    setSuccess({
      ...successMsg,
      error: false,
      msg: "",
    });
  };

  const succesStopReload = () => {
    setLoading(false);
    setSuccess({
      success: true,
      error: false,
      msg: "Profile updated successfully",
    });
  };

  const errorStopReload = (err) => {
    setLoading(false);
    setSuccess({
      success: false,
      error: true,
      msg: `Error: ${err}`,
    });
  };

  const openGroupPage = (groupId, groupName) => {
    history.push(`group/?groupid=${groupId}&groupname=${groupName}`);
  };

  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,
    initialValues: {
      firstName: userData.firstName || "",
      idx: userData.idx || "",
      lastName: userData.lastName || "",
      role: userData.role || "",
      email: userData.email || "",
    },
    validationSchema: Yup.object({
      firstName: Yup.string().required(t("Please Enter First Name")),
      lastName: Yup.string().required(t("Please Enter Last Name")),
      email: Yup.string().required(t("Please Enter email")),
    }),
    onSubmit: async (values, { resetForm }) => {
      console.log(" profile submitr values:", values);
      const parsedRoleid = getRoleId(values);
      values.role = parsedRoleid;
      //make network call to update the user profile
      try {
        clearReload();
        profid = profid || getLoggedinUser().data.id;
        console.log("profid", profid);
        await axios.post(`${UPDATE_PROFILE_API}/${profid}`, values);
        succesStopReload();
      } catch (error) {
        errorStopReload(error);
        console.log("Error from Update user profile", error);
      }
    },
  });

  document.title = t("Profile");
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Row>
            <Col lg="12">
              {error && error ? <Alert color="danger">{error}</Alert> : null}
              {successMsg.error === true ? (
                <Alert color="danger">{successMsg.msg}</Alert>
              ) : null}
              {successMsg.success ? (
                <Alert color="success">{successMsg.msg}</Alert>
              ) : null}

              <Card>
                <CardBody>
                  <div className="d-flex">
                    {/* <div className="mx-3">
                      <img
                        src={avatar}
                        alt=""
                        className="avatar-md rounded-circle img-thumbnail"
                      />
                    </div> */}
                    <div className="flex-grow-1 align-self-center">
                      <div className="text-muted">
                        <h5>
                          {validation.values.firstName || userData.firstName}
                        </h5>
                        <p className="mb-1">
                          {t("Email Id")} :{" "}
                          {validation.values.email || userData.email}
                        </p>
                        <p className="mb-0">
                          {t("Id No")} : #{userData.idx}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>

          <h4 className="card-title mb-4">{t("Edit User Profile")}</h4>

          <Card>
            <CardBody>
              <Form
                className="form-horizontal"
                onSubmit={(e) => {
                  e.preventDefault();
                  validation.handleSubmit();
                  return false;
                }}
              >
                <div className="form-group">
                  <Label className="form-label">{t("First Name")}</Label>
                  <Input
                    name="firstName"
                    // value={name}
                    className="form-control"
                    placeholder={t("First Name")}
                    type="text"
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation.values.firstName || ""}
                    disabled={userData.currentRole === "user"}
                    invalid={
                      validation.touched.firstName &&
                      validation.errors.firstName
                        ? true
                        : false
                    }
                  />
                  {validation.touched.firstName &&
                  validation.errors.firstName ? (
                    <FormFeedback type="invalid">
                      {validation.errors.firstName}
                    </FormFeedback>
                  ) : null}
                  <Input name="idx" value={userData.idx} type="hidden" />
                </div>
                {/*last name */}
                <div className="form-group">
                  <Label className="form-label">{t("Last Name")}</Label>
                  <Input
                    name="lastName"
                    // value={name}
                    className="form-control"
                    placeholder={t("Last Name")}
                    type="text"
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation.values.lastName || ""}
                    invalid={
                      validation.touched.lastName && validation.errors.lastName
                        ? true
                        : false
                    }
                    disabled={userData.currentRole === "user"}
                  />
                  {validation.touched.lastName && validation.errors.lastName ? (
                    <FormFeedback type="invalid">
                      {validation.errors.lastName}
                    </FormFeedback>
                  ) : null}
                  <Input name="idx" value={userData.idx} type="hidden" />
                </div>

                {/*email*/}
                <div className="form-group">
                  <Label className="form-label">{t("Email")}</Label>
                  <Input
                    name="email"
                    // value={name}
                    className="form-control"
                    placeholder={t("Email")}
                    type="text"
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation.values.email || ""}
                    invalid={
                      validation.touched.email && validation.errors.email
                        ? true
                        : false
                    }
                    disabled={userData.currentRole === "user"}
                  />
                  {validation.touched.email && validation.errors.email ? (
                    <FormFeedback type="invalid">
                      {validation.errors.email}
                    </FormFeedback>
                  ) : null}
                  <Input name="idx" value={userData.idx} type="hidden" />
                </div>
                {/*role*/}
                <div
                  className="form-group d-flex"
                  style={{
                    alignItems: "flex-end",
                    alignContent: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Col lg="8">
                    <Label className="form-label">{t("Role")}</Label>
                    <Input
                      name="role"
                      // value={name}
                      className="form-control"
                      placeholder={t("Role")}
                      type="text"
                      onChange={() => {
                        validation.handleChange();
                        validation.dirty = true;
                        validation.touched.role = true;
                      }}
                      onBlur={validation.handleBlur}
                      value={
                        validation.values.role === 1
                          ? "admin"
                          : validation.values.role === 2
                          ? "manager"
                          : validation.values.role === 3
                          ? "user"
                          : validation.values.role
                      }
                      invalid={
                        validation.touched.role && validation.errors.role
                          ? true
                          : false
                      }
                      disabled={true}
                    />
                    {validation.touched.role && validation.errors.role ? (
                      <FormFeedback type="invalid">
                        {validation.errors.role}
                      </FormFeedback>
                    ) : null}
                    <Input name="idx" value={userData.idx} type="hidden" />
                  </Col>
                  <Col lg="4">
                    <Button
                      type="button"
                      color="info"
                      disabled={userData.currentRole === "user"}
                      onClick={() => {
                        //  changePassword();
                        setmodal_role(true);
                      }}
                      style={{
                        marginLeft: "3px",
                        visibility:
                          getUserRole() === userRole ? "hidden" : "visible",
                      }}
                    >
                      {t("Change Role")}
                    </Button>{" "}
                  </Col>
                </div>
                {/*groups group/?groupid=15&groupname=ewew */}

                {userGroup.length > 0 && (
                  <div
                    style={{ width: "50%", marginTop: "0.5rem" }}
                    className="form-group"
                  >
                    <Label className="form-label">{t("Groups")}</Label>
                    <Grid
                      data={userGroup}
                      columns={[
                        {
                          name: "ID",
                          formatter: (cell, row) =>
                            _(
                              <a
                                className="fw-semibold"
                                href="#"
                                rel="noreferrer"
                                onClick={(ev) => {
                                  ev.preventDefault();
                                  openGroupPage(
                                    row._cells[0].data,
                                    row._cells[1].data
                                  );
                                }}
                              >
                                {cell}
                              </a>
                            ),
                        },
                        {
                          name: t("Name"),
                          formatter: (cell, row) =>
                            _(
                              <a
                                className="fw-semibold"
                                href={`group/?groupid=${row._cells[0].data}&groupname=${row._cells[1].data}`}
                              >
                                {cell}
                              </a>
                            ),
                        },

                        // {
                        //   name: "Delete",
                        //   width: "120px",
                        //   formatter: (cell, row) =>
                        //     _(
                        //       <Button
                        //         color="danger"
                        //         onClick={() => {

                        //           deleteUserGroupId(row._cells[0].data);
                        //         }}
                        //       >
                        //         {" "}
                        //         Delete
                        //       </Button>
                        //     ),
                        // },
                      ]}
                    />{" "}
                  </div>
                )}

                {/*ALL CODE ABOVE THIS: update profile and change pwd button below*/}
                <div className="text-center mt-4 mx-2">
                  <Button
                    type="submit"
                    color="success"
                    disabled={
                      userData.currentRole === "user" ||
                      !validation.dirty ||
                      validation.isSubmitting
                    }
                  >
                    {t("Update Profile")}
                  </Button>

                  <Button
                    type="button"
                    color="info"
                    disabled={userData.currentRole === "user"}
                    onClick={() => {
                      setSuccess({
                        success: false,
                        error: false,
                      });
                      setmodal_grid(true);
                    }}
                    style={{ marginLeft: "3px" }}
                  >
                    {t("Change Password")}
                  </Button>
                </div>
              </Form>
            </CardBody>
          </Card>

          {/* modal to change password */}
          <Modal
            isOpen={modal_grid}
            toggle={() => {
              tog_grid();
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "15px",
              }}
            >
              <div>
                <h5 className="text-primary">{t("Reset Password")}</h5>
              </div>
              <div>
                <Button
                  type="button"
                  onClick={() => {
                    setmodal_grid(false);
                  }}
                  className="btn-close"
                  aria-label="Close"
                ></Button>
              </div>
            </div>
            <ModalBody>
              <Row className="justify-content-center">
                <div className="mt-2">
                  <div className="p-2">
                    {/* <h5 className="modal-title">Grid Modals</h5> */}
                    {successMsg.error ? (
                      <Alert color="danger">{successMsg.msg}</Alert>
                    ) : null}
                    {successMsg.success ? (
                      <Alert color="success">{successMsg.msg}</Alert>
                    ) : null}
                    <div className="text-center mt-2">
                      <p className="text-muted">
                        {t(
                          "Your new password must be different from previously used password"
                        )}
                      </p>
                    </div>

                    <div className="p-2">
                      <Form
                        className="form-horizontal"
                        onSubmit={(e) => {
                          e.preventDefault();
                          resetPwdValidation.handleSubmit();
                          return false;
                        }}
                      >
                        {/*password*/}
                        <div className="form-group">
                          <Label className="form-label">
                            {t("New Password")}
                          </Label>
                          <Input
                            name="password"
                            // value={name}
                            className="form-control"
                            placeholder={t("New Password")}
                            type="password"
                            onChange={resetPwdValidation.handleChange}
                            onBlur={resetPwdValidation.handleBlur}
                            value={resetPwdValidation.values.password || ""}
                            invalid={
                              resetPwdValidation.touched.password &&
                              resetPwdValidation.errors.password
                                ? true
                                : false
                            }
                            disabled={userData.currentRole === "user"}
                          />
                          {resetPwdValidation.touched.password &&
                          resetPwdValidation.errors.password ? (
                            <FormFeedback type="invalid">
                              {resetPwdValidation.errors.password}
                            </FormFeedback>
                          ) : null}
                        </div>

                        {/* confirm password */}
                        <div className="form-group">
                          <Label className="form-label">
                            {t("Confirm New Password")}
                          </Label>
                          <Input
                            name="changePassword"
                            // value={name}
                            className="form-control"
                            placeholder={t("Confirm New Password")}
                            type="text"
                            onChange={resetPwdValidation.handleChange}
                            onBlur={resetPwdValidation.handleBlur}
                            value={
                              resetPwdValidation.values.changePassword || ""
                            }
                            invalid={
                              resetPwdValidation.touched.changePassword &&
                              resetPwdValidation.errors.changePassword
                                ? true
                                : false
                            }
                            disabled={userData.currentRole === "user"}
                          />
                          {resetPwdValidation.touched.changePassword &&
                          resetPwdValidation.errors.changePassword ? (
                            <FormFeedback type="invalid">
                              {resetPwdValidation.errors.changePassword}
                            </FormFeedback>
                          ) : null}
                        </div>

                        <div className="mt-4">
                          <Button
                            color="success"
                            className="w-100"
                            type="submit"
                          >
                            {t("Reset Password")}
                          </Button>
                        </div>
                      </Form>
                    </div>
                  </div>
                </div>
              </Row>
            </ModalBody>
          </Modal>

          {/* modal to change role */}
          <Modal
            isOpen={modal_role}
            toggle={() => {
              tog_roleModal();
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
              <h5 className="card-title mb-3">
                {t("Choose a role to change")}
              </h5>
              <div>
                <Button
                  type="button"
                  onClick={() => {
                    setmodal_role(false);
                  }}
                  className="btn-close m-lg-auto"
                  aria-label="Close"
                ></Button>
              </div>
            </div>
            <ModalBody>
              <Row className="justify-content-center">
                <div className="mt-2">
                  <RoleOptions getRole={getRole} />
                </div>
              </Row>
            </ModalBody>
          </Modal>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default UserProfile;
