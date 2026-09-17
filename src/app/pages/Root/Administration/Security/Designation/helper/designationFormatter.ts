import { z } from 'zod'

import { designationSchema } from '../components/DesignationForm/schema/designationSchema'

const operations = {
  Create: 'I',
  Edit: 'U',
  Delete: 'D',
  View: 'V',
}

export function designationFormatter(
  data: z.infer<typeof designationSchema>,
  mode: 'Create' | 'View' | 'Edit' | 'Delete',
  id: number | string
) {
  const formData = {
    designationID: mode === 'Create' ? 0 : id,
    designationName: data.designationName,
    remarks: '',
    isActive: 'Y',
    enteredBy: 0,
    usedFor: operations[mode],
  }

  return formData
}
