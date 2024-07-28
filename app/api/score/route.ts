import type { NextApiRequest, NextApiResponse } from 'next'
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb';
import { DynamoDB } from '@aws-sdk/client-dynamodb';

// Initialize DynamoDB Document Client
const dynamoDB = DynamoDBDocument.from(new DynamoDB({
  region: 'eu-central-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
}));

type Data = {
  score?: number;
  message?: string;
};

export async function GET(request: NextApiRequest, res: NextApiResponse<Data>) {
  const { searchParams } = new URL(request.url ?? '')
  const userId = searchParams.get('userId')
  if (!userId) {
    return Response.json({ message: 'User ID is required' }, { status: 400 });
  }

  return await getUserScore(userId as string, res);
}

const getUserScore = async (userId: string, res: NextApiResponse<Data>) => {
  const params = {
    TableName: 'BTC-guessing-game-scores',
    Key: { userId },
  };

  try {
    const result = await dynamoDB.get(params);
    const score = result.Item?.score || 0;
    return Response.json({ score }, {status:200});
  } catch (error) {
    console.error(error);
    return Response.json({ message: 'Error fetching score' }, { status: 500 });
  }
};