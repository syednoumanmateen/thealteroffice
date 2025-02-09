import Joi from "joi";

export const validateRegister = (data) => {
  const schema = Joi.object({});
  return schema.validate(data);
};