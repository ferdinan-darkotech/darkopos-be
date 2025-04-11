export const posTotal = (data) => {
  let H1 = ((parseFloat(data.sellingPrice) * parseFloat(data.qty))) * (1 - (data.disc1 / 100))
  let H2 = H1 * (1 - (data.disc2 / 100))
  let H3 = H2 * (1 - (data.disc3 / 100))
  let TOTAL = H3 - data.discount
  return TOTAL
}

export const getTotalDisc = (data = {
  price: 0,
  qty: 0,
  disc1: 0,
  disc2: 0,
  disc3: 0,
  disc4: 0,
  disc5: 0,
  discn: 0
}) => {
  const {
    price = 0,
    qty = 0,
    disc1 = 0,
    disc2 = 0,
    disc3 = 0,
    disc4 = 0,
    disc5 = 0,
    discn = 0
  } = data

  let discPrice = 0
  const costprice = price * qty

  if (disc1 !== 0) {
    discPrice += ((costprice - discPrice) * (disc1 / 100))
  }
  if (disc2 !== 0) {
    discPrice += ((costprice - discPrice) * (disc2 / 100))
  }
  if (disc3 !== 0) {
    discPrice += ((costprice - discPrice) * (disc3 / 100))
  }
  if (disc4 !== 0) {
    discPrice += ((costprice - discPrice) * (disc4 / 100))
  }
  if (disc5 !== 0) {
    discPrice += ((costprice - discPrice) * (disc5 / 100))
  }


  return Math.round(discPrice + parseFloat(discn))
}
