import { saveToLog } from "../logger/log";
import { ICheckValues, ICheckedValues } from '@/lib/types';
/*
export function checkResults(summarizedData: any, uniqueTypes: any, toCheckValues: ICheckValues): boolean {
    
    let totalToCheck: { [name: string] : {value: number} } = {};
    
    for (const type of uniqueTypes) {
        let key: string = "results";
        if (summarizedData[type]) {
            for (const group in summarizedData[type]) {
                const { group: groupName, mbps } = summarizedData[type][group];
                let mbpsValue = Math.abs(Math.round(mbps));                 
                totalToCheck[groupName] = { value: Number(mbpsValue)} 
            };            
        };
    }
    const toEvaluation = extractValuesFromResult(totalToCheck, toCheckValues);
    /const results = checkValues(toEvaluation);
    for (const value of results) {
        if (value) {
            return true;
        }
   
    return false;
}

function checkValues(toEvaluation: ICheckedValues ): boolean[] {
    const results: boolean[] = [];
    for (const key in toEvaluation) {
        results.push(checkDifference(toEvaluation[key].main, toEvaluation[key].secondary, toEvaluation[key].percentage));
    }
    return results;
}

function checkDifference(main: number, secondary: number, percentage: number ): boolean {
    const percentValue = percentage * main;
    const difference = Math.abs(main - secondary);
    saveToLog(`check results: `);
    saveToLog(`${difference >= percentValue}`);
    return difference >= percentValue;
}


function extractValuesFromResult
    (input: { [name: string] : {value: number} }, 
    toCheckValues: ICheckValues
    ): ICheckedValues {
        
    const result: ICheckedValues = {};
    let tempMain: number = 0;
    let tempSecondary: number = 0;


    for (const key in toCheckValues) {
        const percentage = toCheckValues[key].percentage;
        const sum = toCheckValues[key].sum;
        if (!sum){
            for (const name in input){
                if(name === toCheckValues[key].main){
                    tempMain = input[name].value;
                }
                if(name === toCheckValues[key].secondary){
                    tempSecondary = input[name].value;
                    break;
                }
            }
        } else {
            for (const name in input){
                if(name === toCheckValues[key].main){
                    tempMain = input[name].value;
                }
                if(name === toCheckValues[key].secondary[0]){
                    tempSecondary = input[name].value;
                }
                if(name === toCheckValues[key].secondary[1]){
                    tempSecondary += input[name].value;
                    break;
                }
            }
        }
        if ( tempMain && tempSecondary ) {
            result[key] = {
                main: tempMain,
                secondary: tempSecondary,
                sum: sum,
                percentage: percentage
            };
        } else {
            throw new Error(`Could not extract values for key: ${key}`);
        }
    }
    saveToLog(`${JSON.stringify(result)}`)
    return result;
    
}
*/