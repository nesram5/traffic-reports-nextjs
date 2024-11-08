import * as fs from 'fs';
import * as path from 'path';

let modTime: any;
const trafficDataCache = path.join(process.cwd(), 'cache/trafficDataCache.json');

// Function to get the last modification time of a file
function getFileModificationTime(): Date {
    try {
        const stats = fs.statSync(trafficDataCache);
        return stats.mtime;
      } catch (error) {
        console.error('Error getting file modification time:', error);
        throw error; // Re-throw the error to handle it at the calling site
      }
    }

// Function to check if a file has changed
export function checkIfCacheHasChanged(): boolean {
  const threshold = 60000;
  try {
    const storedModificationTime = getModtime();
    const currentModificationTime = getFileModificationTime();
    const diff = Math.abs(currentModificationTime.getTime() - storedModificationTime.getTime());
    return diff < threshold;
  } catch (error) {
    console.error('Error checking file:', error);
    return false;
  }
}

export async function setCurrentModtime(){
    modTime = getFileModificationTime();
}

function getModtime(){
    return modTime;
}