/* eslint-disable no-prototype-builtins */
import React, { useState } from "react";
import { debounce } from "lodash";
import AsyncSelect from "react-select/async";
import { AxiosInstance } from "../../../Axios/axiosConfig";
import { useTranslation } from "react-i18next";

const MachineSearch = (props) => {
  const { t } = useTranslation();
  const [machineFilter, setmachineFilter] = useState({});

  const loadOptions = debounce(async (inputValue, callback) => {
    if (!inputValue) return;

    try {
      const response = await AxiosInstance.post(`/services`, {
        expression: `name.ToLower().contains("${inputValue.toLowerCase()}") && machine != null && identity.services.Any(x => x.Name == "api.reporting")`,
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
            endpoint: element.machine.connectedServices.find(
              (item) => item.name === "api.reporting"
            ).endpoint,
          });
        });
      }
      console.log("temp arr", tempArray);
      callback(tempArray);
    } catch (error) {
      console.log(error, "catch the hoop");
    }
  }, 300);

  const onSearchChange = debounce((selectedOption) => {
    console.log();
    if (selectedOption) {
      setmachineFilter({ selectedOption });
    } else {
      // setmachineFilter({ label: "" });
    }
  }, 300);

  return (
    <AsyncSelect
      styles={{
        minWidth: "250px",
      }}
      loadOptions={loadOptions}
      onInputChange={onSearchChange}
      value={machineFilter.label}
      isMulti={props.isMulti}
      isClearable={props.isClearable}
      isSearchable={props.isSearchable}
      placeholder={t("Search Machine...")}
      onChange={(value, action) => {
        console.log("machine", value);
        setmachineFilter({ value });
        props.selectedMachine(value, action);
        //  addToGroup("machine", value);
      }}
    />
  );
};

export default MachineSearch;
