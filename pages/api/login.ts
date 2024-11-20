import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { NEXT_PUBLIC_USERNAME, NEXT_PUBLIC_PASSWORD } = process.env;
  if (req.method === 'POST') {
    const { username, password } = req.body;
    if (username === NEXT_PUBLIC_USERNAME && password === NEXT_PUBLIC_PASSWORD) {
      res.status(200).json({ success: true });
    } else {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
