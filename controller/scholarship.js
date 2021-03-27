const { Op }                  = require('sequelize');

const Scholarship             = require('../models/scholarships');
const ScholarshipDate         = require('../models/scholarshipDate');
const ScholarshipOption       = require('../models/scholarshipOptions');
const ScholarshipSchoolOption = require('../models/scholarshipSchoolOption');


const scholarshipController = {
    getScholarship: async(req, res) => {
        let where = {}

        if (req.body.dateId) {
            where['scholarshipDateId'] = { [Op.in]: req.body.dateId }
        }

        if (req.body.optionId) {
            where['scholarshipOptionId'] = { [Op.in]: req.body.optionId }
        }

        if (req.body.campusId){
            where['scholarshipSchoolOptionId'] = { [Op.in]: req.body.campusId }
        }

        const scholarship = await Scholarship.findAll(
            {
                include: [
                    {model: ScholarshipDate, attributes: ['date']},
                    {model: ScholarshipOption, attributes: ['name']},
                    {model: ScholarshipSchoolOption, attributes: ['name']}
                ],
                where
            }
        )

        return res.status(200).json(
            {
                data: scholarship,
                message: ""
            }
        );
        
    },

    getShoclarshipDate: async(req, res) => {
        const scholarshipDates = await ScholarshipDate.findAll({});

        return res.status(200).json(
            {
                data: scholarshipDates,
                message: ""
            }
        );
    },

    getScholarshipOption: async(req, res) => {
        const scholarshipOptions = await ScholarshipOption.findAll({});

        return res.status(200).json(
            {
                data: scholarshipOptions,
                message: ""
            }
        );
    },

    getShoclarshipSchoolOPtion: async(req, res) => {
        const scholarshipSchoolOptions = await ScholarshipSchoolOption.findAll({});

        return res.status(200).json(
            {
                data: scholarshipSchoolOptions,
                message: ""
            }
        );
    }
}


module.exports = { scholarshipController };