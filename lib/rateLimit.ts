import { LRUCache } from 'lru-cache';

// Rate limit configuration
const SUBMISSION_LIMIT = 3;
const CACHE_MAX_SIZE = 500;
const CACHE_TTL = 1000 * 60 * 60 * 24; // 24 hours

// LRU Cache for tracking IP submission counts
const submissionCache = new LRUCache<string, number>({
  max: CACHE_MAX_SIZE,
  ttl: CACHE_TTL,
});

/**
 * Check if an IP has exceeded the submission limit
 * @param ip - IP address to check
 * @returns true if IP has exceeded limit, false otherwise
 */
export function hasExceededLimit(ip: string): boolean {
  const count = submissionCache.get(ip) || 0;
  return count >= SUBMISSION_LIMIT;
}

/**
 * Increment submission count for an IP
 * @param ip - IP address to increment
 * @returns the new submission count
 */
export function incrementSubmissionCount(ip: string): number {
  const currentCount = submissionCache.get(ip) || 0;
  const newCount = currentCount + 1;
  submissionCache.set(ip, newCount);
  return newCount;
}

/**
 * Get current submission count for an IP
 * @param ip - IP address to check
 * @returns current submission count
 */
export function getSubmissionCount(ip: string): number {
  return submissionCache.get(ip) || 0;
}
