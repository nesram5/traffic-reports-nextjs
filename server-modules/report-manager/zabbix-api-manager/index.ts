import logger from '@/config/logger';
import axios from 'axios';

interface ZabbixApiResponse {
    result: any;
    error?: any;
}

interface Host {
    hostid: string;
    name: string;
}

interface Item {
    itemid: string;
    lastvalue: string;
}

export default class ZabbixApiManager {

    private apiUrl: string;
    public token: string = '';

    constructor(apiUrl: string, token: string) {
        this.apiUrl = apiUrl;
        this.token = token;
    }
     
    public async zabbixLogin(username: string, password: string): Promise<void> {
        const payload = {
            jsonrpc: "2.0",
            method: "user.login",
            params: {
                user: username,
                password: password
            },
            id: 1
        };

        try {
            const response = 
                await axios.post < ZabbixApiResponse > 
                ( this.apiUrl, payload,
                    {
                        headers: { 'Content-Type': 'application/json' }
                    }
                );
            this.token = response.data.result;
        } catch (error) {
            logger.error("Error logging into Zabbix:", 
                error instanceof Error ? error.message : 'Unknown error');
            throw error;
        }
    } 
    /* 
      #######################################
      # Functions to obtain ID's from hosts # 
      #######################################
    */
    public async getGroupId(groupName: string): Promise<string> {
        const authToken = this.token;
       
        const payload = {
            jsonrpc: "2.0",
            method: "hostgroup.get",
            params: {
                output: ["groupid"],
                filter: {
                    name: groupName
                }
            },
            auth: authToken,
            id: 1
        };

        try {
            const response = await axios.post<ZabbixApiResponse>(this.apiUrl, payload, {
                headers: { 'Content-Type': 'application/json' }
            });
            //DEBUG
            //console.log(JSON.stringify(response.data));

            return response.data.result[0].groupid;
        } catch (error) {
            logger.error("Error getting group ID:", error instanceof Error ? error.message : 'Unknown error');
            throw error;
        }
    }

    public async getItemIdbyName(itemName: string): Promise<string> {
        const authToken = this.token;
        const payload = {
            jsonrpc: "2.0",
            method: "item.get",
            params: {
                output: ["itemid"],
                filter: {
                    name: itemName
                }
            },
            auth: authToken,
            id: 1
        };

        try {
            const response = await axios.post<ZabbixApiResponse>(this.apiUrl, payload, {
                headers: { 'Content-Type': 'application/json' }
            });
            return response.data.result[0].groupid;
        } catch (error) {
            logger.error("Error getting group ID:", error instanceof Error ? error.message : 'Unknown error');
            throw error;
        }
    }

    public async getItemIdbyIncrementalKey (itemKeyPattern: string ): Promise<string[]> {
        const authToken = this.token;
        let itemsIds: string[] = [];
        let counter = 0;
        try {
            for (let i = 1; i < 38; i++) {
                const itemKey = `${itemKeyPattern}${i}]`;
                const payload = {
                    jsonrpc: "2.0",
                    method: "item.get",
                    params: {
                        output: ["itemid"],
                        search: {
                            key_: itemKey
                        },
                        sortorder: "DESC",
                        limit: 1
                    },
                    auth: authToken,
                    id: 1
                };

                const response = await axios.post<ZabbixApiResponse>(this.apiUrl, payload, {
                    headers: { 'Content-Type': 'application/json' }
                });

                if (response.data.result && response.data.result.length > 0) {
                    const items = response.data.result;
                    itemsIds.push(items[0].itemid);
                } else {
                    counter++;
                    if (counter === 3) break;
                    continue;
                }                
            }
            return itemsIds ? itemsIds : [];
        } catch (error) {
            logger.error("Error getting ItemsIDs:", error instanceof Error ? error.message : 'Unknown error');
            throw error;
        }
    }
    public async getHostsInGroup(groupId: string): Promise<Host[]> {
        const authToken = this.token;
        const payload = {
            jsonrpc: "2.0",
            method: "host.get",
            params: {
                output: ["hostid", "name"],
                groupids: groupId
            },
            auth: authToken,
            id: 1
        };

        try {
            const response = await axios.post<ZabbixApiResponse>(this.apiUrl, payload, {
                headers: { 'Content-Type': 'application/json' }
            });
            return response.data.result;
        } catch (error) {
            logger.error("Error getting hosts in group:", error instanceof Error ? error.message : 'Unknown error');
            throw error;
        }
    }

     /* 
      ##############################
      # Functions to obtain values # 
      ##############################
    */
      public async getItemValue(itemId: string): Promise<string | null> {
        const authToken = this.token;
        const payload = {
            jsonrpc: "2.0",
            method: "item.get",
            params: {
                output: ["lastvalue"],
                itemids: itemId
            },
            auth: authToken,
            id: 1
        };
    
        try {
            const response = await axios.post<ZabbixApiResponse>(this.apiUrl, payload, {
                headers: { 'Content-Type': 'application/json' }
            });
    
            if (response.data.result && response.data.result.length > 0) {
                return response.data.result[0].lastvalue;
            } else {
                console.log(`Item ${itemId}: No value available`);
                return null;
            }
        } catch (error) {
            logger.error("Error getting item value:", error instanceof Error ? error.message : 'Unknown error');
            throw error;
        }
    }
    public async getItemValueFromHostAndItem(        
        hostId: string,
        itemName?: string,
        itemId?: string
    ): Promise<string> {

        const authToken = this.token;

        if (!itemId && !itemName) {
            throw new Error("Please provide either itemName or itemId");
        }
    
        const payload: any = {
            jsonrpc: "2.0",
            method: "item.get",
            params: {
                output: ["lastvalue"],
                hostids: hostId,
            },
            auth: authToken,
            id: 1,
        };
    
        if (itemId) {
            // Search by itemId
            payload.params.itemids = itemId;
        } else if (itemName) {
            // Search by itemName (exact match)
            payload.params.filter = {
                name: itemName,
            };
            //payload.params.sortfield = "lastclock"; // Sort by the latest timestamp
            payload.params.sortorder = "DESC"; // Get the most recent item
            payload.params.limit = 1; // Limit to 1 result
        }
    
        try {
            const response = await axios.post<ZabbixApiResponse>(this.apiUrl, payload, {
                headers: { 'Content-Type': 'application/json' },
            });
    
            if (response.data.result && response.data.result.length > 0) {
                return response.data.result[0].lastvalue || "N/A";
            } else {
                return "N/A"; // No matching item found
            }
        } catch (error) {
            logger.error("Error getting item value:", error instanceof Error ? error.message : 'Unknown error');
            throw error;
        }
    }

    public async getAvgCpuPerHost(): Promise<{hostname: string, cpuUsage: number }[]> {
        const authToken = this.token;
        const outputData: {hostname: string, cpuUsage: number }[] = [];

        const getMKAvgCpu = async (            
            hostId: string, 
            itemKeyPattern: string
        ): Promise<string> => {

            // Function to get the average CPU usage for 37 items
            let totalCpuUtil: number[] = [];
            let counter = 0;    
            try {
                for (let i = 1; i < 38; i++) {
                    const itemKey = `${itemKeyPattern}${i}]`;
                    const payload = {
                        jsonrpc: "2.0",
                        method: "item.get",
                        params: {
                            output: ["itemid", "lastvalue"],
                            hostids: hostId,
                            search: {
                                key_: itemKey
                            },
                            sortorder: "DESC",
                            limit: 1
                        },
                        auth: authToken,
                        id: 1
                    };
    
                    const response = await axios.post<ZabbixApiResponse>(this.apiUrl, payload, {
                        headers: { 'Content-Type': 'application/json' }
                    });
    
                    if (response.data.result && response.data.result.length > 0) {
                        const items = response.data.result;
                        totalCpuUtil.push(parseFloat(items[0].lastvalue));
                    } else {
                        counter++;
                        if (counter === 3) break;
                        continue;
                    }
                }
    
                const avgCpuUtil = totalCpuUtil.reduce((a, b) => a + b, 0) / totalCpuUtil.length;
                return avgCpuUtil.toFixed(1);
            } catch (error) {
                logger.error("Error getting item values:", error instanceof Error ? error.message : 'Unknown error');
                throw error;
            }
        }

        const getData = async (
            groupName: string, 
            
        ): Promise<void> => {     
            
            const groupId = await this.getGroupId(groupName);
            const hosts = await this.getHostsInGroup(groupId);
            //DEGUG
            //console.log(`Found ${hosts.length} hosts in the group.`);
            const date = new Date();
            const dateString = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()} ${date.getHours()}_${date.getMinutes()}`;


            for (const host of hosts) {
                
                if (!host.name) continue;
                
                if (groupName !== "Routers NETCOM Mikrotik") {

                    let searchItem = "CPU utilization";
                    
                    if (groupName === "Routers NETCOM Cisco") {
                        searchItem = "#1: CPU utilization";
                    }

                    let totalCPUUsage = await this.getItemValueFromHostAndItem(host.hostid, searchItem);
                    totalCPUUsage = parseFloat(totalCPUUsage).toFixed(1);
                    outputData.push({hostname: host.name, cpuUsage: Number(totalCPUUsage) | 0});
                    //outputData.push(`${dateString},${host.name},${cpuUtilization}`);
                    continue;                    
                                    
                } 

                let searchItem = "system.cpu.util[hrProcessorLoad.";                
                const totalCPUUsage = await getMKAvgCpu(host.hostid, searchItem);
                outputData.push({hostname: host.name, cpuUsage: Number(totalCPUUsage) | 0});
                
            }
                
        }
        
        const groupNames = [
            "Routers NETCOM Mikrotik",
            "Routers NETCOM Cisco",
            "Routers NETCOM Arista",
            "Routers NETCOM Ocnus"
        ];

        for (const group of groupNames) {
            await getData(group);
        }

        return outputData;
    
    }
}