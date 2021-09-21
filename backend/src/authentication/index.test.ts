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

test('verify valid token', async () => {
  let validToken1 =
    'eyJhbGciOiJzcjI1NTE5IiwidHlwIjoiV0VCM19KV1QifQ==.eyJub25jZSI6IjExMDYzMDMxNjk5NTA1NDgiLCJhZGRyZXNzIjoiNUN5ekRIWFRZdTd6NENEZjFlclQ5Rm5VeDQ5SHhFTEw1SmM5WkNERGJZbURTa1FVIn0=.EGc4bACxZGBY8EbsFf49fs0+GcMyNQ8cXZ+vzR9s+2eM2YTFAirzFu47GtJDFeE6GF1NA/XzW5ww7PcDNJGygA==';
  let validToken2 =
    'eyJhbGciOiJzcjI1NTE5IiwidHlwIjoiV0VCM19KV1QifQ==.eyJub25jZSI6IjM3MzEwODQwNDcxMjg4OTEiLCJhZGRyZXNzIjoiNUdyd3ZhRUY1elhiMjZGejlyY1FwRFdTNTdDdEVSSHBOZWhYQ1BjTm9IR0t1dFFZIn0=.Wr+1gLe2D5H+FvnUUAaKvwTQja6zzn+CrFki+Air/jD5jbBQBZVgpbu4uVxXApdEPIxPps8rkEWHzmLaEBzFiw==';

  let { header, payload, error } = await verify_w3token(validToken2);
  expect(error).toBeFalsy();
});
