/**
 * Application-wide constants for breakpoints, delays, and limits.
 * Centralizes magic numbers for easier tuning and maintainability.
 */

/** Mobile breakpoint (px) - sidebar switches to sheet below this width */
export const MOBILE_BREAKPOINT_PX = 1024

/** Delay (ms) before auto-starting onboarding tour */
export const TOUR_AUTO_START_DELAY_MS = 1500

/** Max streak count to show onboarding tour (0–5 = new users) */
export const TOUR_STREAK_THRESHOLD = 5

/** Max words for AI response truncation */
export const AI_RESPONSE_MAX_WORDS = 300

/** Max words in AI prompt context */
export const AI_PROMPT_MAX_WORDS = 500

/** Max error lines to show in console output */
export const CONSOLE_ERROR_LINES_MAX = 10
