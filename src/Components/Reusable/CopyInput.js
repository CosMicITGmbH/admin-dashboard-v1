import React from "react";
import { Input, Label } from "reactstrap";

const CopyInput = (props) => {
  return (
    <>
      <Label className="form-label">{props.title}</Label>
      <div className="input-group mb-1">
        <input
          type="text"
          className="form-control"
          aria-label={props.title}
          aria-describedby={props.title}
          value={props.value}
          disabled
        />
        <button
          className="btn btn-outline-success"
          type="button"
          id={props.title}
          onClick={() => {
            navigator.clipboard.writeText(JSON.stringify(props.value));
            //   setService({
            //     ...service,
            //     success: true,
            //     msg: "Copied",
            //   });
          }}
        >
          Copy
        </button>
      </div>
    </>
  );
};

export default CopyInput;
