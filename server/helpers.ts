import { NextFunction, Response, Request } from 'express'

export function asyncWrapper(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<void>
) {
  return function (req: Request, res: Response, next: NextFunction): void {
    fn(req, res, next).catch((e) => {
      res.send({ status: 500, error: e.message || e })
    })
  }
}
