const Scholarship             = require('../models/scholarships');
const ScholarshipDate         = require('../models/scholarshipDate');
const ScholarshipOption       = require('../models/scholarshipOptions');
const ScholarshipSchoolOption = require('../models/scholarshipSchoolOption');


const scholarshipController = {
    getScholarship: async(req, res) => {
        // startDate = req.query.start-date
        // endDate   = req.query.end-date
        
        scholarship = await Scholarship.findAll(
            {
                include: [
                    {model: ScholarshipDate, attributes: ['date']},
                    {model: ScholarshipOption, attributes: ['name']},
                    {model: ScholarshipSchoolOption, attributes: ['name']}
                ]
            }
        )

        return res.status(200).json(
            {
                data: scholarship,
                message: ""
            }
        )
    }
}


module.exports = { scholarshipController }