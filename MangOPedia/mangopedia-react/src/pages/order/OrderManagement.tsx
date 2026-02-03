import { useState, type FormEvent } from 'react';
import OrderTable from '../../components/orders/OrderTable';
import { useGetOrdersQuery, useUpdateOrderMutation, type Order } from '../../store/api/ordersApi';
import { ORDER_STATUS_OPTIONS, ROLES } from '../../utility/constants';
import OrderDetailsModal, { type UpdateDataModal } from '../../components/orders/OrderDetailsModal';
import { useAppSelector } from '../../store/store';
import { toast } from 'react-toastify';

function OrderManagement() {
  const { user } = useAppSelector((state) => state.auth);
  const isAdmin = user?.role === ROLES.ADMIN;

  let userId = '';
  if (!isAdmin && user) {
    userId = user.id;
  }

  const { data = [], isLoading, error, refetch } = useGetOrdersQuery(userId);
  const orders: Order[] = data;
  const [updateOrder] = useUpdateOrderMutation();
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [searchFilter, setSearchFilter] = useState('');
  const [updateData, setUpdateData] = useState<UpdateDataModal>({ status: '' });

  const handleEditOrder = async (order: Order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedOrder(null);
  };

  const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (!selectedOrder || !isAdmin) {
        toast.error('You do not have permission to update orders');
        setIsSubmitting(false);
        return;
      }
      const result = await updateOrder({
        orderId: selectedOrder.orderHeaderId,
        orderData: { status: updateData.status, orderHeaderId: selectedOrder.orderHeaderId },
      });
      if (result.data.isSuccess) {
        toast.success('Order updated successfully');
        setSelectedOrder(null);
        setUpdateData({ status: '' });
        refetch();
      } else {
        toast.error('Failed to update order');
      }
      setShowModal(false);
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredOrders = orders.filter((order) => {
    const statusMatch = statusFilter ? order.status === statusFilter : true;
    const searchMatch = searchFilter
      ? order.pickUpName.toLowerCase().includes(searchFilter.toLowerCase()) ||
        order.pickUpEmail.toLowerCase().includes(searchFilter.toLowerCase()) ||
        order.pickUpPhoneNumber.toLowerCase().includes(searchFilter.toLowerCase())
      : true;

    return statusMatch && searchMatch;
  });

  return (
    <div className='container-fluid p-4 mx-3'>
      <div className='row mb-4'>
        <div className='col'>
          <div className='d-flex justify-content-between align-items-center'>
            <div>
              <h2>Order Management</h2>
              <p className='text-muted mb-0'>Manage your restaurant's orders</p>
            </div>
            <div className='d-flex align-items-center gap-3'>
              <div>
                <label className='form-label small fw-semibold text-uppercase text-muted mb-1'>
                  Search Customer
                </label>
                <input
                  type='text'
                  className='form-control'
                  placeholder='Search by name, email, or phone...'
                  style={{ minWidth: '350px' }}
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                />
              </div>
              <div>
                <label className='form-label small fw-semibold text-uppercase text-muted mb-1'>
                  Filter by Status
                </label>
                <select
                  className='form-select'
                  style={{ minWidth: '200px' }}
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value=''>All Orders</option>
                  {ORDER_STATUS_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='row'>
        <div className='col'>
          <div className='card'>
            <div className='card-body'>
              <OrderTable
                orders={filteredOrders}
                isLoading={isLoading}
                error={error}
                onEdit={handleEditOrder}
              />
            </div>
          </div>
        </div>
      </div>
      {showModal && (
        <OrderDetailsModal
          onClose={handleCloseModal}
          isSubmitting={isSubmitting}
          order={selectedOrder}
          onSubmit={handleFormSubmit}
          updateData={updateData}
          onUpdateDataChange={setUpdateData}
          isAdmin={isAdmin}
        />
      )}
    </div>
  );
}
export default OrderManagement;
