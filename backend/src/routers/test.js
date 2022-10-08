import express from 'express';

const testRouter = express.Router();

testRouter.get('/internalError/sync', () => {
  throw new Error('Fake internal error');
});

testRouter.get('/internalError/async', async () => {
  throw new Error('Fake internal error');
});

export default testRouter;
