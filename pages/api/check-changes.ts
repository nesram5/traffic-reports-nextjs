import type { NextApiRequest, NextApiResponse } from 'next';
import { hasFileChanged } from '@/server-modules/check/md5';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try{
        const hasChanged = await hasFileChanged();
        res.status(200).json({ hasChanged });
    } catch (error) {
        console.error('Error checking file change:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}