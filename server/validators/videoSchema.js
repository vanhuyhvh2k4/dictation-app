import Joi from "joi";

export const videoSchema = Joi.object({
    title: Joi.string().min(1).max(255).required(),
    channel: Joi.string().min(1).max(255).required(),
    duration: Joi.string().required(),
    level: Joi.string().valid('beginner', 'intermediate', 'advanced').required(),
    status: Joi.string().valid('publish', 'draft').required().default('publish'),
});