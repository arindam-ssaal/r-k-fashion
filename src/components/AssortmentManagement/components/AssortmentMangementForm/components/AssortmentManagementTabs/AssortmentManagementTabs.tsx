import { Search, Package, FileText, Tag, CheckCircle2, Copy, Eye, ListPlus, ListX } from 'lucide-react'
import { useFormContext } from 'react-hook-form'

import { useAssortmentManagementStore } from '../../../../store/useAssortmentManagementStore'
import AssortmentExcluded from '../AssortmentExcluded'
import AssortmentIncluded from '../AssortmentIncluded'
import AssortmentSelectionModal from '../AssortmentSelectionModal'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

function AssortmentManagementTab() {
  const form = useFormContext()
  const openListModal = useAssortmentManagementStore((state) => state.toggleOpen2)

  const assortmentName = form.watch('assortmentName')

  return (
    <div className="p-6 rounded-lg shadow-sm">
      {/* Header Section */}
      <div className="mb-6 pb-4 border-b border-sky-200">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg" style={{ backgroundColor: 'rgba(14, 116, 144, 0.9)' }}>
            <Package className="w-5 h-5 text-sky-600" />
          </div>
          <h2 className="text-lg font-semibold" style={{ color: '#1E3A8A' }}>Assortment Details</h2>
        </div>
      </div>

      {/* Form Fields Section */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-sky-100 mb-6">
        <div className="grid grid-cols-2 gap-8">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="assortmentName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Tag className="w-4 h-4 text-sky-600" />
                    Assortment Name
                  </FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter assortment name" 
                      {...field} 
                      className="h-10 border-sky-200 focus:border-sky-400 focus:ring-sky-400" 
                    />
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
                  <FormLabel className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-sky-600" />
                    Description
                  </FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter description" 
                      {...field} 
                      className="h-10 border-sky-200 focus:border-sky-400 focus:ring-sky-400" 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-4">
            <FormField
              control={form.control}
              name="typeOfAssortment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Package className="w-4 h-4 text-sky-600" />
                    Assortment Type
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="h-10 border-sky-200 focus:border-sky-400 focus:ring-sky-400">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="P">Paid For Assortment</SelectItem>
                      <SelectItem value="B">Benefit For Assortment</SelectItem>
                      <SelectItem value="C">Both</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-3 space-y-0 rounded-lg border border-sky-100 bg-sky-50 p-4">
                  <FormControl>
                    <Checkbox 
                      checked={field.value} 
                      onCheckedChange={field.onChange}
                      className="border-sky-400 data-[state=checked]:bg-sky-500 data-[state=checked]:border-sky-500"
                    />
                  </FormControl>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-sky-600" />
                    <FormLabel className="text-sm font-medium text-gray-700 cursor-pointer">In Active</FormLabel>
                  </div>
                </FormItem>
              )}
            />
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="bg-white rounded-lg shadow-sm border border-sky-100">
        <Tabs defaultValue="included" className="w-full">
          <TabsList className="w-full grid grid-cols-2 bg-sky-50 h-12 p-1 rounded-t-lg">
            <TabsTrigger 
              value="included" 
              className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-sky-700 data-[state=active]:shadow-sm"
            >
              <ListPlus className="w-4 h-4" />
              <span className="text-sm font-medium">Include Items</span>
            </TabsTrigger>
            <TabsTrigger 
              value="excluded"
              className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-sky-700 data-[state=active]:shadow-sm"
            >
              <ListX className="w-4 h-4" />
              <span className="text-sm font-medium">Exclude Items</span>
            </TabsTrigger>
          </TabsList>
          
          {/* Search and Action Bar */}
          <div className="flex items-center justify-between gap-4 p-4 bg-gradient-to-r from-sky-50 to-blue-50 border-b border-sky-100">
            <div className="flex items-center gap-3 flex-1 max-w-md">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input 
                  placeholder="Search items..." 
                  disabled={!assortmentName} 
                  className="h-10 pl-10 border-sky-200 focus:border-sky-400 focus:ring-sky-400 bg-white" 
                />
              </div>
              <Button 
                size="icon" 
                type="button" 
                onClick={openListModal} 
                disabled={!assortmentName}
                className="h-10 w-10 bg-sky-500 hover:bg-sky-600 text-white shadow-sm"
              >
                <Search className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="flex items-center gap-3">
              <Button 
                type="button" 
                variant="outline"
                className="h-10 border-sky-200 hover:bg-sky-50 hover:border-sky-300 text-gray-700"
              >
                <Eye className="w-4 h-4 mr-2" />
                Show Items
              </Button>
              <Button 
                type="button" 
                variant="outline"
                className="h-10 border-sky-200 hover:bg-sky-50 hover:border-sky-300 text-gray-700"
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy Assortment
              </Button>
            </div>
          </div>

          <TabsContent value="included" className="p-4 m-0">
            <AssortmentIncluded />
          </TabsContent>
          <TabsContent value="excluded" className="p-4 m-0">
            <AssortmentExcluded />
          </TabsContent>
        </Tabs>
      </div>

      <AssortmentSelectionModal />
    </div>
  )
}

export default AssortmentManagementTab
