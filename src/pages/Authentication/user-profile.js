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
    groups: "",
  });

  const [modal_grid, setmodal_grid] = useState(false);

  function getRole(value) {
    // console.log("value from progile", value);
    setUserData({ ...userData, role: value.label });
  }
  function tog_grid() {
    setmodal_grid(!modal_grid);
  }
  const [modal_role, setmodal_role] = useState(false);

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
            idx: data.id,
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            role: data.role,
            // password: data.password,
            currentRole: JSON.parse(sessionStorage.getItem("authUser")).data
              .role,
            groups: data.groups.join(","),
          });
        })
        .catch((err) => {
          //console.log("error while fethcing the data", err);
          setSuccess({
            ...successMsg,
            error: true,
            msg: "No Results found.",
          });
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
          idx: obj.data.id,
          firstName: obj.data.firstName,
          lastName: obj.data.lastName,
          email: obj.data.email,
          role: obj.data.role,
          // password: obj.data.password,
          groups: obj.data.groups.join(","),
        });

        setTimeout(() => {
          dispatch(resetProfileFlag());
        }, 3000);
      }
    }
  }, [dispatch, user]);

  // const changePassword = () => {
  //   console.log("change password requested");
  //   props.history.push("/auth-pass-change-basic");
  // };
  const resetPwdValidation = useFormik({
    enableReinitialize: true,
    initialValues: {
      password: "",
      changePassword: "",
    },
    validationSchema: Yup.object({
      password: Yup.string().required("New Password is required"),
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
              {success ? (
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

          <h4 className="card-title mb-4">Change User Profile</h4>

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

                <div className="text-center mt-4 mx-2">
                  <Button
                    type="submit"
                    color="danger"
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
            <ModalHeader>
              <Button
                type="button"
                onClick={() => {
                  setmodal_grid(false);
                }}
                className="btn-close m-lg-auto"
                aria-label="Close"
              ></Button>
            </ModalHeader>
            <ModalBody>
              <Row className="justify-content-center">
                <Card className="mt-2">
                  <CardBody className="p-2">
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
                        {/* password should contain note */}
                        <div
                          // id="password-contain"
                          className="p-3 bg-light mb-2 rounded mt-3"
                        >
                          <h5 className="fs-13">Password must contain:</h5>
                          <p id="pass-length" className="invalid fs-12 mb-2">
                            Minimum <b>8 characters</b>
                          </p>
                          <p id="pass-lower" className="invalid fs-12 mb-2">
                            At <b>lowercase</b> letter (a-z)
                          </p>
                          <p id="pass-upper" className="invalid fs-12 mb-2">
                            At least <b>uppercase</b> letter (A-Z)
                          </p>
                          <p id="pass-number" className="invalid fs-12 mb-0">
                            A least <b>number</b> (0-9)
                          </p>
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
                  </CardBody>
                </Card>
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
            <ModalHeader>
              {/* <h6>Close</h6> */}
              <Button
                type="button"
                onClick={() => {
                  setmodal_role(false);
                }}
                className="btn-close m-lg-auto"
                aria-label="Close"
              ></Button>
            </ModalHeader>
            <ModalBody>
              <Row className="justify-content-center">
                <Card className="mt-2">
                  <CardBody className="p-2">
                    <RoleOptions getRole={getRole} />
                  </CardBody>
                </Card>
              </Row>
            </ModalBody>
          </Modal>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default UserProfile;
