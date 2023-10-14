import express from 'express';
import { queryEmbedding, uploadEmbedding } from '../controller/embedding';

const embeddedRouter = express.Router();

embeddedRouter.post('/upload', async (req, res) => {
  await uploadEmbedding(req, res);
});

embeddedRouter.post('/query_embedding', async (req, res) => {
  await queryEmbedding(req, res);
});

export default embeddedRouter;
