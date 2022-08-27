import React, { useState } from "react";
const SelectPage = (props) => {
  const { options, hanldePageSelect, currPage } = props;

  return (
    <React.Fragment>
      <select
        className="form-select mb-3"
        aria-label="Select Page"
        onChange={(e) => {
          hanldePageSelect(e.target.value);
        }}
      >
        <option disabled>Results per page</option>
        {options.map((option) => {
          return (
            <option
              key={option}
              defaultValue={option === currPage ? true : false}
            >
              {option}
            </option>
          );
        })}
      </select>
    </React.Fragment>
  );
};

export default SelectPage;
