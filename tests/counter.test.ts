/**
 * Unit tests for character counter
 * 字符统计功能单元测试
 */

import { test, describe } from 'node:test';
import assert from 'node:assert';
import { countCharacters, formatSystemReminder } from '../src/core/counter.ts';

describe('countCharacters', () => {
  test('counts Chinese characters', () => {
    const result = countCharacters('你好世界');
    assert.equal(result.chinese, 4);
    assert.equal(result.total, 4);
  });

  test('counts English characters', () => {
    const result = countCharacters('hello');
    assert.equal(result.english, 5);
    assert.equal(result.total, 5);
  });

  test('counts digits', () => {
    const result = countCharacters('12345');
    assert.equal(result.digits, 5);
    assert.equal(result.total, 5);
  });

  test('counts punctuation', () => {
    const result = countCharacters('Hello, World!');
    assert.equal(result.punctuation, 2);
    assert.equal(result.total, 13);
  });

  test('counts whitespace', () => {
    const result = countCharacters('a b');
    assert.equal(result.whitespace, 1);
    assert.equal(result.total, 3);
  });

  test('counts mixed content correctly', () => {
    const result = countCharacters('你好Hello123!');
    assert.equal(result.chinese, 2);
    assert.equal(result.english, 5);
    assert.equal(result.digits, 3);
    assert.equal(result.punctuation, 1);
    assert.equal(result.total, 11);
  });

  test('handles empty string', () => {
    const result = countCharacters('');
    assert.equal(result.total, 0);
    assert.equal(result.chinese, 0);
    assert.equal(result.english, 0);
  });

  test('counts CJK Extension characters', () => {
    const result = countCharacters('㐀㐁㐂');
    assert.equal(result.chinese, 3);
  });
});

describe('formatSystemReminder', () => {
  test('formats result as JSON with system-reminder tag', () => {
    const result = countCharacters('你好Hello');
    const output = formatSystemReminder(result);

    assert.match(output, /<system-reminder>/);
    assert.match(output, /"type":"character_count"/);
    assert.match(output, /"chinese":2/);
    assert.match(output, /"english":5/);
    assert.match(output, /"total":7/);
  });

  test('contains all character type counts', () => {
    const result = countCharacters('Hello');
    const output = formatSystemReminder(result);

    const jsonMatch = output.match(/\{[\s\S]*\}/);
    assert.ok(jsonMatch, 'Should contain JSON object');
    const json = JSON.parse(jsonMatch[0]);
    assert.equal(json.type, 'character_count');
    assert.equal(json.english, 5);
    assert.equal(json.digits, 0);
    assert.equal(json.punctuation, 0);
    assert.equal(json.whitespace, 0);
  });
});

console.log('Running tests...');