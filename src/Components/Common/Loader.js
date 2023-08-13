import React from "react";
import { Spinner } from "reactstrap";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Loader = (props) => {
  return (
    <React.Fragment>
      <div className="d-flex justify-content-center mx-2 my-lg-4">
        <Spinner color="primary" size="lg">
          {" "}
          Loading...{" "}
        </Spinner>
      </div>
      {toast.error(props.error, {
        position: "top-right",
        hideProgressBar: false,
        progress: undefined,
        toastId: "",
      })}
    </React.Fragment>
  );
};

export default Loader;
