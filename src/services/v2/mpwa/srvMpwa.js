// [MPWA CONNECT]: FERDINAN - 31/08/2025
import axios from "axios";
import moment from "moment";
import { Op } from "sequelize";

import Storages from '../../../utils/storages'
import Sockets from '../../../utils/socket'

import project from "../../../../config/project.config";

import dbv from "../../../models/view";
import db from "../../../models/tableR";
import db2 from "../../../models";
import { srvGetStoreSetting } from "../master/store/srvStore";

const vwPos = dbv.vw_pos;
const vwPosDetail = dbv.vw_pos_detail;

const tblMember = db.tbl_member;
const tblMessageTemplate = db.tbl_message_template;

// [REMINDER SERVICE MPWA]: FERDINAN - 2025/08/14
const tblStore = db2.tbl_store

const viewSaleDetailMainFields = ['id', 'typeCode', 'transNo', 'bundlingId', 'bundlingCode', 'bundlingName',
    'productId', 'serviceCode', 'serviceName', 'productCode', 'productName', 'qty', 'trade_in_id',
    'sellPrice', 'sellingPrice', 'DPP', 'PPN', 'discountLoyalty', 'discount', 'disc1', 'disc2', 'disc3',
  
    // [NEW]: FERDINAN - 2025-03-26
    'salestype', 'additionalpricepercent', 'additionalpricenominal',
  
    // [EXTERNAL SERVICE]: FERDINAN - 2025-04-22
    'transnopurchase',
  
    // [HPP VALIDATION]: FERDINAN - 2025-05-23
    'hppperiod', 'hppprice'
  ]

export async function sendMessageToWa (receiver, sender, message) {
  const url = `${project.mpwa_url}/send-message`;
  return axios
    .get(url, {
      params: {
        api_key: project.mpwa_api_key,
        sender,
        number: receiver,
        message,
      },
    })
    .then((res) => {
      console.log("SEND MESSAGE RESPONSE >>>> ", res.data);
      return res.data;
    })
    .catch((err) => {
      throw err;
    });
};

// Fungsi untuk menggantikan placeholder di dalam template
function fillTemplate(template, data) {
  return template.replace(/{(\w+)}/g, (_, key) => {
    return data[key] || "";
  });
}

// [REMINDER SERVICE MPWA]: FERDINAN - 2025/08/14
export async function getTemplateMessage (templatecode) {
  const template = await tblMessageTemplate.findOne({
    attributes: ["content_body"],
    where: { code: templatecode },
  });
  return template
}

export async function getTemplateAfterPaymentMessage (transno, templatecode) {
  const pos = await vwPos.findOne({ 
    attributes: ['transno', 'total_netto', 'transdate'],
    where: { transno: transno }, 
    raw: true 
  });

  const posdetail = await vwPosDetail.findAll({
    attributes: viewSaleDetailMainFields,
    where: { transno: transno },
    raw: true,
  })

  const template = await getTemplateMessage(templatecode);

  const products = posdetail.filter((item) => item.typecode === 'P');
  const services = posdetail.filter((item) => item.typecode === 'S');

  const productlists = products.map(item => `- ${item.productname}`).join('\n');
  const servicelists = services.map(item => `- ${item.servicename}`).join('\n');

  const data = {
    ...pos,
    total_netto: pos.total_netto
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, "."),
    transdate: moment(pos.transdate).format("DD-MM-YYYY"),
    productlists,
    servicelists,
  };

  const message = fillTemplate(template.content_body.contentMsg, data);

  return message
}

export async function getStoreSettingForMPWA (storecode) {
  return srvGetStoreSetting(storecode).then(async (store) => {
    return srvGetStoreSetting(store.storeparentcode).then(
      async (storeparent) => {
        return storeparent.settingvalue.mpwa || store.settingvalue.mpwa
      }
    ).catch(err => next(new ApiError(422, `ZCMPWA-00003: Couldn't get store parent setting`, err)))
  }).catch(err => next(new ApiError(422, `ZCMPWA-00004: Couldn't get store setting`, err)))
}

export function formatNomorIndonesia(nomor) {
  // Hapus semua karakter selain angka
  let clean = nomor.replace(/\D/g, '');

  // Jika sudah diawali dengan 62 → biarkan
  if (clean.startsWith('62')) {
    return clean;
  }

  // Jika diawali dengan 0 → ubah jadi 62
  if (clean.startsWith('0')) {
    return '62' + clean.slice(1);
  }

  // Jika diawali dengan 8 (misal 8123456789) → tambahkan 62
  if (clean.startsWith('8')) {
    return '62' + clean;
  }

  // Selain itu, kembalikan seadanya
  return clean;
}

export function checkMPWASetting (mpwa) {
  if(!mpwa || !mpwa.active) throw new Error('ZCMPWA-00000-1: Cannot found mpwa setting in your store.')

  const mpwasender = mpwa.sender
  if(!mpwasender) throw new Error('ZCMPWA-00000: Cannot found number sender phone.')

  return { mpwasender }
}

export async function updateVerificationMember (membercode, payload) {
  return await tblMember.update(payload, { where: { membercode } })
}

export function checkAllowedMessageForVerification (message) {
  if (!message) {
    throw new Error('ZCMPWA-00000-2: Your message is empty.')
  } else if (message.toLocaleLowerCase() !== 'y') {
    throw new Error('ZCMPWA-00000-3: Message is not allowed.')
  } else {
    return message
  }
}

export function getPhoneFormats(phone) {
  // Hapus semua karakter non-angka
  const cleaned = phone.replace(/\D/g, '');

  let localFormat = '';
  let intlFormat = '';

  if (cleaned.startsWith('62')) {
    intlFormat = cleaned;
    localFormat = '0' + cleaned.slice(2);
  } else if (cleaned.startsWith('0')) {
    localFormat = cleaned;
    intlFormat = '62' + cleaned.slice(1);
  } else {
    // Kalau tidak dikenali, kembalikan input apa adanya
    return {
      local: phone,
      international: phone,
    };
  }

  return {
    local: localFormat,
    international: intlFormat,
  };
}

export async function fetchMemberCodeByPhone (localphone, internationalphone) {
  try {
    const result = await tblMember.findOne({
      attributes: ['memberCode'],
      where: { 
        [Op.or]: [
          { mobileNumber: localphone },
          ...(internationalphone ? [{ mobileNumber: internationalphone }] : [])
        ]
      }
    })

    return result ? result.memberCode : null
  } catch (error) {
    console.error('Couldn\'t find member code : ', error)
    throw error
  }
}

// [REMINDER SERVICE MPWA]: FERDINAN - 2025/08/14
export async function getTransactionByAge ({ days, weeks, months, years, storeid }) {
  let date = new Date()

  if (years)  date.setFullYear(date.getFullYear() - years)
  if (months) date.setMonth(date.getMonth() - months)
  if (weeks)  date.setDate(date.getDate() - (weeks * 7))
  if (days)   date.setDate(date.getDate() - days)

  let whereClause = {}

  if (days || weeks || months || years) {
    whereClause.transdate = {
      [Op.lte]: date
    }
  }

  const transactions = await vwPos.findAll({
    where: {
      ...whereClause,
      storeid
    },
    raw: true
  })

  return transactions
}

// [REMINDER SERVICE MPWA]: FERDINAN - 2025/08/14
export async function getStoreSetting () {
  const store = await tblStore.findAll({
    attributes: ['id', 'storeparentid', 'settingvalue'],
    raw: true
  })

  // bikin lookup biar cepat cari parent
  const storeMap = new Map(store.map(s => [s.id, s.settingvalue]))

  const storeWithParent = store.map(function(s) {
    const parentSetting = storeMap.get(s.storeparentid)

    return {
      id: s.id,
      storeparentid: s.storeparentid,
      mpwa: s.settingvalue && s.settingvalue.mpwa ? s.settingvalue.mpwa : null,
      mpwaParent: parentSetting && parentSetting.mpwa ? parentSetting.mpwa : null
    }
  })

  return storeWithParent
}