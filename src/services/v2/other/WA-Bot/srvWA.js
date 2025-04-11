import request from '../../../../utils/request'
import Configs from './config'

export async function sendMessages ({
  priority = false,
  activation_key = null,
  sendTo = [],
  fileMsg = null,
  sendToRelated = false,
  textMsg = null,
  footerMsg = null,
  buttonMsg = [],
  dynamicMessages = {}
}) {
  return request({
    url: Configs.sendMessage(),
    method: 'POST',
    data: {
      priority,
      activation_key,
      sendTo,
      fileMsg,
      sendToRelated,
      textMsg,
      footerMsg,
      buttonMsg,
      dynamicMessages: Object.keys(dynamicMessages).length === 0 ? null : dynamicMessages
    }
  })
}

export async function kirimPesan ({
  priority = false,
  activation_key = null,
  sendTo = [],
  fileMsg = null,
  sendToRelated = false,
  textMsg = null,
  footerMsg = null,
  buttonMsg = [],
  dynamicMessages = {},
  member_code = null,
  message_source = "POS",
  message_type = "VERIFIKASI-WA",
  message_status = "S"
}) {
  return request({
    url: Configs.sendFonnte(),
    method: 'POST',
    data: {
      priority,
      activation_key,
      sendTo,
      fileMsg,
      sendToRelated,
      textMsg,
      footerMsg,
      buttonMsg,
      dynamicMessages: Object.keys(dynamicMessages).length === 0 ? null : dynamicMessages,
      member_code,
      message_source,
      message_type,
      message_status
    }
  })
}

export async function sendMessagesTemplate ({
  activation_key = null,
  sendTo = {},
  templateID = null,
  config = {}
}) {
  return request({
    url: Configs.sendTemplateMessages(),
    method: 'POST',
    data: {
      activation_key,
      sendTo,
      templateID,
      config
    }
  })
}
