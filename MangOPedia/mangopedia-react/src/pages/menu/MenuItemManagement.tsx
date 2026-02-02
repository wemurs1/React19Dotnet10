import { useState, type ChangeEvent } from 'react';
import MenuItemModal from '../../components/menuItem/MenuItemModal';
import MenuItemTable from '../../components/menuItem/MenuItemTable';
import {
  useCreateMenuItemMutation,
  useGetMenuItemsQuery,
  useDeleteMenuItemMutation,
  useUpdateMenuItemMutation,
  type MenuItem,
  type MenuItemForm,
} from '../../store/api/menuItemApi';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

function MenuItemManagement() {
  const { data = [], isLoading, error, refetch } = useGetMenuItemsQuery();
  const menuItems: MenuItem[] = data;

  const [createMenuItem] = useCreateMenuItemMutation();
  const [deleteMenuItem] = useDeleteMenuItemMutation();
  const [updateMenuItem] = useUpdateMenuItemMutation();
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItem | null>(null);
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

  const handleAddMenuItem = async () => {
    resetForm();
    setSelectedMenuItem(null);
    setShowModal(true);
  };

  const handleEditMenuItem = async (item: MenuItem) => {
    setSelectedMenuItem(item);
    setShowModal(true);
    setFormData({
      name: item.name || '',
      description: item.description || '',
      specialTag: item.specialTag || '',
      category: item.category || '',
      price: item.price.toString() || '',
      image: null,
    });
  };

  const handleDeleteMenuItem = async (item: MenuItem) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    });
    if (result.isConfirmed) {
      await deleteMenuItem(item.id);
      Swal.fire({
        title: 'Deleted!',
        text: 'Your Menu Item has been deleted.',
        icon: 'success',
      });
    }
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
      let result;
      if (selectedMenuItem) {
        // edit mode
        formDataToSend.append('Id', selectedMenuItem.id.toString());
        result = await updateMenuItem({
          id: selectedMenuItem.id.toString(),
          formData: formDataToSend,
        });
        if (result.isSuccess !== false) {
          toast.success('Menu item created successfully!');
          refetch();
        } else {
          toast.error('Failed to create menu item');
        }
      } else {
        result = await createMenuItem(formDataToSend);
        if (result.isSuccess !== false) {
          toast.success('Menu item created successfully!');
          refetch();
        } else {
          toast.error('Failed to create menu item');
        }
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
            <button className='btn btn-primary' onClick={handleAddMenuItem}>
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
              <MenuItemTable
                menuItems={menuItems}
                isLoading={isLoading}
                error={error}
                onDelete={handleDeleteMenuItem}
                onEdit={handleEditMenuItem}
              />
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
          isEditing={!!selectedMenuItem}
        />
      )}
    </div>
  );
}
export default MenuItemManagement;
