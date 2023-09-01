import { customAxios } from "../../../Axios/axiosConfig";

async function getJobItemResponse(dataSet) {
  let reportingUrl = getReportingUrl();
  let axiosInstReporting = customAxios(reportingUrl);

  const calculatePercent = (value, total) => {
    return `${((value / total) * 100).toFixed(2)}% (${value})`;
  };

  let customerObj = await Promise.all(
    dataSet.map(async (data) => {
      const perfData = await axiosInstReporting.get(
        `/jobs/orders/${data.id}/performance`
      );
      let { customer, product } = data;
      let {
        totalResults = 0,
        goodResults = 0,
        badResults = 0,
        unknownResults = 0,
        ejectedTotalResults = 0,
        ejectedGoodResults = 0,
        ejectedBadResults = 0,
        ejectedUnknownResults = 0,
      } = perfData;

      let finalres = {
        id: data.id,
        date: data.insertedAt,
        customer: `${customer.name} #${customer.id}`,
        product: `${product.name} #${product.id}`,
        order: `${data.name} #${data.id}`,
        totalSheets: totalResults,
        goodSheets:
          totalResults === 0
            ? "0.00% (0)"
            : calculatePercent(goodResults, totalResults),
        badSheets:
          totalResults === 0
            ? "0.00% (0)"
            : calculatePercent(badResults, totalResults),
        ejectedSheets: ejectedTotalResults,
      };
      return finalres;
    })
  );
  return customerObj;
}

const getReportingUrl = () => {
  let baseUrlReporting = "";
  try {
    baseUrlReporting = JSON.parse(
      sessionStorage.getItem("selectedMachine")
    )?.endPoint;
    return baseUrlReporting;
  } catch (error) {
    console.log("Error fetching report Url:", error);
  }
};

export { getReportingUrl, getJobItemResponse };
