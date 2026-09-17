import { zodResolver } from '@hookform/resolvers/zod'
import { Gift, Calendar, CalendarCheck, TrendingUp, Plus, Trash2, Save, X } from 'lucide-react'
import { useState } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'

// ✅ Zod Schema
const promotionPrioritySetupSchema = z.object({
  rows: z.array(
    z.object({
      promotionName: z.string().min(1, 'Required'),
      fromDate: z.string().min(1, 'Required'),
      toDate: z.string().min(1, 'Required'),
      priority: z.string().min(1, 'Required'),
      active: z.boolean(),
      approvedUser: z.boolean(),
      roles: z.string().optional(),
      assignedCompanies: z.array(z.string()).optional(),
      assignedBranches: z.array(z.string()).optional(),
    })
  ),
})

const PromotionPrioritySetupTable = ({ onCancel }: { onCancel: () => void }) => {
  const [modalClose, setModalClose] = useState(false)

  const form = useForm({
    resolver: zodResolver(promotionPrioritySetupSchema),
    defaultValues: {
      rows: [
        {
          promotionName: 'Debmalya Mukherjee',
          fromDate: '1990-01-01',
          toDate: '2000-03-09',
          priority: '2',
          active: true,
          approvedUser: false,
          roles: 'Accountant',
          assignedCompanies: ['TEST', 'BARASAT'],
          assignedBranches: ['UNIT - 4', 'UNIT - 5'],
        },
      ],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'rows',
  })

  const onSubmit = (data: z.infer<typeof promotionPrioritySetupSchema>) => {
    console.log('Form Submitted -:', data)
  }

  const addRow = () => {
    append({
      promotionName: '',
      fromDate: '',
      toDate: '',
      priority: '',
      active: true,
      approvedUser: false,
      roles: '',
      assignedCompanies: [],
      assignedBranches: [],
    })
  }

  return (
    <div className="p-6 back-white rounded-lg">
      {/* Header Section */}
      <div className="mb-6 pb-4 border-b border-sky-200">
        <div className="flex items-center gap-2">
          <div className="p-2 back-sky-400 rounded-lg">
            <Gift className="w-5 h-5 text-c-white back-sky-400" />
          </div>
          <h2 className="text-lg font-semibold text-c-black">Promotion Priority Setup</h2>
        </div>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(
            onSubmit,
            (errors) => {
              console.error(errors)
            }
          )}
          className="space-y-4"
        >
          {fields.map((field, index) => (
            <div key={field.id} className=" rounded-lg p-5 shadow-sm border border-sky-100">
              <div className="grid grid-cols-4 gap-4 mb-4">
                {/* Promotion Name */}
                <FormField
                  name={`rows.${index}.promotionName`}
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-c-black flex items-center gap-2">
                        <Gift className="w-4 h-4 text-c-white back-sky-400" />
                        Promotion Name
                      </FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter promotion name" 
                          {...field} 
                          className="h-10 border-sky-200 focus:border-sky-400 focus:ring-sky-400"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* From Date */}
                <FormField
                  name={`rows.${index}.fromDate`}
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-c-black flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-c-white back-sky-400" />
                        From Date
                      </FormLabel>
                      <FormControl>
                        <Input 
                          type="date" 
                          placeholder="From Date" 
                          {...field} 
                          className="h-10 border-sky-200 focus:border-sky-400 focus:ring-sky-400"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* To Date */}
                <FormField
                  name={`rows.${index}.toDate`}
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-c-black flex items-center gap-2">
                        <CalendarCheck className="w-4 h-4 text-c-white back-sky-400" />
                        To Date
                      </FormLabel>
                      <FormControl>
                        <Input 
                          type="date" 
                          placeholder="To Date" 
                          {...field} 
                          className="h-10 border-sky-200 focus:border-sky-400 focus:ring-sky-400"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Priority */}
                <FormField
                  name={`rows.${index}.priority`}
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-c-black flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-c-white back-sky-400" />
                        Priority
                      </FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter priority" 
                          {...field} 
                          className="h-10 border-sky-200 focus:border-sky-400 focus:ring-sky-400"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3 justify-end pt-3 border-t border-sky-100">
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={() => remove(index)}
                  className="h-9 border-c-red-200 text-c-white back-red-600 hover-back-red-100:hover"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Remove
                </Button>
                {index === fields.length - 1 && (
                  <Button 
                    type="button" 
                    size="sm"
                    onClick={addRow}
                    className="h-9 bg-sky-500 hover:bg-sky-600 text-white"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Row
                  </Button>
                )}
              </div>
            </div>
          ))}

          <div className="flex justify-end gap-3 pt-6">
            <Button 
              type="submit"
              className="h-10 bg-sky-500 hover:bg-sky-600 text-white shadow-sm"
            >
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setModalClose(true)
                onCancel()
              }}
              className="h-10 border-c-red-200 text-c-white back-red-600 hover-back-red-100:hover"
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

export default PromotionPrioritySetupTable
