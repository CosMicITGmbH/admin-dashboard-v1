import React, { useState } from "react";
import axios from "axios";
import AsyncSelect from "react-select/async";
const MachineSearch = (props) => {
  const [machineFilter, setmachineFilter] = useState({});

  const loadOptions = (inputValue, callback) => {
    if (!inputValue) return;
    setTimeout(() => {
      axios
        .post(`/services`, {
          expression: `name.contains("${inputValue}")`,
          sort: "key asc",
        })
        .then((data) => {
          const tempArray = [];
          console.log("data", data);
          if (data) {
            if (data.items.length) {
              let machineArr = data.items.filter((item) => {
                // eslint-disable-next-line no-prototype-builtins
                return item.hasOwnProperty("machine");
                //return item
              });

              console.log("in if");
              machineArr.forEach((element) => {
                tempArray.push({
                  label: `${element.name}`,
                  value: `${element.key}`,
                  id: `${element.machine.id}`,
                });
              });
            }
          }
          console.log("tempArray", tempArray);
          callback(tempArray);
        })
        .catch((error) => {
          console.log(error, "catch the hoop");
        });
    }, 500);
  };
  const onSearchChange = (selectedOption) => {
    console.log("on srch change", selectedOption);

    if (selectedOption) {
      setmachineFilter({ selectedOption });
    } else {
      setmachineFilter({ label: "" });
    }
  };
  return (
    <AsyncSelect
      loadOptions={loadOptions}
      onInputChange={onSearchChange}
      value={machineFilter.label}
      placeholder="Search Machine..."
      onChange={(value) => {
        console.log(value);
        setmachineFilter({ value });
        props.selectedMachine(value);
        //  addToGroup("machine", value);
      }}
    />
  );
};

export default MachineSearch;
