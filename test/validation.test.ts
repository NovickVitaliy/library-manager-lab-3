import { Validation } from '../src/utils/validation';
import * as assert from 'assert';
import { describe } from 'mocha';

describe('Create Book Request Validation', () => {
  context('When user provides invalid book name', () => {
    it('Should return false', () => {
      const validation = Validation.getInstance();
      const validationResult = validation.validateCreateBookRequest(
        '',
        'author',
        2024
      );
      assert.equal(validationResult, false);
    });
  });

  context('When user provides invalid author', () => {
    it('Should return false', () => {
      const validation = Validation.getInstance();
      const validationResult = validation.validateCreateBookRequest(
        'bookname',
        '',
        2024
      );
      assert.equal(validationResult, false);
    });
  });

  context('When user provides invalid release year', () => {
    it('Should return false', () => {
      const validation = Validation.getInstance();
      const validationResult = validation.validateCreateBookRequest(
        'bookname',
        'autor',
        0
      );
      assert.equal(validationResult, false);
    });
  });

  context('When user provides negative release year', () => {
    it('Should return false', () => {
      const validation = Validation.getInstance();
      const validationResult = validation.validateCreateBookRequest(
        'bookname',
        'autor',
        0
      );
      assert.equal(validationResult, false);
    });
  });

  context('When user provides valid data', () => {
    it('Should return true', () => {
      const validation = Validation.getInstance();
      const validationResult = validation.validateCreateBookRequest(
        'bookname',
        'autor',
        2024
      );
      assert.equal(validationResult, true);
    });
  });
});

describe('Create User Request Validation', () => {
  context('When user provides empty username', () => {
    it('Should return false', () => {
      const validation = Validation.getInstance();
      const validationResult = validation.validateCreateUserRequest(
        '',
        'some@email.com'
      );
      assert.equal(validationResult, false);
    });
  });

  context('When user provides empty email', () => {
    it('Should return false', () => {
      const validation = Validation.getInstance();
      const validationResult = validation.validateCreateUserRequest('123', '');
      assert.equal(validationResult, false);
    });
  });

  context('When user provides invalid email', () => {
    it('Should return false', () => {
      const validation = Validation.getInstance();
      const validationResult = validation.validateCreateUserRequest(
        '',
        'notemail'
      );
      assert.equal(validationResult, false);
    });
  });

  context('When user provides valid data', () => {
    it('Should return true', () => {
      const validation = Validation.getInstance();
      const validationResult = validation.validateCreateUserRequest(
        'username',
        'some@email.com'
      );
      assert.equal(validationResult, true);
    });
  });
});
