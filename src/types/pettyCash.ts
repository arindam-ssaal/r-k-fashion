import { PettyCashStatus } from "@/app/pages/Root/Administration/Master/PettyCashHead/components/PettyCashHeadTable/data/tableData"

export type FetchedPettyCashType = {
    pettyCashID: number | null
    pettyCashCode: string | null
    accountCode: string | null
    pettyCashName: string | null
    modeOfOperation: string | null
    limit: number | null
    remarks: string | null
    isActive: PettyCashStatus
    enteredBy: number | null
    usedFor: string | null
}

export type PettyCashResponseType = { returnCode: string; returnMsg: string }[];
