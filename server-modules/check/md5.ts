import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

let previousMd5: string | null = null;
const filePath = path.join(process.cwd(), 'cache/trafficDataCache.json');

/**
 * Calculates the MD5 sum of a file.
 * @param filePath - The path to the file.
 * @returns The MD5 sum as a hexadecimal string.
 */
function calculateMd5(filePath: string): Promise<string> {
    return new Promise((resolve, reject) => {
        const hash = crypto.createHash('md5');
        const stream = fs.createReadStream(filePath);

        stream.on('data', (data: string) => {
            hash.update(data);
        });

        stream.on('end', () => {
            const md5sum = hash.digest('hex');
            resolve(md5sum);
        });

        stream.on('error', (error) => {
            reject(error);
        });
    });
}

/**
 * Sets the previously stored MD5 sum.
 * @param md5 - The MD5 sum to store.
 */
export function setPreviousMd5(md5: string): void {
    previousMd5 = md5;
}

/**
 * Gets the previously stored MD5 sum.
 * @returns The previously stored MD5 sum, or null if not set.
 */
export function getPreviousMd5(): string | null {
    return previousMd5;
}

/**
 * Checks if the MD5 sum of a file has changed.
 * @param filePath - The path to the file.
 * @returns A boolean indicating whether the file has changed.
 */
export async function hasFileChanged(): Promise<boolean> {
    try {
        const currentMd5 = await calculateMd5(filePath);
        const previousMd5 = getPreviousMd5();
        return currentMd5 !== previousMd5;
    } catch (error) {
        console.error('Error checking file MD5:', error);
        return false;
    }
}

// Example usage
export async function initialMd5(){
    const initialMd5 = await calculateMd5(filePath);
    setPreviousMd5(initialMd5);
};