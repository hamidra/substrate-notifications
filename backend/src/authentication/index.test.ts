import { add, authenticate } from '.';

test('verify a valid w3token can authenticate', () => {
  let test_nonce = '7581417912600841';
  let w3token_valid =
    'eyJhbGciOiJzcjI1NTE5IiwidHlwIjoiV0VCM19KV1QifQ==.eyJub25jZSI6Ijc1ODE0MTc5MTI2MDA4NDEiLCJhZGRyZXNzIjoiNUdyd3ZhRUY1elhiMjZGejlyY1FwRFdTNTdDdEVSSHBOZWhYQ1BjTm9IR0t1dFFZIn0=.9GJf7NEH46baH+nXziXwaOsviZl/WUrGBMkDFUAheEvx3Qt1rZKgswzdAku++S6MQ4LurZFFz3uFmBB9Bi5JhQ==';
  let { status, w3token, claims } = authenticate(w3token_valid);
  expect(status).toBe('200');
  expect(w3token).toBe(w3token_valid);
  expect(claims?.nonce).toBe(test_nonce);
});

test('testing add', () => {
  expect(add(2, 3)).toBe(5);
});
