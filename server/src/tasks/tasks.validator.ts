import { body, ValidationChain } from 'express-validator';
import { Priority } from '../enums/Priority';
import { Status } from '../enums/Status';

export const createValidator: ValidationChain[] = [
  body('title')
    .not()
    .isEmpty()
    .withMessage('Title is mandatory')
    .trim()
    .isString()
    .withMessage('Title should be a string'),
  body('date')
    .not()
    .isEmpty()
    .withMessage('Date is mandatory')
    .isString()
    .withMessage('Date should be a valid format'),
  body('description')
    .trim()
    .isString()
    .withMessage('Description should be a string'),
  body('priority')
    .trim()
    .isIn([Priority.low, Priority.normal, Priority.high])
    .withMessage('Priority can only be low, normal or high'),
  body('status')
    .trim()
    .isIn([Status.todo, Status.inProgress, Status.completed])
    .withMessage('Status can only be todo, inProgress or completed'),
];

export const updateValidator: ValidationChain[] = [
  body('id')
    .not()
    .isEmpty()
    .withMessage('ID is required')
    .trim()
    .isString()
    .withMessage('ID should be of uuid format'),
  body('status')
    .trim()
    .isIn([Status.todo, Status.inProgress, Status.completed])
    .withMessage('Status can only be todo, inProgress or completed'),
];
