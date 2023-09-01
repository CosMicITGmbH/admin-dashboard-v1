import React, { useEffect, useState } from "react";
import { Link, Redirect } from "react-router-dom";
import { Dropdown, DropdownMenu, DropdownToggle, Form } from "reactstrap";

//import images
import logoDark from "../assets/images/logo-dark.png";
import logoLight from "../assets/images/logo-light.png";
import logoSm from "../assets/images/logo-sm.png";

//import Components
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import FullScreenDropdown from "../Components/Common/FullScreenDropdown";
import LightDark from "../Components/Common/LightDark";
import NotificationDropdown from "../Components/Common/NotificationDropdown";
import ProfileDropdown from "../Components/Common/ProfileDropdown";
import MachineSearch from "../pages/Pages/Groups/MachineSearch";
import LanguageDropdown from "../Components/Common/LanguageDropdown";

import { useDispatch, useSelector } from "react-redux";
import { setMachine } from "./../store/actions";

const Header = ({ onChangeLayoutMode, layoutModeType, headerClass }) => {
  const [search, setSearch] = useState(false);
  const [newMachine, setNewMachine] = useState("");
  const [redirect, setRedirect] = useState(false);
  const history = useHistory();

  const machineName = useSelector((state) => state.Machine.machineName);
  console.log("machine name from state:", machineName);
  //whenever the page is refreshed/reloaded state will lose the machine value so retrive from session storage
  useEffect(() => {
    const getMachineName =
      JSON.parse(sessionStorage.getItem("selectedMachine"))?.name ||
      machineName.name;
    setNewMachine(getMachineName);
  }, []);

  const dispatch = useDispatch();

  const toogleSearch = () => {
    setSearch(!search);
  };

  const getSelectedMachine = (selectedMachine) => {
    setNewMachine(selectedMachine.label.toUpperCase());
    let newMachine = {
      name: selectedMachine.label,
      endPoint: selectedMachine.endpoint,
    };

    sessionStorage.setItem("selectedMachine", JSON.stringify(newMachine));

    dispatch(setMachine(newMachine));
    setRedirect(true);
    history.push("/jobs-customer");
  };

  const toogleMenuBtn = () => {
    var windowSize = document.documentElement.clientWidth;

    if (windowSize > 767)
      document.querySelector(".hamburger-icon").classList.toggle("open");

    //For collapse horizontal menu
    if (document.documentElement.getAttribute("data-layout") === "horizontal") {
      document.body.classList.contains("menu")
        ? document.body.classList.remove("menu")
        : document.body.classList.add("menu");
    }

    //For collapse vertical menu
    if (document.documentElement.getAttribute("data-layout") === "vertical") {
      if (windowSize < 1025 && windowSize > 767) {
        document.body.classList.remove("vertical-sidebar-enable");
        document.documentElement.getAttribute("data-sidebar-size") === "sm"
          ? document.documentElement.setAttribute("data-sidebar-size", "")
          : document.documentElement.setAttribute("data-sidebar-size", "sm");
      } else if (windowSize > 1025) {
        document.body.classList.remove("vertical-sidebar-enable");
        document.documentElement.getAttribute("data-sidebar-size") === "lg"
          ? document.documentElement.setAttribute("data-sidebar-size", "sm")
          : document.documentElement.setAttribute("data-sidebar-size", "lg");
      } else if (windowSize <= 767) {
        document.body.classList.add("vertical-sidebar-enable");
        document.documentElement.setAttribute("data-sidebar-size", "lg");
      }
    }

    //Two column menu
    if (document.documentElement.getAttribute("data-layout") === "twocolumn") {
      document.body.classList.contains("twocolumn-panel")
        ? document.body.classList.remove("twocolumn-panel")
        : document.body.classList.add("twocolumn-panel");
    }
  };

  return (
    <React.Fragment>
      {redirect ? (
        <>
          {" "}
          <Redirect to="/jobs-customer" />
          <header id="page-topbar" className={headerClass}>
            <div className="layout-width">
              <div className="navbar-header">
                <div className="d-flex" style={{ alignItems: "center" }}>
                  <div className="navbar-brand-box horizontal-logo">
                    <Link to="/" className="logo logo-dark">
                      <span className="logo-sm">
                        <img src={logoSm} alt="" height="22" />
                      </span>
                      <span className="logo-lg">
                        <img src={logoDark} alt="" height="17" />
                      </span>
                    </Link>

                    <Link to="/" className="logo logo-light">
                      <span className="logo-sm">
                        <img src={logoSm} alt="" height="22" />
                      </span>
                      <span className="logo-lg">
                        <img src={logoLight} alt="" height="17" />
                      </span>
                    </Link>
                  </div>

                  <button
                    onClick={toogleMenuBtn}
                    type="button"
                    className="btn btn-sm px-3 fs-16 header-item vertical-menu-btn topnav-hamburger shadow-none"
                    id="topnav-hamburger-icon"
                  >
                    <span className="hamburger-icon">
                      <span></span>
                      <span></span>
                      <span></span>
                    </span>
                  </button>

                  {/* Add machine search here with text  <SearchOption />  */}
                  <div
                    className="d-flex align-items-center"
                    style={{ gap: "1rem" }}
                  >
                    <MachineSearch selectedMachine={getSelectedMachine} />
                    <h4 className={newMachine ? "" : "d-none"}>{newMachine}</h4>
                  </div>
                </div>

                <div className="d-flex align-items-center">
                  <Dropdown
                    isOpen={search}
                    toggle={toogleSearch}
                    className="d-md-none topbar-head-dropdown header-item"
                  >
                    <DropdownToggle
                      type="button"
                      tag="button"
                      className="btn btn-icon btn-topbar btn-ghost-secondary rounded-circle"
                    >
                      <i className="bx bx-search fs-22"></i>
                    </DropdownToggle>
                    <DropdownMenu className="dropdown-menu-lg dropdown-menu-end p-0">
                      <Form className="p-3">
                        <div className="form-group m-0">
                          <div className="input-group">
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Search ..."
                              aria-label="Recipient's username"
                            />
                            <button className="btn btn-primary" type="submit">
                              <i className="mdi mdi-magnify"></i>
                            </button>
                          </div>
                        </div>
                      </Form>
                    </DropdownMenu>
                  </Dropdown>
                  {/* LanguageDropdown */}
                  <LanguageDropdown />
                  {/* FullScreenDropdown */}
                  <FullScreenDropdown />

                  {/* Dark/Light Mode set */}
                  <LightDark
                    layoutMode={layoutModeType}
                    onChangeLayoutMode={onChangeLayoutMode}
                  />

                  {/* NotificationDropdown */}
                  <NotificationDropdown />

                  {/* ProfileDropdown */}
                  <ProfileDropdown />
                </div>
              </div>
            </div>
          </header>
        </>
      ) : (
        <header id="page-topbar" className={headerClass}>
          <div className="layout-width">
            <div className="navbar-header">
              <div className="d-flex" style={{ alignItems: "center" }}>
                <div className="navbar-brand-box horizontal-logo">
                  <Link to="/" className="logo logo-dark">
                    <span className="logo-sm">
                      <img src={logoSm} alt="" height="22" />
                    </span>
                    <span className="logo-lg">
                      <img src={logoDark} alt="" height="17" />
                    </span>
                  </Link>

                  <Link to="/" className="logo logo-light">
                    <span className="logo-sm">
                      <img src={logoSm} alt="" height="22" />
                    </span>
                    <span className="logo-lg">
                      <img src={logoLight} alt="" height="17" />
                    </span>
                  </Link>
                </div>

                <button
                  onClick={toogleMenuBtn}
                  type="button"
                  className="btn btn-sm px-3 fs-16 header-item vertical-menu-btn topnav-hamburger shadow-none"
                  id="topnav-hamburger-icon"
                >
                  <span className="hamburger-icon">
                    <span></span>
                    <span></span>
                    <span></span>
                  </span>
                </button>

                {/* Add machine search here with text  <SearchOption />  */}
                <div
                  className="d-flex align-items-center"
                  style={{ gap: "2rem" }}
                >
                  <MachineSearch selectedMachine={getSelectedMachine} />
                  <h4>{newMachine}</h4>
                </div>
              </div>

              <div className="d-flex align-items-center">
                <Dropdown
                  isOpen={search}
                  toggle={toogleSearch}
                  className="d-md-none topbar-head-dropdown header-item"
                >
                  <DropdownToggle
                    type="button"
                    tag="button"
                    className="btn btn-icon btn-topbar btn-ghost-secondary rounded-circle"
                  >
                    <i className="bx bx-search fs-22"></i>
                  </DropdownToggle>
                  <DropdownMenu className="dropdown-menu-lg dropdown-menu-end p-0">
                    <Form className="p-3">
                      <div className="form-group m-0">
                        <div className="input-group">
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Search ..."
                            aria-label="Recipient's username"
                          />
                          <button className="btn btn-primary" type="submit">
                            <i className="mdi mdi-magnify"></i>
                          </button>
                        </div>
                      </div>
                    </Form>
                  </DropdownMenu>
                </Dropdown>
                {/* LanguageDropdown */}
                <LanguageDropdown />
                {/* FullScreenDropdown */}
                <FullScreenDropdown />

                {/* Dark/Light Mode set */}
                <LightDark
                  layoutMode={layoutModeType}
                  onChangeLayoutMode={onChangeLayoutMode}
                />

                {/* NotificationDropdown */}
                <NotificationDropdown />

                {/* ProfileDropdown */}
                <ProfileDropdown />
              </div>
            </div>
          </div>
        </header>
      )}
    </React.Fragment>
  );
};

export default Header;
