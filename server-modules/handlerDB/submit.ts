import { CompTrafficData } from '@/server-modules/handlerDB/schema';

async function pushCompiledReport(newTrafficRecord: {}) {
    try {
        
        const result = await CompTrafficData.findOneAndUpdate(
            { deviceId: "compiled_rep" }, 
            {
                $push: { 
                    data: newTrafficRecord
                }
            },
            { new: true, upsert: true } 
        );
    } catch (error) {
        console.error('Error adding data:', error);
    }
}


export  async function submitToDB(simpleResult: string, detailedResult: string) {
    
    const date = new Date();
    
    const dataToInsert = {
        timestamp: date, 
        simpleReport: simpleResult,
        detaildReport: detailedResult

    }
    await pushCompiledReport(dataToInsert);  
}