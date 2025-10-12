import Joi from 'joi';

export const createTopicSchema = Joi.object({
  name: Joi.string().required().min(2).max(100),
  description: Joi.string().allow('', null),
  image: Joi.string().allow('', null),
});

export const updateTopicSchema = Joi.object({
  name: Joi.string().min(2).max(100),
  description: Joi.string().allow('', null),
  image: Joi.string().allow('', null),
}).min(1); // Yêu cầu ít nhất 1 trường được cập nhật
