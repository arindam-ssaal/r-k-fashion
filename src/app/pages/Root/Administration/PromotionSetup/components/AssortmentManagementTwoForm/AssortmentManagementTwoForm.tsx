// import React from 'react'

//import { useFormContext } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import AssortmentToExclude from './components/AssortmentToExclude'
import AssortmentToInclude from './components/AssortmentToInclude'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'


const formSchema = z.object({
    assortmentType: z.string().min(2).max(50),
    assortmentName: z.string().min(2).max(50),
    description:z.string().optional()
  })

function AssortmentManagementTwoForm() {

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          assortmentType: "",
          assortmentName: "",
          description:""
        },
      })

      function onSubmit(values: z.infer<typeof formSchema>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        console.log(values)
      }

  return (
    <div>
     <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
      <FormField
          control={form.control}
          name="assortmentType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Assortment Type</FormLabel>
              <FormControl>
              <Select onValueChange={field.onChange} defaultValue={field.value || undefined}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Assortment Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="purchase">Purchase</SelectItem>
                      <SelectItem value="gain">Gain</SelectItem>
                      <SelectItem value="both">Both</SelectItem>
                    </SelectContent>
                  </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="assortmentName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Assortment Name</FormLabel>
              <FormControl>
                <Input placeholder="shadcn" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input placeholder="shadcn" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div>
        <Tabs defaultValue="account" className="">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="account">Assortment to Include</TabsTrigger>
        <TabsTrigger value="password">Assortment to Exclude</TabsTrigger>
      </TabsList>
      <TabsContent value="account">
       <AssortmentToInclude/>
      </TabsContent>
      <TabsContent value="password">
     <AssortmentToExclude/>
      </TabsContent>
    </Tabs>
        </div>
        <div className='float-end'>
        <Button type="submit">Submit</Button>
        </div>
      </form>
    </Form>
    </div>
  )
}

export default AssortmentManagementTwoForm
