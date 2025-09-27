import Joi from "joi";

export const videoSchema = Joi.object({
    title: Joi.string().min(1).max(255).required(),
    channel: Joi.string().min(1).max(255).required(),
    duration: Joi.string().required(),
    level: Joi.string().optional().default('intermediate'),
});