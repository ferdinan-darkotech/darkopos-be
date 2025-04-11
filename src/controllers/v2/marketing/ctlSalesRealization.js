import { ApiError } from "../../../services/v1/errorHandlingService";
import { srvSalesRealizations } from "../../../services/v2/marketing/srvSalesRealization";
import { getStoreQuery } from "../../../services/setting/storeService";
import { extractTokenProfile } from "../../../services/v1/securityService";

exports.ctlGetSalesRealizations = async function (
  req,
  res,
  next,
  filter = false,
  comment = "getSalesRealizations"
) {
  console.log("Requesting-ctlGetSalesRealizations : " + req.url + " ...");
  const userLogIn = extractTokenProfile(req);
  let { pageSize, page, ...other } = req.query;
  let pagination = {
    pageSize: parseInt(pageSize || 10),
    page: parseInt(page || 1),
  };
  if (other && other.hasOwnProperty("m")) {
    const mode = other.m.split(",");
    if (["ar", "lov"].some((_) => mode.includes(_))) pagination = {};
  }

  let fetchAccessStore = false;
  const multipleStore = (req.query.store || "").split(",");
  let _STORE = null;
  let extInfo = {};

  if (multipleStore.indexOf("-1") !== -1) {
    extInfo = {
      storeinfo: {
        agestore: "",
        storename: "All Access Store",
      },
    };
    fetchAccessStore = true;
    _STORE = JSON.parse(
      JSON.stringify(
        await getStoreQuery({ user: userLogIn.userid }, "userstorereport")
      )
    )[0].storeid;
  } else if (multipleStore.length > 1) {
    extInfo = {
      storeinfo: {
        agestore: "",
        storename: "Pick some store",
      },
    };
    fetchAccessStore = true;
    const listStores = JSON.parse(
      JSON.stringify(
        await getStoreQuery({ user: userLogIn.userid }, "userstorereport")
      )
    )[0].storeid;

    const pickStores = multipleStore.filter(
      (a) => (listStores || "").split(",").indexOf(a) !== -1
    );

    if (pickStores.length !== multipleStore.length) {
      return next(
        new ApiError(
          401,
          "Failed to load data, you don't have an access in some of stores."
        )
      );
    }

    _STORE = pickStores.join(",");
  } else {
    extInfo = {
      storeinfo: JSON.parse(
        JSON.stringify(
          await getStoreQuery({ store: multipleStore[0] }, "storeage")
        )
      )[0],
    };
  }

  req.query.store = fetchAccessStore ? _STORE : req.query.store;
  return srvSalesRealizations(req.query, filter)
    .then((data) => {
      const realizationProduct = JSON.parse(JSON.stringify(data[0]))[0];
      const realizationOther = JSON.parse(JSON.stringify(data[1]))[0];
      res.xstatus(200).json({
        success: true,
        realizationProduct,
        realizationOther,
        ...extInfo,
      });
    })
    .catch((err) =>
      next(
        new ApiError(
          422,
          `ZCMR-00001: Couldn't find realization for ${req.query.store} - ${req.query.category} - ${req.query.brand} .`,
          err
        )
      )
    );
};
