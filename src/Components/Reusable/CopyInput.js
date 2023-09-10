import React from "react";
import { useTranslation } from "react-i18next";
import { Label } from "reactstrap";

const CopyInput = (props) => {
  const { t } = useTranslation();
  return (
    <>
      <Label className="form-label">{t(props.title)}</Label>
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
          }}
        >
          {t("Copy")}
        </button>
      </div>
    </>
  );
};

export default CopyInput;
