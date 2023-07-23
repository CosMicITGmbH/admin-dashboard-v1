import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
} from "reactstrap";

//import images
import avatar1 from "../../assets/images/utils/icon-menu-png-24.png";

const ProfileDropdown = () => {
  const { user } = useSelector((state) => ({
    user: state.Profile.user,
  }));

  const [userName, setUserName] = useState("Admin");

  useEffect(() => {
    if (sessionStorage.getItem("authUser")) {
      const obj = JSON.parse(sessionStorage.getItem("authUser"));

      setUserName(user?.first_name || obj.data.firstName || "User");
    }
  }, [userName, user]);

  //Dropdown Toggle
  const [isProfileDropdown, setIsProfileDropdown] = useState(false);
  const toggleProfileDropdown = () => {
    setIsProfileDropdown(!isProfileDropdown);
  };
  return (
    <React.Fragment>
      <Dropdown
        isOpen={isProfileDropdown}
        toggle={toggleProfileDropdown}
        className="ms-sm-3 header-item topbar-user"
      >
        <DropdownToggle tag="button" type="button" className="btn shadow-none">
          <span className="d-flex align-items-center">
            <img
              className="rounded-circle header-profile-user"
              src={avatar1}
              alt="Header Avatar"
            />
            <span className="text-start ms-xl-2">
              <span className="d-none d-xl-inline-block ms-1 fw-medium user-name-text">
                {userName}
              </span>
              <span className="d-none d-xl-block ms-1 fs-12 text-muted user-name-sub-text">
                Founder
              </span>
            </span>
          </span>
        </DropdownToggle>
        <DropdownMenu className="dropdown-menu-end">
          <h6 className="dropdown-header">Welcome {userName}!</h6>
          <DropdownItem href="/profile">
            <i className="mdi mdi-account-circle text-muted fs-16 align-middle me-1"></i>
            <span className="align-middle">Profile</span>
          </DropdownItem>
          {/* <DropdownItem href="/all-users">
            <i className="mdi mdi-account-multiple-plus text-muted fs-16 align-middle me-1"></i>
            <span className="align-middle">All Users</span>
          </DropdownItem>
          <DropdownItem href="/all-services">
            <i className="mdi mdi-security-network text-muted fs-16 align-middle me-1"></i>
            <span className="align-middle">All Services</span>
          </DropdownItem>
          <DropdownItem href="/all-groups">
            <i className="mdi mdi-group text-muted fs-16 align-middle me-1"></i>
            <span className="align-middle">All Groups</span>
          </DropdownItem> */}

          <div className="dropdown-divider"></div>
          <DropdownItem href="/logout">
            <i className="mdi mdi-logout text-muted fs-16 align-middle me-1"></i>{" "}
            <span className="align-middle" data-key="t-logout">
              Logout
            </span>
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </React.Fragment>
  );
};

export default ProfileDropdown;
