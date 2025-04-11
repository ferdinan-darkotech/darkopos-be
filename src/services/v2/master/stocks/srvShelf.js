import sequelize from 'sequelize'
import NSequelize from '../../../../native/sequelize'
import db from '../../../../models/tableR'
import dbv from '../../../../models/viewR'
import { getNativeQuery } from '../../../../native/nativeUtils'
import { setDefaultQuery } from '../../../../utils/setQuery'
import moment from 'moment'

// [NEW]: FERDINAN - 2025-03-07
import dbview from '../../../../models/view'

const OP = sequelize.Op

const tbShelf = db.tbl_shelf
const tbShelfItem = db.tbl_shelf_items
const vwShelf = dbv.vw_shelf
const vwShelfItem = dbv.vw_shelf_items

// [NEW]: FERDINAN - 2025-03-07
const vwStock = dbview.vw_stock

const attrShelf = {
  $mf: [
    'shelf_id', 'store_id', 'store_code', 'store_name', 'row_numbers', 'shelf_numbers', 'status',
    'created_by', 'created_at', 'updated_by', 'updated_at'
  ],
  bf: [
    'shelf_id', 'store_code', 'store_name', 'row_numbers', 'shelf_numbers', 'status',
    'created_by', 'created_at', 'updated_by', 'updated_at'
  ],
  lov: [
    ['shelf_id', 'key'],
    [sequelize.literal("concat(shelf_numbers, ' (', row_numbers,')')"), 'label']
  ]
}

const attrShelfItems = {
  $mf: [
    'reg_id', 'store_id', 'store_code', 'store_name', 'product_id', 'product_code', 'product_name',
    'shelf_id', 'shelf_numbers', 'row_numbers', 'created_by', 'created_at'
  ],
  bf: [
    'reg_id', 'store_code', 'store_name', 'product_code', 'product_name', 'shelf_numbers', 'row_numbers',
    'created_by', 'created_at'
  ],
  mnf: [
    'store_code', 'product_code', 'shelf_numbers', 'row_numbers'
  ]
}

export function srvGetShelfOfProducts (store, products = []) {
  return vwShelfItem.findAll({
    attributes: ['store_code', 'product_code', ['shelf_numbers', 'shelf'], ['row_numbers', 'row']],
    where: {
      store_id: store,
      product_code: { [OP.in]: products }
    }
  })
}


export function srvGetSomeShelfItems (stores, query, root = false) {
  const { mode, ...others } = query
  const newMode = !root ? (mode || '').replace(/[^a-z]+/g, '') : mode

  const tmpAttr = (attrShelfItems[newMode] || attrShelfItems.bf)
  let queryDefault = setDefaultQuery(attrShelfItems.bf, { ...others }, true)
  
  queryDefault.where = {
    ...queryDefault.where,
    store_code: { $in: stores }
  }

  return vwShelfItem.findAndCountAll({
    attributes: tmpAttr,
    ...queryDefault,
    order: ['created_at'],
    raw: true
  })
}

export function srvGetSomeShelfs (stores = [], query, root = false) {
  const { mode, ...others } = query
  const newMode = !root ? (mode || '').replace(/[^a-z]+/g, '') : mode

  const tmpAttr = (attrShelf[newMode] || attrShelf.bf)
  let queryDefault = setDefaultQuery(tmpAttr, { ...others }, true)
  
  queryDefault.where = {
    ...queryDefault.where,
    store_code: { $in: stores }
  }

  return vwShelf.findAndCountAll({
    attributes: tmpAttr,
    ...queryDefault,
    order: ['updated_at', 'created_at'],
    raw: true
  })
}


export function srvGetAllShelfItems01 (store, products = []) {
  return vwShelfItem.findAll({
    attributes: attrShelfItems.mnf,
    where: {
       product_code: { $or: products },
      store_code: store
    },
    raw: true
  })
}

export function srvGetOneShelfByID (ids, attrs = []) {
  return tbShelf.findOne({
    attributes: attrs.length > 0 ? attrs : attrShelfItems.mnf,
    where: {
      shelf_id: ids
    },
    raw: true
  })
}

export function srvCreateShelf (data = {}) {
  return tbShelf.create({
    store_code: data.store_code,
    row_numbers: data.row_numbers,
    shelf_numbers: data.shelf_numbers,
    status: data.status,
    created_by: data.users,
    created_at: moment()
  })
}

export function srvUpdateShelf (ids, data = {}) {
  return tbShelf.update({
    store_code: data.store_code,
    row_numbers: data.row_numbers,
    shelf_numbers: data.shelf_numbers,
    status: data.status,
    updated_by: data.users,
    updated_at: moment()
  }, { where: { shelf_id: ids } })
}


export async function srvImportShelfItems (storeAccess = [], data = [], users = null) {
  try {
    // [NEW]: FERDINAN - 2025-03-03
    if(!Array.isArray(data) && !(data.length > 0)) throw new Error('Data to updated cannot be empty.')
      const timeNow = moment()
      let erResults = null
  
      // Cek data duplikat dalam input
      const duplicateMap = new Map();
      data.forEach((item, index) => {
        const key = `${item.store.trim()}::${item.shelf_numbers.trim()}::${item.product.trim()}`;
        if (duplicateMap.has(key)) {
          duplicateMap.get(key).push(index + 1);
        } else {
          duplicateMap.set(key, [index + 1]);
        }
      });
      
      // Cari baris yang duplikat
      const duplicates = [];
      duplicateMap.forEach((indexes, key) => {
        if (indexes.length > 1) {
          duplicates.push(`Data duplikat pada baris ${indexes.join(' dan ')}`);
        }
      });
      
      if (duplicates.length > 0) {
        throw new Error(duplicates.join('; '));
      }
  
      // START: Mapping the "shelf_id" to the data record.
      const mappingFilters01 = data.map((a) => ({
        store_code: a.store.trim(),
        shelf_numbers: a.shelf_numbers.trim(),
        // row_numbers: a.row_numbers === ' ' ? '' : a.row_numbers
        row_numbers: a.row_numbers.trim()
      }))
  
      const existShelfs = await tbShelf.findAll({
        attributes: ['shelf_id', 'store_code', 'shelf_numbers', 'row_numbers'],
        where: {
          $or: mappingFilters01,
          store_code: { $in: storeAccess },
          status: { $eq: true }
        },
        raw: true
      })
  
      const mappingShelfs = existShelfs.reduce((a, b) => ({ ...a, [`${b.store_code.trim()}::${b.shelf_numbers.trim()}::${b.row_numbers.trim()}`]: b }), {})
  
      const productCodes = data.map(a => a.product);
  
      const existProducts = await vwStock.findAll({
        attributes: ['productCode'],
        where: { productCode: { $in: productCodes } }, // Batasi pencarian ke produk yang ada di `data`
        raw: true
      });
  
      // // Simpan produk yang valid ke dalam `Set` untuk pencarian cepat
      const validProducts = new Set(existProducts.map(p => p.productcode));
  
      let newData = []
      
      for(let x = 0; x < data.length; x += 1) {
        const b = data[x]
        const keys = `${b.store.trim()}::${b.shelf_numbers.trim()}::${b.row_numbers.trim()}`
  
        if (!validProducts.has(b.product.trim())) {
          erResults = `Kesalahan pada baris ${x + 1}: product '${b.product}' tidak ditemukan di tabel stock.`
        }
  
        if (!storeAccess.includes(b.store.trim())) {
          erResults = `Kesalahan pada baris ${x + 1}: store '${b.store}' tidak valid atau tidak memiliki akses.`;
          break;
        }
        
        const storeShelfMatch = existShelfs.filter(s => s.store_code.trim() === b.store.trim());
        if (storeShelfMatch.length === 0) {
          erResults = `Kesalahan pada baris ${x + 1}: Tidak ditemukan shelf untuk store '${b.store}', periksa kembali kode toko.`;
          break;
        }
        
        const shelfMatch = storeShelfMatch.filter(s => s.shelf_numbers.trim() === b.shelf_numbers.trim());
        if (shelfMatch.length === 0) {
          erResults = `Kesalahan pada baris ${x + 1}: shelf '${b.shelf_numbers}' tidak ditemukan di store '${b.store}', periksa kembali nomor rak.`;
          break;
        }
        
        const rowMatch = shelfMatch.filter(s => s.row_numbers.trim() === b.row_numbers.trim())
        if (rowMatch.length === 0) {
          erResults = `Kesalahan pada baris ${x + 1}: row '${b.row_numbers}' tidak ditemukan di shelf '${b.shelf_numbers}' dalam store '${b.store}', periksa kembali nomor baris.`;
          break;
        }
  
        // let shelfId = ''
        // if (!mappingShelfs[keys]) {
        //   const result = keys.split(''); // Pisahkan menjadi array
        //   result.pop(); // Hapus elemen terakhir
        //   const finalKeys = result.join('');
  
        //   shelfId = mappingShelfs[finalKeys].shelf_id
        // } else {
        //   shelfId = mappingShelfs[keys].shelf_id
        // }
  
        newData.push({
          store_code: b.store.trim(),
          shelf_id: mappingShelfs[keys].shelf_id,
          product_code: b.product.trim(),
          shelf_numbers: b.shelf_numbers.trim(),
          created_by: users,
          created_at: timeNow,
          row_numbers: b.row_numbers.trim()
        })
      }
      // END: Mapping the "shelf_id" to the data record.
  
      if(typeof erResults === 'string') 
        throw new Error(erResults)
  
      // START: Mapping the existing data record.
      const mappingFilters02 = newData.map(a => ({
        product_code: a.product_code,
        store_code: a.store_code,
      }))
  
      const mappingFilters03 = newData.map(a => ({
        product_code: a.product_code,
        store_code: a.store_code,
        row_numbers: a.row_numbers === " " ? '' : a.row_numbers,
        shelf_numbers: a.shelf_numbers
      }))
  
      const existShelfItems = await tbShelfItem.findAll({
        attributes: ['reg_id', 'shelf_id', 'product_code', 'store_code'],
        where: { $or: mappingFilters02 },
        raw: true
      })
  
      if (existShelfItems.length > 0) {
        let mergerExistShelfItems = []
        for (const item of existShelfItems) {
          const data = mappingFilters03.find((map) => map.product_code === item.product_code && map.store_code === item.store_code)
          mergerExistShelfItems.push({ ...data, ...item })
        }
  
        for (const item of mergerExistShelfItems) {
          const shelf = existShelfs.find((map) => map.store_code === item.store_code && map.shelf_numbers === item.shelf_numbers && map.row_numbers === item.row_numbers)
  
          // UPDATE
          await tbShelfItem.update({ shelf_id: shelf.shelf_id }, { where: { reg_id: item.reg_id } })
        }
      }
  
      // const mappingShelfItems = existShelfItems.map(b => `${b.shelf_id}::${b.product_code}::${b.store_code}`)
      const mappingShelfItems = existShelfItems.map(b => `${b.product_code}::${b.store_code}`)
  
      // const finalData = newData.filter(a => mappingShelfItems.indexOf(`${a.shelf_id}::${a.product_code}::${a.store_code}`) === - 1)
      const finalData = newData.filter(a => mappingShelfItems.indexOf(`${a.product_code}::${a.store_code}`) === - 1)
      // END: Mapping the existing data record.
  
      // if(finalData.length === 0) throw new Error('No data to updated.')
      // await tbShelfItem.bulkCreate(finalData)
  
      if(finalData.length !== 0) {
        await tbShelfItem.bulkCreate(finalData)
      }
  
      return { success: true, message: 'Data has been saved.' }

    // [NEW]: FERDINAN - 2025-03-03
    // if(!Array.isArray(data) && !(data.length > 0)) throw new Error('Data to updated cannot be empty.')
    // const timeNow = moment()

    // // START: Mapping the "shelf_id" to the data record.
    // const mappingFilters01 = data.map((a) => ({
    //   store_code: a.store,
    //   shelf_numbers: a.shelf_numbers,
    //   row_numbers: a.row_numbers
    // }))
    // const existShelfs = await tbShelf.findAll({
    //   attributes: ['shelf_id', 'store_code', 'shelf_numbers', 'row_numbers'],
    //   where: {
    //     $or: mappingFilters01,
    //     store_code: { $in: storeAccess },
    //     status: { $eq: true }
    //   },
    //   raw: true
    // })

    // const mappingShelfs = existShelfs.reduce((a, b) => ({ ...a, [`${b.store_code}::${b.shelf_numbers}::${b.row_numbers}`]: b }), {})
    // let newData = []
    // let erResults = null
    
    // for(let x = 0; x < data.length; x += 1) {
    //   const b = data[x]
    //   const keys = `${b.store}::${b.shelf_numbers}::${b.row_numbers}`
      
    //   if(!mappingShelfs[keys]) {
    //     erResults = `Data on rows ${x + 1} is unrecognized, please make sure the store code, shelf & row numbers is correct.`
    //     break
    //   }

    //   newData.push({
    //     store_code: b.store,
    //     shelf_id: mappingShelfs[keys].shelf_id,
    //     product_code: b.product,
    //     created_by: users,
    //     created_at: timeNow
    //   })
    // }
    // // END: Mapping the "shelf_id" to the data record.

    // if(typeof erResults === 'string') 
    //   throw new Error(erResults)

    // // START: Mapping the existing data record.
    // const mappingFilters02 = newData.map(a => ({
    //   shelf_id: a.shelf_id,
    //   product_code: a.product_code
    // }))

    // const existShelfItems = await tbShelfItem.findAll({
    //   attributes: ['reg_id', 'shelf_id', 'product_code'],
    //   where: { $or: mappingFilters02 },
    //   raw: true
    // })

    // const mappingShelfItems = existShelfItems.map(b => `${b.shelf_id}::${b.product_code}`)
    // const finalData = newData.filter(a => mappingShelfItems.indexOf(`${a.shelf_id}::${a.product_code}`) === -1)

    // // END: Mapping the existing data record.

    // if(finalData.length === 0) throw new Error('No data to updated.')
    // await tbShelfItem.bulkCreate(finalData)

    // return { success: true, message: 'Data has been saved.' }
  } catch (er) {
    return { success: false, message: er.message }
  }
}


export async function srvBulkDeleteShelfItems (storeAccess = [], items = []) {
  try {
    const existShelfItems = await vwShelfItem.findAll({
      attributes: ['shelf_id'],
      where: {
        reg_id: { $in: items },
        store_code: { $in: storeAccess }
      },
      raw: true
    })

    if(existShelfItems.length !== items.length)
      throw new Error('No access to deleting some record.')

    await tbShelfItem.destroy({
      where: { reg_id: items },
      raw: true
    })
    return { success: true, message: 'Data has been deleted.' }
  } catch (er) {
    return { success: false, message: er.message }
  }
}


