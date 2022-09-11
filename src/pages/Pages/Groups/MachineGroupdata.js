import React, { useEffect, useState } from "react";
import { Button, Label } from "reactstrap";
import AsyncSelect from "react-select/async";
import DataTable from "react-data-table-component";
import axios from "axios";
//import { without } from "lodash";
const MachineGroupdata = (props) => {
  const machineColumns = [
    {
      name: <span className="font-weight-bold fs-13">Key</span>,
      selector: (row) => row.key,
      sortable: true,
      wrap: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Name</span>,
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Action</span>,
      selector: (row) => row.key,
      sortable: true,
      cell: (row) => (
        <Button
          type="button"
          color="danger"
          onClick={() => {
            console.log("deletable  id", row.key);
          }}
        >
          Delete
        </Button>
      ),
    },
  ];
  const { machineList } = props;
  const [machineFilter, setmachineFilter] = useState({});

  // useEffect(() => {
  //   console.log({ props });
  // }, []);
  /**For Async select starts */
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
  /**For Async select ends */
  return (
    <>
      <div className="flexSearchBox">
        <div>
          <Label
            htmlFor="choices-single-no-search"
            className="form-label text-muted"
          >
            Search Machines
          </Label>
          <AsyncSelect
            loadOptions={loadOptions}
            onInputChange={onSearchChange}
            value={machineFilter.label}
            placeholder="Type to search machine and add..."
            onChange={(value) => {
              console.log(value);
              setmachineFilter({ value });
              //  addToGroup("machine", value);
            }}
          />
        </div>
      </div>
      <DataTable
        title="Machines"
        columns={machineColumns}
        data={machineList}
        pagination
        // paginationServer
        //  paginationTotalRows={totalRowsUser}
        //  paginationRowsPerPageOptions={[5, 10, 25, 50]}
        // onChangePage={handlePageChange}
        //onChangeRowsPerPage={handlePerRowsChange}
        // sortServer
        //  onSort={handleSort}
      />
    </>
  );
};

export default MachineGroupdata;
