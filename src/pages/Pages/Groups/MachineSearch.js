/* eslint-disable no-prototype-builtins */
import React, { useState } from "react";
import axios from "axios";
import AsyncSelect from "react-select/async";
import { debounce } from "lodash";
const MachineSearch = (props) => {
  const [machineFilter, setmachineFilter] = useState({});

  const loadOptions = debounce(async (inputValue, callback) => {
    if (!inputValue) return;

    try {
      const response = await axios.post(`/services`, {
        expression: `name.ToLower().contains("${inputValue}") && machine != null && identity.services.Any(x => x.Name == "api.reporting")`,
        sort: "key asc",
      });
      //console.log(": response", response);
      const tempArray = [];
      if (response.items.length) {
        const machineArr = response.items.filter((item) =>
          item.hasOwnProperty("machine")
        );

        machineArr.forEach((element) => {
          tempArray.push({
            label: element.name,
            value: element.key,
            id: element.machine.id,
            endpoint: element.machine.connectedServices[0].endpoint,
          });
        });
      }

      callback(tempArray);
    } catch (error) {
      console.log(error, "catch the hoop");
    }
  }, 300); // Adjust the debounce delay as needed

  const onSearchChange = debounce((selectedOption) => {
    if (selectedOption) {
      setmachineFilter({ selectedOption });
    } else {
      setmachineFilter({ label: "" });
    }
  }, 300);
  return (
    <AsyncSelect
      loadOptions={loadOptions}
      onInputChange={onSearchChange}
      value={machineFilter.label}
      placeholder="Search Machine..."
      onChange={(value) => {
        // console.log(value);
        setmachineFilter({ value });
        props.selectedMachine(value);
        //  addToGroup("machine", value);
      }}
    />
  );
};

export default MachineSearch;
