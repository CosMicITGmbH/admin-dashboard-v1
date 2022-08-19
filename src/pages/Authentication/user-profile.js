import React, { useState, useEffect } from "react";
import { isEmpty } from "lodash";
import axios from "axios";
import {
  Container,
  Row,
  Col,
  Card,
  Alert,
  CardBody,
  Button,
  Label,
  Input,
  FormFeedback,
  Form,
  Modal,
  ModalHeader,
  ModalBody,
} from "reactstrap";
import { Grid, _ } from "gridjs-react";
// Formik Validation
import * as Yup from "yup";
import { useFormik } from "formik";

//redux
import { useSelector, useDispatch } from "react-redux";
//for url query params
import { useLocation } from "react-router-dom";

import avatar from "../../assets/images/users/avatar-1.jpg";
// actions
import { editProfile, resetProfileFlag } from "../../store/actions";
import RoleOptions from "../Forms/Select2/RoleOptions";

const UserProfile = (props) => {
  const dispatch = useDispatch();
  //const [searchParams, setSearchParams] = useSearchParams();
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
    // console.log("value from progile", value);
    setUserData({ ...userData, role: value.label });
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
  const profid = new URLSearchParams(search).get("profileID");

  //console.log("profileid query param", profid);

  useEffect(() => {
    //let profid = searchParams.get("profileID");
    //  console.log("useffect query param", profid);

    if (profid) {
      // console.log("in if");
      axios
        .get(`/users/profile/${profid}`)
        .then((data) => {
          setUserData({
            ...userData,
            idx: data.id,
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            role: data.role,

            currentRole: JSON.parse(sessionStorage.getItem("authUser")).data
              .role,
            groups: data.groups,
          });
          setGroupArr(data.groups);
        })
        .catch((err) => {
          //console.log("error while fethcing the data", err);
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
    } else {
      // console.log("in else");
      if (sessionStorage.getItem("authUser")) {
        const obj = JSON.parse(sessionStorage.getItem("authUser"));
        //  console.log("obj", obj, "user obj", user);
        if (!isEmpty(user)) {
          obj.data.firstName = user.firstName;
          sessionStorage.removeItem("authUser");
          sessionStorage.setItem("authUser", JSON.stringify(obj));
        }

        setUserData({
          ...userData,
          idx: obj.data.id,
          firstName: obj.data.firstName,
          lastName: obj.data.lastName,
          email: obj.data.email,
          role: obj.data.role,

          groups: obj.data.groups,
        });

        //make group arr for data grid

        setGroupArr(obj.data.groups);

        setTimeout(() => {
          dispatch(resetProfileFlag());
        }, 3000);
      }
    }
  }, [dispatch, user, profid]);

  const setGroupArr = (groups) => {
    console.log("sett6ing groups");
    let newArr = [];
    let res1 = groups.map((item) => {
      let n1 = [];
      n1.push(item.groupId, item.name);
      newArr.push(n1);
      return newArr;
    });
    console.log("newArr groups", newArr);
    setUserGroup(newArr);
  };

  const deleteUserGroupId = (id) => {
    console.log("delete id", id, userData);
    let newGroup = userData.groups.filter((item) => item.groupId !== id);
    console.log("new group", newGroup);
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
        .required("New Password is required")
        .min(4, "Password should be minimum 4 characters long."),
      changePassword: Yup.string().when("password", {
        is: (val) => (val && val.length > 0 ? true : false),
        then: Yup.string().oneOf([Yup.ref("password")], "Passwords must match"),
      }),
    }),
    onSubmit: (values) => {
      let url = `/users/profile/${validation.initialValues.idx}/password`;
      // console.log(url, values.password);
      axios
        .post(url, {
          password: values.password,
        })
        .then((data) => {
          // console.log("reset response", data);
          //user data is returned in response
          //  console.log("pwd successfully changed");
          setSuccess({
            success: true,
            error: false,
            msg: "Password Changed successfully.",
          });

          setTimeout(() => {
            //  console.log("close modal");
            setmodal_grid(false);
          }, 3000);
        })
        .catch((err) => {
          //console.log("error while resetting pwd", err);
          setSuccess({
            success: false,
            error: true,
            msg: err,
          });
          if (err.split(" ").includes("401")) {
            props.history.push("/login");
          }
        });
    },
  });
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
      firstName: Yup.string().required("Please Enter Your First Name"),
      lastName: Yup.string().required("Please Enter Your Last Name"),
      email: Yup.string().required("Please Enter Your email"),
    }),
    onSubmit: (values) => {
      // console.log("values on submit", values);
      if (
        typeof values.role === "string" &&
        values.role.toLowerCase() === "admin"
      ) {
        values.role = 1;
      } else if (
        typeof values.role === "string" &&
        values.role.toLowerCase() === "manager"
      ) {
        values.role = 2;
      } else {
        //for normal user
        values.role = 3;
      }
      //  console.log("edited profile ", values);
      dispatch(editProfile(values));
    },
  });

  document.title = "Profile | Velzon - React Admin & Dashboard Template";
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
                <Alert color="success">
                  Profile Data Updated for {userData.firstName}
                </Alert>
              ) : null}

              <Card>
                <CardBody>
                  <div className="d-flex">
                    <div className="mx-3">
                      <img
                        src={avatar}
                        alt=""
                        className="avatar-md rounded-circle img-thumbnail"
                      />
                    </div>
                    <div className="flex-grow-1 align-self-center">
                      <div className="text-muted">
                        <h5>{userData.firstName || "Admin"}</h5>
                        <p className="mb-1">Email Id : {userData.email}</p>
                        <p className="mb-0">Id No : #{userData.idx}</p>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>

          <h4 className="card-title mb-4">Edit User Profile</h4>

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
                  <Label className="form-label">First Name</Label>
                  <Input
                    name="firstName"
                    // value={name}
                    className="form-control"
                    placeholder="Enter Fisrt Name"
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
                  <Label className="form-label">Last Name</Label>
                  <Input
                    name="lastName"
                    // value={name}
                    className="form-control"
                    placeholder="Enter Last Name"
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
                  <Label className="form-label">Email</Label>
                  <Input
                    name="email"
                    // value={name}
                    className="form-control"
                    placeholder="Enter User Name"
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
                    <Label className="form-label">Role</Label>
                    <Input
                      name="role"
                      // value={name}
                      className="form-control"
                      placeholder="Enter User Name"
                      type="text"
                      onChange={validation.handleChange}
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
                      style={{ marginLeft: "3px" }}
                    >
                      Change Role
                    </Button>{" "}
                  </Col>
                </div>
                {/*groups*/}

                {userGroup.length > 0 && (
                  <div
                    style={{ width: "50%", marginTop: "0.5rem" }}
                    className="form-group"
                  >
                    <Label className="form-label">Groups</Label>
                    <Grid
                      data={userGroup}
                      columns={[
                        {
                          name: "ID",
                          formatter: (cell) =>
                            _(<span className="fw-semibold">{cell}</span>),
                        },
                        "Name",

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
                    disabled={userData.currentRole === "user"}
                  >
                    Update Profile
                  </Button>

                  <Button
                    type="button"
                    color="info"
                    disabled={userData.currentRole === "user"}
                    onClick={() => {
                      //  changePassword();
                      setmodal_grid(true);
                    }}
                    style={{ marginLeft: "3px" }}
                  >
                    Change Password
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
            <ModalHeader style={{ marginLeft: "auto" }}>
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
            </ModalHeader>
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
                      <h5 className="text-primary">Reset Password</h5>
                      <p className="text-muted">
                        Your new password must be different from previous used
                        password.
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
                          <Label className="form-label">New Password</Label>
                          <Input
                            name="password"
                            // value={name}
                            className="form-control"
                            placeholder="Enter New Password"
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
                            Confirm New Password
                          </Label>
                          <Input
                            name="changePassword"
                            // value={name}
                            className="form-control"
                            placeholder="Confirm New Password"
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
                            Reset Password
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
          >
            <ModalHeader style={{ marginLeft: "auto" }}>
              {/* <h6>Close</h6> */}
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
            </ModalHeader>
            <ModalBody>
              <Row className="justify-content-center">
                <div className="mt-2">
                  <RoleOptions getRole={getRole} />
                  {/* <CardBody className="p-2">
                    <RoleOptions getRole={getRole} />
                  </CardBody> */}
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
