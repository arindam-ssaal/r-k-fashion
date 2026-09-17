import { z } from "zod"

import { PettyCashHeadSchema } from "../schemas/PettyCashHeadSchema"
import usePettyCashHead from "../store/usePettyCashHead"

export type PettyCashFormFormatterType = z.infer<typeof PettyCashHeadSchema>

const operation = {
  Create: 'I',
  Edit: 'U',
  Delete: 'D',
}

export function PettyCashFormatter( data: PettyCashFormFormatterType,
  id: number | string | null) {
  const mode = usePettyCashHead.getState().mode as 'Create' | 'Edit' | 'Delete'
  const formattedData = {
    pettyCashID: mode === 'Create' ? 0 : id, // Default value, change if needed
    pettyCashCode: data.pettyCashCode ?? '',
    accountCode: data.accountCode ?? '',
    pettyCashName: data.pettyCashName ?? '', //prob
    modeOfOperation: data.modeOfOperation ?? '',
    limit: data.limit ?? '',
    remarks: data.remarks ?? '',
    isActive: data.isActive ? 'Y' : 'N', //prob
    enteredBy: '0', // Default value, change if needed
    usedFor: operation[mode], // Adjust this as required
  }
  return formattedData 
}

 