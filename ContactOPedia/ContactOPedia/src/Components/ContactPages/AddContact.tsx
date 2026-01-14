import { useEffect, useState, type ChangeEvent } from 'react';
import type { contact, formContact } from './Contact';

type Props = {
  handleAddContact: (newContact: formContact) => { status: string; msg: string };
  handleUpdateContact: (contact: contact) => { status: string; msg: string };
  isUpdating: boolean;
  cancelUpdateContact: () => void;
  selectedContact: contact | null;
};

function AddContact({
  handleAddContact,
  handleUpdateContact,
  isUpdating,
  cancelUpdateContact,
  selectedContact,
}: Props) {
  const [messages, setMessages] = useState<{
    errorMessage: string | undefined;
    successMessage: string | undefined;
  }>({
    errorMessage: '',
    successMessage: '',
  });

  const [formData, setFormData] = useState<formContact>({ name: '', email: '', phone: '' });

  useEffect(() => {
    if (isUpdating && selectedContact) {
      setFormData({
        name: selectedContact.name,
        email: selectedContact.email,
        phone: selectedContact.phone,
      });
    } else {
      setFormData({ name: '', email: '', phone: '' });
    }
  }, [isUpdating, selectedContact]);

  function handleFormInputChange(e: ChangeEvent<HTMLInputElement>) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  function handleAddContactForm(formData: FormData) {
    const contactData = {
      name: formData.get('name')?.toString(),
      email: formData.get('email')?.toString(),
      phone: formData.get('phone')?.toString(),
    };

    try {
      let response: { status: string; msg: string } | undefined = undefined;

      if (isUpdating && selectedContact) {
        // updating
        response = handleUpdateContact(selectedContact);
      } else {
        // creating
        response = handleAddContact(contactData as formContact);
      }

      if (response.status === 'success') {
        setMessages({ errorMessage: undefined, successMessage: response.msg });
      } else {
        setMessages({ errorMessage: response.msg, successMessage: undefined });
      }
    } catch (error) {
      console.error('Error adding contact', error);
      setMessages({ errorMessage: 'Error Encountered', successMessage: undefined });
    }
  }

  return (
    <div className='border col-12 text-white p-2'>
      <form action={handleAddContactForm}>
        <div className='row p-2'>
          <div className='col-12 text-white-50 text-center h5'>
            {isUpdating ? 'UpdateContact' : 'Add a new Contact'}
          </div>
          <div className='col-12 col-md-4 p-1'>
            <input
              name='name'
              value={formData.name}
              onChange={handleFormInputChange}
              placeholder='Name...'
              type='text'
              className='form-control form-control-sm'
            />
          </div>
          <div className='col-12 col-md-4 p-1'>
            <input
              name='email'
              value={formData.email}
              onChange={handleFormInputChange}
              placeholder='Email...'
              type='text'
              className='form-control form-control-sm'
            />
          </div>
          <div className='col-12 col-md-4 p-1'>
            <input
              name='phone'
              value={formData.phone}
              onChange={handleFormInputChange}
              placeholder='Phone...'
              type='text'
              className='form-control form-control-sm'
            />
          </div>
          {messages.successMessage && (
            <div className='col-12 text-center text-success'>{messages.successMessage}</div>
          )}
          {messages.errorMessage && (
            <div className='col-12 text-center text-danger'>{messages.errorMessage}</div>
          )}
          <div className={isUpdating ? 'col-6' : 'col-12'}>
            <button className='btn btn-primary btn-sm form-control'>
              {isUpdating ? 'Update' : 'Create Contact'}
            </button>
          </div>
          {isUpdating && (
            <div className='col-6'>
              <button onClick={cancelUpdateContact} className='btn btn-danger btn-sm form-control'>
                Cancel
              </button>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}

export default AddContact;
