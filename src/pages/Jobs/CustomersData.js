import { customAxios } from "../../Axios/axiosConfig";
import { getReportingUrl } from "./latest jobs/JobData";

async function getCustomerJobResponse(dataSet) {
  let reportingUrl = getReportingUrl();
  let axiosInstReporting = customAxios(reportingUrl);

  const calculatePercent = (value, total) => {
    return `${((value / total) * 100).toFixed(2)}% (${value})`;
  };

  let customerObj = await Promise.all(
    dataSet.map(async (data) => {
      const perfData = await axiosInstReporting.get(
        `/jobs/customers/${data.id}/performance`
      );

      let {
        totalResults = 0,
        goodResults = 0,
        badResults = 0,
        unknownResults = 0,
        ejectedTotalResults = 0,
        ejectedGoodResults = 0,
        ejectedBadResults = 0,
        ejectedUnknownResults = 0,
      } = perfData.data;

      let finalres = {
        id: data.id,
        date: data.insertedAt,
        customer: data.name,
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

async function getGraphdata(data) {
  const sumData = data.reduce(
    (accumulator, data) => {
      // accumulator.totalSheets += data.totalSheets;
      accumulator.goodSheets += parseFloat(data.goodSheets.split("%")[0]);
      accumulator.badSheets += parseFloat(data.badSheets.split("%")[0]);
      // accumulator.ejectedSheets += data.ejectedSheets;
      return accumulator;
    },
    {
      // totalSheets: 0,
      goodSheets: 0,
      badSheets: 0,
      // ejectedSheets: 0,
    }
  );
  // Formatting the results to two decimal places
  sumData.goodSheets = sumData.goodSheets.toFixed(2);
  sumData.badSheets = sumData.badSheets.toFixed(2);
  return sumData;
}
export { getCustomerJobResponse, getGraphdata };
