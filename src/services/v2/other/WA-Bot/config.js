const _PREFIX = '/oapi-app-dmi/v1'
const _PREFIXV2 = '/oapi-app-dmi/v2'

const _TARGET_URL = process.env.URL_WA_BOT
const _TARGET_FONNTE = process.env.URL_FONNTE

const restApi = {
  sentMsg: '/wa/send-msg',
  sentFonnte: '/pro/wa/send-messages',
  templateMsg: '/wa/template-api'
}

export default {
  sendMessage: () => `${_TARGET_URL}${_PREFIX}${restApi.sentMsg}`,
  sendFonnte: () => `${_TARGET_FONNTE}${restApi.sentFonnte}`,
  sendTemplateMessages: () => `${_TARGET_URL}${_PREFIXV2}${restApi.templateMsg}`
}
