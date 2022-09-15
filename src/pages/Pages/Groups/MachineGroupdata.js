import React, { useEffect, useState } from "react";
import { Button, Label } from "reactstrap";
import DataTable from "react-data-table-component";
import axios from "axios";
import MachineSearch from "./MachineSearch";
import MsgToast from "../../../Components/Common/MsgToast";

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
  //  const { machineData } = props;
  //console.log("machineData", machineData);
  const [machineItem, setMachieItems] = useState([]);
  const [totalRowsMachine, setTotalRowsMachine] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showMsg, setShowMsg] = useState({
    show: false,
    msg: "",
    color: "",
  });
  useEffect(
    () => {
      //check for role:if user then show error msg
      let role = JSON.parse(sessionStorage.getItem("authUser")).data.role;
      if (role.toLowerCase() === "user") {
        return props.history.push("/dashboard");
      }
      fetchData();
    },
    []
    // [groupId, page, perPage, sort, expression]
  );
  const addMachineToGroup = (val) => {
    console.log("from 41", val);
    axios
      .put(`/groups/${props.groupId}/machines/${val.id}`, {})
      .then((res) => {
        console.log(res);
        if (res.status === 200) {
          fetchData();
          setShowMsg({
            show: true,
            msg: "Machine added successfully !",
            color: "success",
          });
          setTimeout(() => {
            setShowMsg({
              show: false,
              msg: "",
              color: "",
            });
          }, 5000);
        }
      })
      .catch((err) => {
        console.log(err);
        setShowMsg({
          show: true,
          msg: "Machine already added !",
          color: "danger",
        });
        setTimeout(() => {
          setShowMsg({
            show: false,
            msg: "",
            color: "",
          });
        }, 5000);
      });
  };

  const fetchData = async () => {
    setLoading(true);
    axios
      .get(`/groups/${props.groupId}`)
      .then((data) => {
        setLoading(false);

        if (data?.machines) {
          let machineData = data?.machines.map((machine) => {
            return {
              id: machine.key,
              name: machine.name,
            };
          });
          setMachieItems(data.machines);
        } else {
          setMachieItems([]);
        }

        setTotalRowsMachine(data.machines.length);
      })
      .catch((err) => {
        setLoading(false);
        // setSuccess({
        //   error: true,
        //   success: false,
        //   msg: `Error: ${err} Please try again later! `,
        // });
      });
  };
  return (
    <>
      {showMsg.show && <MsgToast color={showMsg.color} msg={showMsg.msg} />}
      <div className="flexSearchBox">
        <div>
          <Label
            htmlFor="choices-single-no-search"
            className="form-label text-muted"
          >
            Search Machines
          </Label>
          <MachineSearch selectedMachine={addMachineToGroup} />
        </div>
      </div>
      <DataTable
        title="Machines"
        columns={machineColumns}
        data={machineItem}
        pagination
        paginationTotalRows={totalRowsMachine}
      />
    </>
  );
};

export default MachineGroupdata;
