'use strict';

const { isDate, isEmpty } = require('lodash');

const Validator = use('Validator');

Validator.extend('notEmptyAndDate', async (data, field, message, args, get) => {
  const value = get(data, field);

  if (isEmpty(value)) {
    throw message;
  }

  if (!isDate(value)) {
    throw message;
  }
});
