const MainMajor   = require('../models/mainMajors');
const DoubleMajor = require('../models/doubleMajors');


const majorController = {
    getMainMajor: async(req, res) => {
        const mainMajor   = await MainMajor.findAll();

        return res.status(200).json(
            {
                data: mainMajor,
                message: ""
            }
        );
    },
    
    getDoubleMajor: async(req, res) => {
        const doubleMajor = await DoubleMajor.findAll();

        return res.status(200).json(
            {
                data: doubleMajor,
                message: ""
            }
        )
    },

    createMajor: async(req, res) => {
        // for admin user
        if (req.body.mainMajor) {
            await MainMajor.create({
                name: req.body.mainMajor
            });
        }

        if (req.body.doubleMajor) {
            await DoubleMajor.create({
                name: req.body.doubleMajor
            })
        }

        return res.status(200).json(
            {
                data: "",
                message: ""
            }
        )
    }  
}


module.exports = { majorController };