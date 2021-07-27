const { Op }        = require('sequelize');

const MajorCategory = require('../models/majorCategories');
const FirstMajor    = require('../models/firstMajors');
const SecondMajor   = require('../models/secondMajors');


const majorController = {
    getMajors: async(req, res) => {
        try {
            let majors;
            if (req.query.type === 'first' && req.query.campusId) {
                majors = await FirstMajor.findAll(
                    {where: {[Op.or]: [{campusId: req.query.campusId}, {campusId: 3}]}}
                )

            } else if (req.query.type === 'second' && req.query.campusId) {
                majors = await SecondMajor.findAll(
                    {where: {[Op.or]: [{campusId: req.query.campusId}, {campusId: 3}]}}
                )
            } else {
                majors = await MajorCategory.findAll(
                    {
                        include: [
                            { model: SecondMajor , attributes: ['id', 'name']}
                        ]
                    }
                )
            }

            return res.status(200).json(
                {
                    data: majors,
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
            )
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