const Campus = require('../models/campuses');


const campusController = {
    getCampus: async(req, res) => {
        const campuses = await Campus.findAll();

        return res.status(200).json(
            {
                data: campuses,
                message: ""
            }
        )
    }
}

module.exports = { campusController };