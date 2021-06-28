const { Op }      = require('sequelize');

const MainMajor   = require('../models/mainMajors');
const DoubleMajor = require('../models/doubleMajors');


const majorController = {
    getMainMajor: async(req, res) => {
        try {
            // const mainMajor = await MainMajor.findAll({where: {[Op.or]: [{campusId: req.query.campusId}, {campusId: 3}]}});
            const mainMajor = await MainMajor.findAll({});

            return res.status(200).json(
                {
                    data: mainMajor,
                    message: ""
                }
            );
        } catch (error) {
            console.log(error);

            return res.status(500).json(
                {
                    data: "",
                    message: error
                }
            );
        }
    },
    
    getDoubleMajor: async(req, res) => {
        try {
            // const doubleMajor = await DoubleMajor.findAll({where: {[Op.or]: [{campusId: req.query.campusId}, {campusId: 3}]}});
            const doubleMajor = await DoubleMajor.findAll({});

            return res.status(200).json(
                {
                    data: doubleMajor,
                    message: ""
                }
            )
        } catch (error) {
            console.log(error);

            return res.status(500).json(
                {
                    data: "",
                    message: error
                }
            );
        }
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