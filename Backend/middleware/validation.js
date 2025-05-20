const { body, validationResult } = require('express-validator');

exports.validateRepo = [
  body('owner').trim().notEmpty().withMessage('Repository owner is required'),
  body('repo').trim().notEmpty().withMessage('Repository name is required'),
];

exports.validateChat = [
  body('question').trim().notEmpty().withMessage('Question is required'),
  body('repoUrl').trim().notEmpty().withMessage('Repository URL is required')
    .matches(/^https?:\/\/github\.com\/[^\/]+\/[^\/]+$/)
    .withMessage('Invalid GitHub repository URL'),
];

exports.validateIssue = [
  body('title').trim().notEmpty().withMessage('Issue title is required'),
  body('body').trim().notEmpty().withMessage('Issue description is required'),
];

exports.handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};
