import { useState, type ChangeEvent } from 'react';
import MenuItemModal from '../../components/menuItem/MenuItemModal';
import MenuItemTable from '../../components/menuItem/MenuItemTable';
import {
  useGetMenuItemsQuery,
  type MenuItem,
  type MenuItemForm,
} from '../../store/api/menuItemApi';

function MenuItemManagement() {
  const { data: menuItems = [] as MenuItem[], isLoading, error, refetch } = useGetMenuItemsQuery();

  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<MenuItemForm>({
    name: '',
    description: '',
    specialTag: '',
    category: '',
    price: '',
    image: null,
  });

  const handleFormSubmit = (formData: MenuItemForm) => {
    setIsSubmitting(true);
    try {
      // call api to create
      console.log(formData);
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (
    e:
      | ChangeEvent<HTMLInputElement>
      | ChangeEvent<HTMLTextAreaElement>
      | ChangeEvent<HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    console.log(name, value);
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div className='container-fluid p-4 mx-3'>
      <div className='row mb-4'>
        <div className='col'>
          <div className='d-flex justify-content-between align-items-center'>
            <div>
              <h2>Menu Item Management</h2>
              <p className='text-muted mb-0'>Manage your restaurant's menu items</p>
            </div>
            <button className='btn btn-primary' onClick={() => setShowModal(true)}>
              <i className='bi bi-plus-circle me-2'></i>
              Add Menu Item
            </button>
          </div>
        </div>
      </div>
      <div className='row'>
        <div className='col'>
          <div className='card'>
            <div className='card-body'>
              <MenuItemTable menuItems={menuItems} isLoading={isLoading} error={error} />
            </div>
          </div>
        </div>
      </div>
      {showModal && (
        <MenuItemModal
          onClose={handleCloseModal}
          isSubmitting={isSubmitting}
          formData={formData}
          onSubmit={handleFormSubmit}
          onChange={handleInputChange}
        />
      )}
    </div>
  );
}
export default MenuItemManagement;
