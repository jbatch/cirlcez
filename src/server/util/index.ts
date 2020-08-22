import express from 'express';
import core from 'express-serve-static-core';
import { ServiceError } from '../error/service-error';

function wrapExpressPromise<RequestType extends TypedRequest, ResponseType>(
  /**
   * RequestType & Express.Request & core.Request<core.ParamsDictionary, {}, {}>
   * combines our generic type (setting body and params types on request). Express.Request
   * sets the fields added by session-middleware and passport and core.Request adds
   * all the fields on a standard express request object. We have to remove the query field from
   * the express core.Request so the any they set doesn't override our types.
   */
  fn: (
    req: RequestType & Express.Request & Omit<core.Request<core.ParamsDictionary, {}, {}>, 'query'>,
    res: express.Response
  ) => Promise<ResponseType>
) {
  return async (handlerReq: RequestType, handlerRes: express.Response, next: express.NextFunction) => {
    try {
      const response = await fn(handlerReq as any, handlerRes);
      handlerRes.json(response);
    } catch (err) {
      next(err);
    }
  };
}

function assertFound(thing: any, msg?: string) {
  if (thing != null) {
    return;
  }
  const errorMessage = msg ? msg : 'Not Found';
  throw new ServiceError(errorMessage, 404);
}

export { wrapExpressPromise, assertFound };