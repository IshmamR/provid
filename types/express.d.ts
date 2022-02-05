/* eslint-disable @typescript-eslint/naming-convention */

import { IClientDocument } from "../server/db/models/client";

interface Locals {
  client?: IClientDocument & { _id: any };
}

declare module "express" {
  export interface Response {
    locals: Locals;
  }
}
