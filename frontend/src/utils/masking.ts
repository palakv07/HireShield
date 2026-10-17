import type { SensitiveDetection } from '../types';

const CARD_REGEX = /\b(?:\d{4}[-\s]?){3}\d{1,4}\b/g;
const SSN_REGEX = /\b\d{3}-\d{2}-\d{4}\b/g;
const AADHAAR_REGEX = /\b\d{4}[-\s]?\d{4}[-\s]?\d{4}\b/g;
const OTP_REGEX = /\b(?:otp|code|pin|password|secret)[:\s]*([0-9]{4,8})\b/gi;
const STANDALONE_6DIGIT_REGEX = /\b\d{6}\b/g;
const EMAIL_REGEX = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
const PHONE_REGEX = /(?:\+?\d{1,3}[-.\s]?)?\(?\d{2,4}\)?[-.\s]?\d{3,4}[-.\s]?\d{3,4}\b/g;

export function scanSensitiveData(text: string): SensitiveDetection[] {
  if (!text) return [];
  const findings: SensitiveDetection[] = [];

  if (CARD_REGEX.test(text)) {
    findings.push({ type: 'card', label: 'Payment card number detected' });
  }
  CARD_REGEX.lastIndex = 0;

  if (SSN_REGEX.test(text) || AADHAAR_REGEX.test(text)) {
    findings.push({ type: 'id', label: 'Government ID number (SSN / Aadhaar) detected' });
  }
  SSN_REGEX.lastIndex = 0;
  AADHAAR_REGEX.lastIndex = 0;

  if (OTP_REGEX.test(text) || STANDALONE_6DIGIT_REGEX.test(text)) {
    findings.push({ type: 'otp', label: 'OTP or security verification code detected' });
  }
  OTP_REGEX.lastIndex = 0;
  STANDALONE_6DIGIT_REGEX.lastIndex = 0;

  return findings;
}

export function maskSensitiveData(text: string): string {
  if (!text) return '';
  let result = text;

  // Mask cards
  result = result.replace(CARD_REGEX, '[CARD_MASKED]');

  // Mask SSN & Aadhaar
  result = result.replace(SSN_REGEX, '[GOVT_ID_MASKED]');
  result = result.replace(AADHAAR_REGEX, '[GOVT_ID_MASKED]');

  // Mask OTP with context
  result = result.replace(OTP_REGEX, 'code: [OTP_MASKED]');

  // Mask standalone 6-digit codes
  result = result.replace(STANDALONE_6DIGIT_REGEX, '[CODE_MASKED]');

  // Mask emails and phones for safe reporting
  result = result.replace(EMAIL_REGEX, '[EMAIL_MASKED]');
  result = result.replace(PHONE_REGEX, '[PHONE_MASKED]');

  return result;
}
