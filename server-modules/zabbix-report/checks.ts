import fs from 'fs';
import path from 'path';

let toCheckValues: any;

export function checkResults(simpleResult: string, toCheckValues: { [key: string]: { main: string, secondary: string, percentage: number } }): boolean {
    const toEvaluation = extractValuesFromResult(simpleResult, toCheckValues);
    const results = checkValues(toEvaluation);
    for (const value of results) {
        if (value) {
            return true;
        }
    }
    return false;
}

function checkValues(toEvaluation: { [key: string]: { main: number, secondary: number, percentage: number } }): boolean[] {
    const results: boolean[] = [];
    for (const key in toEvaluation) {
        results.push(checkDifference(toEvaluation[key].main, toEvaluation[key].secondary, toEvaluation[key].percentage));
    }
    return results;
}

function checkDifference(main: number, secondary: number, percentage: number ): boolean {
    const percentValue = percentage * main;
    const difference = Math.abs(main - secondary);
    return difference <= percentValue;
}

function generateRegex(input: string): RegExp {
    // Escape special characters in the input string, including the backtick (`)
    const escapedInput = input.replace(/[.*+?^${}()|[\]\\`]/g, '\\$&');
    // Construct the regular expression pattern
    const regexPattern = `${escapedInput}.*?(\\d+\\.\\d+) Mbps`;
    return new RegExp(regexPattern);
}


function extractValuesFromResult(input: string, toCheckValues: { [key: string]: { main: string, secondary: string, percentage: number } }): { [key: string]: { main: number, secondary: number, percentage: number } } {
    const result: { [key: string]: { main: number, secondary: number, percentage: number } } = {};

    for (const key in toCheckValues) {
        const mainRegex = generateRegex(toCheckValues[key].main);
        const secondaryRegex = generateRegex(toCheckValues[key].secondary);
        const percentage = toCheckValues[key].percentage;

        const mainMatch = input.match(mainRegex);
        const secondaryMatch = input.match(secondaryRegex);
        if (mainMatch && secondaryMatch) {
            result[key] = {
                main: parseFloat(mainMatch[1]),
                secondary: parseFloat(secondaryMatch[1]),
                percentage: percentage
            };
        } else {
            throw new Error(`Could not extract values for key: ${key}`);
        }
    }

    return result;
}

export function fetchCheckValues(){
    toCheckValues = fs.readFileSync(path.join(process.cwd(), 'data/to_check_values.json'));
}

export function getCheckValues(): { [key: string]: { main: string, secondary: string, percentage: number } } {
    return toCheckValues;
}

export function updateCheckValues(toCheckValuesUpdated: any){
    toCheckValues = toCheckValuesUpdated;
}