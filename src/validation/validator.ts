import { Request, Response, NextFunction } from "express";
import { check, validationResult, checkSchema } from "express-validator";

export function validateTransaction() {
  return [
    check("value", "field value must be filled").not().isEmpty(),
    check("value", "field value must be a number").isNumeric(),
    check("payer_id").not().isEmpty(),
    check("receiver_id").not().isEmpty(),
    check("transaction_type").not().isEmpty(),
    check("date").not().isEmpty(),
  ];
}

export function validateAccount() {
  return [
    check("password", "password is required").not().isEmpty(),
    check("user_id", "user field must not be empty").not().isEmpty(),
    check("name", "user field must not be empty").not().isEmpty(),
    check("cpf", "cpf field must not be empty").not().isEmpty(),
    check("email", "this field is required and must be filled correctly")
      .isEmail()
      .not()
      .isEmpty(),
  ];
}

// export function validateTransaction(transaction: Transaction) {
//   //   return [
//   //     check("transaction_type").not().isEmpty(),
//   //     check("transaction_type").not().isEmpty(),
//   //     check("customer_info.name").not().isEmpty(),
//   //     check("customer_info.cpf").not().isEmpty(),
//   //     check("customer_info.email").not().isEmpty(),
//   //   ];
// }

export const validate = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  const extractedErrors: Record<string, string>[] = [];

  errors.array().map((err) => {
    extractedErrors.push({ [err.msg]: err.msg });
  });

  return res.status(422).json({
    errors: extractedErrors,
  });
};

export const tokenValidation = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization;

  if (!token || token != process.env.TOKEN) {
    return res.status(401).json({
      message: "Unauthorized! You have no token to perform this operation",
    });
  }

  return next();
};
