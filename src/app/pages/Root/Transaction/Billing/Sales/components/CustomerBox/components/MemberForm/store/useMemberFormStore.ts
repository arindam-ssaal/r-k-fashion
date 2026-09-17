import { create } from 'zustand'

interface MemberState {
  phoneNo: string | null
  memberId: string | null
  memberName: string | null
  saveMemberInfo: (
    phoneNo: string | null,
    memberId: string | null,
    memberName: string | null
  ) => void
}

const useMemberStore = create<MemberState>((set) => ({
  phoneNo: null,
  memberId: null,
  memberName: null,
  saveMemberInfo: (phoneNo, memberId, memberName) => set({ phoneNo, memberId, memberName }),
}))

export default useMemberStore
