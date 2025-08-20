// [MPWA CONNECT]: FERDINAN - 31/08/2025
const MPWASERVICE = require('../../../services/v2/mpwa/srvMpwa')
const { ApiError } = require('../../../services/v1/errorHandlingService')
const { srvGetMemberCode } = require('../../../services/v2/master/customer/srvCustomerList')
const { srvGetVerificationWaContentMsg } = require('../../../services/v2/other/srvMessageTemplate');
const { fonnteMsg } = require('../../../services/v2/other/Fonnte/srvFonnte');
  

async function sendMessage (req, res, next) {
    console.log('Requesting-sendMessage' + ': ' + req.url + ' ...')

    const { phone, message, storecode } = req.body
    return MPWASERVICE.getStoreSettingForMPWA(storecode).then(async mpwaSetting => {
        const { mpwasender } = MPWASERVICE.checkMPWASetting(mpwaSetting)

        return MPWASERVICE.sendMessageToWa(phone, mpwasender, message).then((result) => {
            res.xstatus(200).json({
                success: true,
                message: 'Ok',
                data: result
            })
        }).catch(err => next(new ApiError(422, `ZCMPWA-00001: Couldn't send message`, err)))
    }).catch(err => next(new ApiError(422, `ZCMPWA-00002: Couldn't get store parent setting`, err)))
}

async function sendVerificationToNumber (req, res, next) {
    console.log('Requesting-verificationNumber' + ': ' + req.url + ' ...')
    
    const { storecode, phone } = req.body

    return MPWASERVICE.getStoreSettingForMPWA(storecode).then(async mpwaSetting => {
        const { mpwasender } = MPWASERVICE.checkMPWASetting(mpwaSetting)
        const { local, international } = MPWASERVICE.getPhoneFormats(phone)

        const memberCode = await MPWASERVICE.fetchMemberCodeByPhone(local, international)

        const verificationMsgContent = await srvGetVerificationWaContentMsg()
        if (!verificationMsgContent || verificationMsgContent === undefined || verificationMsgContent === null) {
            throw new Error('ZCMPWA-00005: Verification message content not available.');
        }

        return MPWASERVICE.sendMessageToWa(international, mpwasender, verificationMsgContent).then(async (result) => {
            if (result) {
                const dataCreatMsg = {
                    wa_number: local,
                    message_text: verificationMsgContent,
                    message_status: 'S',
                    message_type: 'VERIFIKASI-WA',
                    member_code: memberCode,
                    message_time: new Date()
                }

                return fonnteMsg(dataCreatMsg, next).then(async (pesan_wa) => {
                    const verificationPayload = {
                        verification_status: 'IP',
                        verif_request_at: new Date(),
                    }

                    return MPWASERVICE.updateVerificationMember(memberCode, verificationPayload).then((update_result) => {
                        res.xstatus(200).json({
                            success: true,
                            message: 'Ok',
                            data: update_result
                        })
                    }).catch(err => next(new ApiError(422, `ZCMPWA-000015: Couldn't update verification member`, err)))

                }).catch(err => next(new ApiError(422, `ZCMPWA-00006: Couldn't send message`, err)))
            }
            }).catch(err => next(new ApiError(422, `ZCMPWA-00007: Couldn't send message`, err)))
        }).catch(err => next(new ApiError(422, `ZCMPWA-00008: Couldn't get store parent setting`, err)))
}

async function sendMesageAfterPayment (req, res, next) {
    console.log('Requesting-sendMessageAfterPayment' + ': ' + req.url + ' ...')
    
    const { phone, storecode, transno } = req.body
    const { local, international } = MPWASERVICE.getPhoneFormats(phone)
    const memberCode = await MPWASERVICE.fetchMemberCodeByPhone(local, international)

    return MPWASERVICE.getStoreSettingForMPWA(storecode).then(async (mpwaSetting) => {
        const { mpwasender } = MPWASERVICE.checkMPWASetting(mpwaSetting)

        return MPWASERVICE.getTemplateAfterPaymentMessage(transno, mpwaSetting.afterpayment.templatecode || mpwaSetting.afterpayment).then(async (message) => {
            if (message) {
                return MPWASERVICE.sendMessageToWa(international, mpwasender, message).then(async (result) => {
                    if (result) {
                        const dataCreatMsg = {
                            wa_number: local,
                            message_text: message,
                            message_status: 'S',
                            message_type: mpwaSetting.afterpayment,
                            member_code: memberCode,
                            message_time: new Date()
                        }

                        return fonnteMsg(dataCreatMsg, next).then((pesan_wa) => {
  
                            res.xstatus(200).json({
                                success: true,
                                message: 'Ok',
                                data: pesan_wa
                            })
                        }).catch(err => next(new ApiError(422, `ZCMPWA-00013: Couldn't send message`, err)))
                    } else {
                        throw new Error('ZCMPWA-00014: Template message not available.');
                    }
                }).catch(err => next(new ApiError(422, `ZCMPWA-00011: Couldn't send message`, err)))
            } else {
                throw new Error('ZCMPWA-00012: Template message not available.');
            }
        }).catch(err => next(new ApiError(422, `ZCMPWA-0009: Couldn't send message`, err)))
    }).catch(err => next(new ApiError(422, `ZCMPWA-00010: Couldn't get store setting`, err)))
}

async function getReceiveMessage (req, res, next) {
    console.log('Requesting-getReceiveMessage' + ': ' + req.url + ' ...')

    /**
     * THIS RECEIVE MESSAGE IS JUST FOR VERIFICATION MEMBER FOR NOW
     * SO, THIS FUNC ONLY ALLOW Y MESSAGE
     */

    console.log("req.body", req.body)
    const message = MPWASERVICE.checkAllowedMessageForVerification(req.body.message)
    const { local, international } = MPWASERVICE.getPhoneFormats(req.body.from)
    const memberCode = await MPWASERVICE.fetchMemberCodeByPhone(local, international)

    const dataCreatMsg = {
        wa_number: local,
        message_text: message,
        message_status: 'R',
        member_code: memberCode,
        message_time: new Date()
    }

    return fonnteMsg(dataCreatMsg, next).then(async (pesan_wa) => {
        const verificationPayload = {
            verification_status: 'DN',
            verif_approved_at: new Date(),
        }

        return MPWASERVICE.updateVerificationMember(memberCode, verificationPayload).then((update_result) => {
            res.xstatus(200).json({
                success: true,
                message: 'Ok',
                data: update_result,
                message_body: req.body
            })
        }).catch(err => next(new ApiError(422, `ZCMPWA-00018: Couldn't update verification member`, err)))

    }).catch(err => next(new ApiError(422, `ZCMPWA-00017: Couldn't send message`, err)))
}

module.exports = { 
    sendMessage, 
    getReceiveMessage,
    sendVerificationToNumber,
    sendMesageAfterPayment
}
