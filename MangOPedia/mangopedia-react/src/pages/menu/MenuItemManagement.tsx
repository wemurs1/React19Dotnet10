import { useState, type ChangeEvent } from 'react';
import MenuItemModal from '../../components/menuItem/MenuItemModal';
import MenuItemTable from '../../components/menuItem/MenuItemTable';
import {
  useCreateMenuItemMutation,
  useGetMenuItemsQuery,
  type MenuItem,
  type MenuItemForm,
} from '../../store/api/menuItemApi';
import { toast } from 'react-toastify';

function MenuItemManagement() {
  const { data: menuItems = [] as MenuItem[], isLoading, error, refetch } = useGetMenuItemsQuery();

  const [createMenuItem] = useCreateMenuItemMutation();
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

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      specialTag: '',
      category: '',
      price: '',
      image: null,
    });
  };

  const handleFormSubmit = async (formData: MenuItemForm) => {
    setIsSubmitting(true);
    try {
      // call api to create
      const formDataToSend = new FormData();
      formDataToSend.append('Name', formData.name);
      formDataToSend.append('Category', formData.category);
      formDataToSend.append('Description', formData.description);
      formDataToSend.append('Price', formData.price);
      formDataToSend.append('SpecialTag', formData.specialTag);
      if (formData.image) {
        formDataToSend.append('File', formData.image);
      }
      const result = await createMenuItem(formDataToSend);
      if (result.isSuccess !== false) {
        toast.success('Menu item created successfully!');
        refetch();
      } else {
        toast.error('Failed to create menu item');
      }
      setShowModal(false);
      resetForm();
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
    const { name, value, files } = e.target;
    console.log(name, value);
    if (name === 'image') {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
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
