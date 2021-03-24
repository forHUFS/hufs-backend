const MainMajor   = require('../models/mainMajors');
const DoubleMajor = require('../models/doubleMajors');


const majorController = {
    getMajor: async(req, res) => {
        const mainMajor   = await MainMajor.findAll();
        const doubleMajor = await DoubleMajor.findAll();

        const major = {
            'mainMajor'  : mainMajor,
            'doubleMajor': doubleMajor
        }

        return res.status(200).json(
            {
                data: major,
                message: ''
            }
        );
    }
}


module.exports = { majorController };