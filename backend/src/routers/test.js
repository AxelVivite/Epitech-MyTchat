import express from 'express';

const testRouter = express.Router();

testRouter.get('/internalError/sync', (req, res) => {
  throw new Error('Fake internal error')
});

testRouter.get('/internalError/async', async (req, res) => {
  throw new Error('Fake internal error')
});

export default testRouter;
