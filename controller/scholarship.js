const { Op }                  = require('sequelize');

const Campus                  = require('../models/campuses');
const Scholarship             = require('../models/scholarships');
const ScholarshipDate         = require('../models/scholarshipDate');
const ScholarshipOption       = require('../models/scholarshipOptions');


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
            where['campusId'] = { [Op.in]: req.body.campusId }
        }

        const scholarship = await Scholarship.findAll(
            {
                attributes: ['id', 'title', 'link'],
                include: [
                    {model: ScholarshipDate, attributes: ['id', 'date']},
                    {model: ScholarshipOption, attributes: ['id', 'name']},
                    {model: Campus, attributes: ['id', 'name']}
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
        const campuses = await Campus.findAll({});

        return res.status(200).json(
            {
                data: campuses,
                message: ""
            }
        );
    }
}


module.exports = { scholarshipController };