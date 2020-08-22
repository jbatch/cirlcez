import express from 'express';
import pino from 'pino';

import { wrapExpressPromise } from '../util';

const logger = pino();

// Hosted at /api/blah/
const blahRoutes = express.Router();

type GetBlahRequest = TypedRequest<{}, {}>;
type GetBlahResponse = TypedResponse<{hello: string}>
blahRoutes.get('/', wrapExpressPromise<GetBlahRequest, GetBlahResponse>(async (req, res) => {
  return {hello: 'world'};
}))

export default blahRoutes;