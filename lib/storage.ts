import fs from 'fs/promises';
import path from 'path';
import { formatInTimeZone } from 'date-fns-tz';
import type { TimestampedEntry } from './types';

const TIMEZONE = 'Asia/Seoul';
const DATA_DIR = path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'submissions.json');

/**
 * Ensure data directory exists
 */
async function ensureDataDir() {
  try {
    await fs.access(DATA_DIR);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
  }
}

/**
 * Read all submissions from file
 */
async function readSubmissions(): Promise<TimestampedEntry[]> {
  try {
    await ensureDataDir();
    const data = await fs.readFile(DATA_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    // File doesn't exist yet, return empty array
    return [];
  }
}

/**
 * Write submissions to file
 */
async function writeSubmissions(submissions: TimestampedEntry[]): Promise<void> {
  await ensureDataDir();
  await fs.writeFile(DATA_FILE, JSON.stringify(submissions, null, 2), 'utf-8');
}

/**
 * Add a new submission
 * @param entry - The entry to add (unitNumber and firstName)
 * @returns Promise that resolves when save is complete
 */
export async function addSubmission(entry: { unitNumber: number; firstName: string }): Promise<void> {
  // Generate Korean Standard Time timestamp
  const timestamp = formatInTimeZone(new Date(), TIMEZONE, 'yyyy-MM-dd HH:mm:ss');

  const newEntry: TimestampedEntry = {
    ...entry,
    timestamp,
  };

  // Read existing submissions
  const submissions = await readSubmissions();

  // Add new submission
  submissions.push(newEntry);

  // Write back to file
  await writeSubmissions(submissions);
}

/**
 * Get all submissions
 * @returns Promise that resolves with all submissions
 */
export async function getAllSubmissions(): Promise<TimestampedEntry[]> {
  return await readSubmissions();
}

/**
 * Get submission count
 * @returns Promise that resolves with total number of submissions
 */
export async function getSubmissionCount(): Promise<number> {
  const submissions = await readSubmissions();
  return submissions.length;
}
