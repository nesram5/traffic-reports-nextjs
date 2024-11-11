import { NextApiRequest, NextApiResponse } from 'next';
import { User } from '@/modules/handlerDB/schema';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { username, password } = req.body;
    try {
      const user = await User.findOne({ username, password });
      if (user) {
        res.status(200).json({ success: true });
      } else {
        res.status(200).json({ success: false, message: 'Invalid credentials' });
      }
    } catch (err) {
      res.status(500).json({ success: false, message: 'Server error' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
