import db from '../models'
import dbv from '../models/view'
import sequelize from '../native/sequelize'
import stringSQL from '../native/sqlSequence'
import {
    ApiError
} from '../services/v1/errorHandlingService'
import {
    isEmpty
} from '../utils/check'

const Sequence = db.tbl_sequence
// const SequenceFormatTable = db.tbf_sequence
// const SequenceFormat = dbv.vw_sequence_format

const sequenceField = [
    `id`,
    `seqCode`,
    `seqName`,
    `seqValue`,
    `initialChar`,
    `maxNumber`,
    `resetType`,
    `resetDate`,
    `oldValue`,
    `createdBy`,
    `createdAt`,
    `updatedBy`,
    `updatedAt`,
]

export async function getSequenceFormatByCode (query, next) {
    try {
        let sSQL = stringSQL.s00001
        const sequence = await sequelize.query(sSQL, {
            replacements: {
                seqCode: query.seqCode,
                seqType: query.type
            },
            type: sequelize.QueryTypes.CALL
        })

        return sequence[0][0].seq

    } catch (er) {
        throw er
    }
    // return new Promise(function (resolve, reject) {
        
    //         .then((users) => {
    //             resolve(users[0][0].seq) // resolve(users[0].seq)
    //         }).catch(err => {
    //             const errObj = JSON.parse(JSON.stringify(err))
    //             const {
    //                 parent,
    //                 original,
    //                 sql,
    //                 ...other
    //             } = errObj
    //             next(new ApiError(501, other, err))
    //         })
    // }).catch(err => {
    //     const errObj = JSON.parse(JSON.stringify(err))
    //     const {
    //         parent,
    //         original,
    //         sql,
    //         ...other
    //     } = errObj
    //     next(new ApiError(400, other, err))
    // })
}

export function getSequenceByCode (sequencecode, storeId) {
    return Sequence.findOne({
        where: {
            seqCode: sequencecode,
            storeId: storeId
        },
        raw: false
    })
}

export function getSequenceFormatById (sequenceid) {
    return SequenceFormat.findAll({
        attributes: sequenceField,
        where: {
            formatId: sequenceid,
        },
        raw: false
    })
}

export function sequenceExists (sequenceId, storeId) {
    return getSequenceByCode(sequenceId, storeId).then(sequence => {
        if (sequence === null) {
            return false;
        } else {
            return true;
        }
    })
}

export function InsertSequenceFormat (id, sequenceId, createdBy, next) {
    const dataSequence = sequenceId
    return Sequence.create({
        storeId: dataSequence.storeId,
        seqCode: id,
        typeSeq: dataSequence.typeSeq,
        seqName: dataSequence.seqName,
        initialChar: dataSequence.initialChar,
        maxNumber: dataSequence.maxNumber,
        resetType: dataSequence.resetType,
        oldValue: dataSequence.oldValue,
        resetDate: dataSequence.resetDate,
        seqValue: dataSequence.seqValue,
        createdBy: createdBy
    }).catch(err => {
        const errObj = JSON.parse(JSON.stringify(err))
        const {
            parent,
            original,
            sql,
            ...other
        } = errObj
        next(new ApiError(501, other, err))
    })
}

export function updateResetSequenceFormat (sequenceId, updatedBy, next) {
    const dataSequence = sequenceId
    return Sequence.update({
        seqCode: dataSequence.seqCode,
        seqName: dataSequence.seqName,
        typeSeq: dataSequence.typeSeq,
        initialChar: dataSequence.initialChar,
        maxNumber: dataSequence.maxNumber,
        resetType: dataSequence.resetType,
        oldValue: dataSequence.oldValue,
        resetDate: dataSequence.resetDate,
        seqValue: dataSequence.seqValue,
        updatedBy: updatedBy
    }, {
            where: {
                id: sequenceId.id,
                storeId: sequenceId.storeId
            }
        }).catch(err => {
            const errObj = JSON.parse(JSON.stringify(err))
            const {
                parent,
                original,
                sql,
                ...other
            } = errObj
            next(new ApiError(501, other, err))
        })
}