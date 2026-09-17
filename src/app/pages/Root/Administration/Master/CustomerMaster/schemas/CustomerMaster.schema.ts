import { z } from "zod";

import { CommunicationTabSchema } from "./CommunicationTab.schema";
import { MembershipTabSchema } from "./MembershipTab.schema";
import { personalTabSchema } from "./PersonalTab.schema";


export const CustomerMasterSchema = z.object({
    personal: personalTabSchema, // Store details form schema
    communication: CommunicationTabSchema,          // Logistics form schema
    membership: MembershipTabSchema,          // Logistics form schema
  });
  