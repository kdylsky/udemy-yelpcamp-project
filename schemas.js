const Joi = require('joi');
// joi는 mongoose에 들어가기 전에 확인하는 다른 유효성검사이다.
module.exports.campgroundSchema = Joi.object({
    // Joi.타입.옵션 형태로 구성된다.
    campground: Joi.object({
        title: Joi.string().required(),
        price: Joi.number().required().min(0),
        images: Joi.string().required(),
        location: Joi.string().required(),
        description: Joi.string().required()
    }).required()
});