import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { NextRequest } from 'next/server';
import { NextApiResponse } from 'next';
import { DynamoDBDocumentClient, GetCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { mockClient } from 'aws-sdk-client-mock';
import { GET, POST } from '@/app/api/score/route';

const dynamoMock = mockClient(DynamoDBDocumentClient);

describe('API /api/score', () => {
  beforeEach(() => {
    dynamoMock.reset();
  });

  describe('GET /api/score', () => {
    it('should fetch the user score from DynamoDB', async () => {
      const userId = 'test-user-id';
      const req = new NextRequest(`http://localhost/api/score?userId=${userId}`);

      // Mocking the DynamoDB response
      dynamoMock.on(GetCommand, {
        TableName: 'BTC-guessing-game-scores',
        Key: { userId },
      }).resolves({
        Item: { userId, score: 10 },
      });

      // Mock Response object
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      } as unknown as NextApiResponse;

      const response = await GET(req, res);

      expect(response.status).toBe(200);
      expect(await response.json()).toEqual({ score: 10 });
      expect(dynamoMock).toHaveReceivedCommandWith(GetCommand, {
        TableName: 'BTC-guessing-game-scores',
        Key: { userId },
      });
    });


    it('should handle missing user ID', async () => {
      const req = new NextRequest('http://localhost/api/score');

      // Mock Response object
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      } as unknown as NextApiResponse;

      const response = await GET(req, res);

      expect(response.status).toBe(400);
      expect(await response.json()).toEqual({ message: 'User ID is required' });
    });
  });

  describe('POST /api/score', () => {
    it('should update the user score in DynamoDB', async () => {
      const userId = 'test-user-id';
      const body = { guess: true, timestamp: Date.now() };
      const req = new NextRequest(`http://localhost/api/score?userId=${userId}`, {
        method: 'POST',
        body: JSON.stringify(body),
      });

      // Mocking the DynamoDB response
      dynamoMock.on(UpdateCommand, {
        TableName: 'BTC-guessing-game-scores',
        Key: { userId },
        UpdateExpression: 'SET score = if_not_exists(score, :start) + :change',
        ExpressionAttributeValues: {
          ':start': 0,
          ':change': 1,
        },
        ReturnValues: 'ALL_NEW',
      }).resolves({
        Attributes: { userId, score: 11 },
      });

      // Mock Response object
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      } as unknown as NextApiResponse;

      const response = await POST(req, res);

      expect(response.status).toBe(200);
      expect(await response.json()).toEqual({ score: 11 });
      expect(dynamoMock).toHaveReceivedCommandWith(UpdateCommand, {
        TableName: 'BTC-guessing-game-scores',
        Key: { userId },
        UpdateExpression: 'SET score = if_not_exists(score, :start) + :change',
        ExpressionAttributeValues: {
          ':start': 0,
          ':change': 1,
        },
        ReturnValues: 'ALL_NEW',
      });
    });

    it('should handle invalid request body', async () => {
      const userId = 'test-user-id';
      const req = new NextRequest(`http://localhost/api/score?userId=${userId}`, {
        method: 'POST',
        body: JSON.stringify({}),
      });

      // Mock Response object
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      } as unknown as NextApiResponse;

      const response = await POST(req, res);

      expect(response.status).toBe(400);
      expect(await response.json()).toEqual({ message: 'Invalid request body' });
    });
  });
});
