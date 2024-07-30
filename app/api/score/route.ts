import type { NextApiResponse } from 'next'
import { type NextRequest } from 'next/server'
import { DynamoDBDocument, GetCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { DynamoDB } from '@aws-sdk/client-dynamodb';
import { ReturnValue } from '@aws-sdk/client-dynamodb';

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

export async function GET(request: NextRequest, res: NextApiResponse<Data>) {
  const { searchParams } = new URL(request.url ?? '')
  const userId = searchParams.get('userId')
  if (!userId) {
    return Response.json({ message: 'User ID is required' }, { status: 400 });
  }

  return await getUserScore(userId as string, res);
}

export async function POST(request: NextRequest, res: NextApiResponse<Data>) {
  const { searchParams } = new URL(request.url ?? '')
  const userId = searchParams.get('userId')
  if (!userId) {
    return Response.json({ message: 'User ID is required' }, { status: 400 });
  }

  const body = await request.json()
  const { timestamp, guess } = body
  if (typeof timestamp !== 'number' || typeof guess !== 'boolean') {
    return Response.json({ message: 'Invalid request body' }, { status: 400 });
  }

  return await updateUserScore(userId as string, timestamp, guess, res);
}

const getUserScore = async (userId: string, res: NextApiResponse<Data>) => {
  const params = {
    TableName: 'BTC-guessing-game-scores',
    Key: { userId },
  };

  try {
    const result = await dynamoDB.send(new GetCommand(params));
    const score = result.Item?.score;
    if (!result.Item?.userId) {
      setUserScore(userId, Date.now(), 0, res);
    }
    return Response.json({ score }, {status:200});
  } catch (error) {
    return Response.json({ message: `Error fetching score: ${error}` }, { status: 500 });
  }
};

const setUserScore = async (userId: string, timestamp: number, score: number, res: NextApiResponse<Data>) => {
  const updateParams = {
    TableName: 'BTC-guessing-game-scores',
    Key: { userId },
    UpdateExpression: 'SET score = if_not_exists(score, :start)',
    ExpressionAttributeValues: {
      ':start': 0,
    },
  };

  try {
    const updated = await dynamoDB.send(new UpdateCommand(updateParams));
    const newScore = updated.Attributes?.score || 0;
    return Response.json({ score: newScore }, { status: 200 })
  } catch (error) {
    return Response.json({ message: `Error updating score: ${error}` }, { status: 500 });
  }
};

const updateUserScore = async (userId: string, timestamp: number, guess: boolean, res: NextApiResponse<Data>) => {
  const scoreChange = guess ? 1 : -1;
  const updateParams = {
    TableName: 'BTC-guessing-game-scores',
    Key: { userId },
    UpdateExpression: 'SET score = if_not_exists(score, :start) + :change',
    ExpressionAttributeValues: {
      ':start': 0,
      ':change': scoreChange,
    },
    ReturnValues: ReturnValue.ALL_NEW, // Use the correct enum value
  };

  try {
    const updated = await dynamoDB.send(new UpdateCommand(updateParams));
    const newScore = updated.Attributes?.score || '0';

    return Response.json({ score: parseInt(newScore) }, {status: 200});
  } catch (error) {
    return Response.json({ message: `Error updating score: ${error}` }, {status: 500});
  }
};