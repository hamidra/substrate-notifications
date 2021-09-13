import { authenticate } from '.';
import { verify_w3token, issue_w3token } from './web3Auth';

/*test('verify a valid w3token can authenticate', () => {
  let test_nonce = '7581417912600841';
  let w3token_valid =
    'eyJhbGciOiJzcjI1NTE5IiwidHlwIjoiV0VCM19KV1QifQ==.eyJub25jZSI6Ijc1ODE0MTc5MTI2MDA4NDEiLCJhZGRyZXNzIjoiNUdyd3ZhRUY1elhiMjZGejlyY1FwRFdTNTdDdEVSSHBOZWhYQ1BjTm9IR0t1dFFZIn0=.9GJf7NEH46baH+nXziXwaOsviZl/WUrGBMkDFUAheEvx3Qt1rZKgswzdAku++S6MQ4LurZFFz3uFmBB9Bi5JhQ==';
  let { status, w3token, claims } = authenticate(w3token_valid);
  expect(status).toBe('200');
  expect(w3token).toBe(w3token_valid);
  expect(claims?.nonce).toBe(test_nonce);
});*/

test('verify valid token', () => {
  let validToken =
    'eyJhbGciOiJzcjI1NTE5IiwidHlwIjoiV0VCM19KV1QifQ==.eyJub25jZSI6Ijc1ODE0MTc5MTI2MDA4NDEiLCJhZGRyZXNzIjoiNUdyd3ZhRUY1elhiMjZGejlyY1FwRFdTNTdDdEVSSHBOZWhYQ1BjTm9IR0t1dFFZIn0=.9GJf7NEH46baH+nXziXwaOsviZl/WUrGBMkDFUAheEvx3Qt1rZKgswzdAku++S6MQ4LurZFFz3uFmBB9Bi5JhQ==';
  let validToken2 =
    'eyJhbGciOiJzcjI1NTE5IiwidHlwIjoiV0VCM19KV1QifQ==.eyJub25jZSI6IjgzMjM3NTY2MzE4NTAxNTQiLCJhZGRyZXNzIjoiNUdyd3ZhRUY1elhiMjZGejlyY1FwRFdTNTdDdEVSSHBOZWhYQ1BjTm9IR0t1dFFZIn0=.Xl/VBwzMwo8UGXdZisHzL2/BxAkDYPemEiN+vsuZg0LhVx7+2NPkVo0HrDGe+yNJMhjn/cGsxt2jy5uRQqkUig==';

  let { header, payload, error } = verify_w3token(validToken2);
  expect(error).toBe('');
});
