import React from "react";
import Moment from "react-moment";
import { useLocation, useNavigate } from "react-router-dom";
import { Container } from "reactstrap";
import { productOrderTag } from "../../helpers/appContants";
import DataTableCustom from "../Widgets/DataTableCustom";
import { useTranslation } from "react-i18next";

const ProductOrder = () => {
  const { t } = useTranslation();
  const columns = [
    {
      name: <span className="font-weight-bold fs-13">#{t("ID")}</span>,
      selector: (row) => row.id,
      sortable: true,
      database_name: "id",
    },
    {
      name: <span className="font-weight-bold fs-13">{t("Date")}</span>,
      selector: (row) => row.updatedAt,
      cell: (row) => (
        <span>{<Moment format="DD/MM/YYYY">{row.updatedAt}</Moment>}</span>
      ),
      sortable: true,
      database_name: "updatedAt",
    },
    {
      name: <span className="font-weight-bold fs-13">{t("Name")}</span>,
      selector: (row) => row.name,
      database_name: "name",
      sortable: true,
    },
  ];

  document.title = t("Product Order Details");

  const searchParam = useLocation().search;
  const productId = new URLSearchParams(searchParam).get("pid");
  const productName = new URLSearchParams(searchParam).get("pname");

  return (
    <div className="page-content">
      <Container fluid>
        <DataTableCustom
          columns={columns}
          url={`jobs/products/${productId}/orders`}
          expressions={["name"]}
          tag={productOrderTag}
          isreportingApi={true}
          title={productName}
          isPieChartVisible={true}
          value={productId}
        />
      </Container>
    </div>
  );
};

export default ProductOrder;
