const Sequelize = require('sequelize');

const User = require('../models/users');


exports.userReport = async(req, res, next) => {
    // 테스트를 위해 req.user.id 로 User Id를 받았다.
    try {
        user = await User.findOne({where: {id: req.userId}});
        user.reportCount = user.reportCount + 1;

        await user.save();

        if (user.reportCount === 5) {
            user.suspensionCount = user.suspensionCount + 1;
            user.type = 'suspension'

            await user.save();

            // console.log('After Suspended')
            // console.log(user)
            // console.log(user.reportCount)
            // console.log(user.suspensionCount)
            // console.log(user.type)
            // return res.status(200).json(
            //     {
            //         code: 200,
            //         message: 'User_Type_Updated'
            //     }
            // );
        } // else {
            // console.log('Before Suspended')
            // console.log(user)
            // console.log(user.reportCount)
            // console.log(user.suspensionCount)
            // console.log(user.type)
            // return res.status(200).json(
            //     {
            //         code: 200,
            //         message: 'Suspension_Count_Updated'
            //     }
            // );
        // }


        // 게시글과 댓글 모두 사용자가 신고 처리 했을 때 위 과정을 거친 이후 아래 response를 받는다.
        return res.status(200).json(
            {
                code: 200,
                message: 'REPORT_SUCCESS'
            }
        )

    } catch (error) {
        console.log(error);
        return res.status(500).json(
            {
                code: 500,
                message: 'SERVER_ERROR'
            }
        )
    }
};