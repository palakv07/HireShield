import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { AnalyzerView } from '../pages/AnalyzerView';
import { scanSensitiveData, maskSensitiveData } from '../utils/masking';

describe('HireShield Client Masking Utility', () => {
  it('detects sensitive payment cards, SSN, and OTPs', () => {
    const textWithPII = 'Please verify OTP: 981245 and card 4111 2222 3333 4444';
    const findings = scanSensitiveData(textWithPII);
    expect(findings.length).toBeGreaterThanOrEqual(2);
    const types = findings.map((f) => f.type);
    expect(types).toContain('card');
    expect(types).toContain('otp');
  });

  it('masks sensitive data cleanly', () => {
    const text = 'OTP: 123456 and SSN: 000-12-3456';
    const masked = maskSensitiveData(text);
    expect(masked).not.toContain('123456');
    expect(masked).not.toContain('000-12-3456');
    expect(masked).toContain('[OTP_MASKED]');
    expect(masked).toContain('[GOVT_ID_MASKED]');
  });
});

describe('AnalyzerView Component', () => {
  it('renders the hero headline and analyzer inputs', () => {
    const dummyReport = vi.fn();
    render(<AnalyzerView onOpenReportModal={dummyReport} />);

    expect(
      screen.getByText(/Spot recruitment fraud before it costs you/i)
    ).toBeInTheDocument();

    expect(
      screen.getByPlaceholderText(/Paste the recruiter message/i)
    ).toBeInTheDocument();

    expect(screen.getByText(/Analyze Job Offer/i)).toBeInTheDocument();
  });

  it('triggers client-side sensitive warning and allows mask action', () => {
    const dummyReport = vi.fn();
    render(<AnalyzerView onOpenReportModal={dummyReport} />);

    const textarea = screen.getByPlaceholderText(/Paste the recruiter message/i);
    fireEvent.change(textarea, {
      target: { value: 'Secret code: 998877 and card 4111 2222 3333 4444' },
    });

    expect(screen.getByText(/Sensitive data detected/i)).toBeInTheDocument();
    const maskButton = screen.getByText(/Mask it now/i);
    expect(maskButton).toBeInTheDocument();

    fireEvent.click(maskButton);
    expect((textarea as HTMLTextAreaElement).value).toContain('[CARD_MASKED]');
  });
});
