import { z } from 'zod';

import { DocuemntSeriesschema } from './documentSeries.schema';
import { LedgersSchema } from './ledgers.schema';
import { logisticsScema } from './logistics.schema';
import { Mopschema } from './mop.schema';
import { PettyCashschema } from './pettyCash.scema';
import { storeDetailFormSchema } from './storeDetail.schema';



// Define combined schema
export const combinedSchema = z.object({
  storeDetail: storeDetailFormSchema, // Store details form schema
  logistics: logisticsScema,          // Logistics form schema
  mop: Mopschema,              // MOP details schema (array support included)
  pettyCash: PettyCashschema,         // Petty cash details schema (array support included)
  documentSeries: DocuemntSeriesschema, // Document series schema
  ledgers: LedgersSchema,             // Ledgers schema (array support included)
});
