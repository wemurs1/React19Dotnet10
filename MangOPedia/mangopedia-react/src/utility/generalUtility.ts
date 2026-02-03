import { ORDER_STATUS_OPTIONS } from './constants';

export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-gb', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const getOrderStatusColor = (status: string) => {
  const statusOptions = ORDER_STATUS_OPTIONS.find((option) => option.value === status);
  return statusOptions?.color || 'secondary';
};
