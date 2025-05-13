import sequelize, { Op } from 'sequelize'
import vw from '../../../../models/view'

const vwMember = vw.vw_employee

const mechanicsAttr = ['id', 'employeeId', 'employeeName', 'positionId', 'positionName', 'positionCode']

export const fetchMechanics = async (query) => {
    return await vwMember.findAll({
        attributes: mechanicsAttr,
        where: {
          [Op.and]: [
            {
                positionname: 'MECHANIC',
                positioncode: 'MECH'
            },
            {'': sequelize.literal(`jsonb_extract_path(storelistid, ${query.store}::text) is not null`)}
          ],
        },
        order: [['id', 'desc']],
        raw: false
    })
}
