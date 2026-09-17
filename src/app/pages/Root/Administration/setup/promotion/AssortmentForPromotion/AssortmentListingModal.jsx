import React, { useState, useEffect } from 'react';
import DataTableLight from '@/components/DataTable/DataTableLight';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useCookies } from 'react-cookie';
import { GetAPI } from '@/services/apiCall';
import { Eye, Edit } from 'lucide-react';

const AssortmentListingModal = ({ isOpen, onClose, onEdit }) => {
  const [cookies] = useCookies();
  const [assortments, setAssortments] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchAssortments();
    }
  }, [isOpen]);

  const fetchAssortments = async () => {
    try {
      setLoading(true);
      const PJsonData = {};
      const response = await GetAPI(
        '/api/assortment/GetAllAssortment?AssortmentID=0&AssortmentType=P',
        '',
        PJsonData,
        cookies
      );
      
      if (response && response.data) {
        setAssortments(response.data);
      }
    } catch (error) {
      console.error('Error fetching assortments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleView = async (row) => {
    try {
      const PJsonData = {};
      const response = await GetAPI(
        `/api/assortment/Getassortment?AssortmentID=${row.assortmentID}`,
        '',
        PJsonData,
        cookies
      );
      
      if (response && response.data) {
        onEdit(response.data);
        onClose();
      }
    } catch (error) {
      console.error('Error fetching assortment details:', error);
    }
  };

  const columns = [
    {
      field: 'assortmentID',
      headerName: 'ID',
      width: 80,
    },
    {
      field: 'assortmentName',
      headerName: 'Assortment Name',
      width: 200,
    },
    {
      field: 'typeOfAssortment',
      headerName: 'Type',
      width: 100,
      cellRenderer: (value) => (
        <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-semibold rounded" 
          style={{
            background: value === 'C' ? 'rgba(0,137,181,0.15)' : 'rgba(245,158,11,0.15)',
            color: value === 'C' ? '#0089b5' : '#f59e0b',
            border: `1px solid ${value === 'C' ? 'rgba(0,137,181,0.3)' : 'rgba(245,158,11,0.3)'}`
          }}>
          {value}
        </span>
      ),
    },
    {
      field: 'assortmentModel',
      headerName: 'Model',
      width: 100,
      cellRenderer: (value) => (
        <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-semibold rounded" 
          style={{
            background: 'rgba(0,137,181,0.15)',
            color: '#0089b5',
            border: '1px solid rgba(0,137,181,0.3)'
          }}>
          {value === 'D' ? 'Dynamic' : value === 'P' ? 'Preset' : value}
        </span>
      ),
    },
    {
      field: 'itemGroup',
      headerName: 'Item Group',
      width: 150,
    },
    {
      field: 'brandName',
      headerName: 'Brand',
      width: 150,
    },
    {
      field: 'promotion',
      headerName: 'Promotion',
      width: 150,
    },
    {
      field: 'isActive',
      headerName: 'Status',
      width: 100,
      cellRenderer: (value) => {
        const isActive = value === 'Y';
        return (
          <span className="inline-flex items-center gap-2 px-2 py-1 text-xs font-semibold rounded" 
            style={{
              background: isActive ? 'rgba(34,197,94,0.15)' : 'rgba(245,158,11,0.15)',
              color: isActive ? '#22c55e' : '#f59e0b',
              border: `1px solid ${isActive ? 'rgba(34,197,94,0.3)' : 'rgba(245,158,11,0.3)'}`
            }}>
            <span style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: isActive ? '#22c55e' : '#f59e0b'
            }} />
            {isActive ? 'Active' : 'Inactive'}
          </span>
        );
      },
    },
  ];

  const actions = [
    {
      icon: <Eye size={16} />,
      title: 'View Details',
      onClick: handleView,
      variant: 'primary',
    },
    {
      icon: <Edit size={16} />,
      title: 'Edit',
      onClick: handleView,
      variant: 'success',
    },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] w-full h-[90vh] p-0" style={{ maxWidth: '1400px' }}>
        <DialogHeader className="px-6 pt-6 pb-4" style={{ background: '#ffffff', borderBottom: '1px solid #cbd5e1' }}>
          <DialogTitle className="text-xl font-bold" style={{ color: '#0089b5' }}>
            Assortment For Promotion - List
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-hidden" style={{ background: '#d6eaf8' }}>
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-solid border-current border-r-transparent" style={{ color: '#0089b5' }}></div>
                <p className="mt-4 text-sm" style={{ color: '#6b7280' }}>Loading assortments...</p>
              </div>
            </div>
          ) : (
            <DataTableLight
              columns={columns}
              rowData={assortments}
              rowIdField="assortmentID"
              actions={actions}
              searchPlaceholder="Search assortments..."
              defaultPageSize={20}
              pageSizeOptions={[10, 20, 30, 50]}
              emptyMessage="No assortments found"
              emptySubMessage="Create a new assortment to get started."
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AssortmentListingModal;
