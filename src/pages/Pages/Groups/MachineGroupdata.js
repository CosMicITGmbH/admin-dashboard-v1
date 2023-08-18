import { Button } from "reactstrap";

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

export { machineColumns };
