import { useState } from 'react';
import type { formContact } from './Contact';

type Props = {
  handleAddContact: (newContact: formContact) => { status: string; msg: string };
};

function AddContact({ handleAddContact }: Props) {
  const [messages, setMessages] = useState<{
    errorMessage: string | undefined;
    successMessage: string | undefined;
  }>({
    errorMessage: '',
    successMessage: '',
  });

  function handleAddContactForm(formData: FormData) {
    const contactData = {
      name: formData.get('name')?.toString(),
      email: formData.get('email')?.toString(),
      phone: formData.get('phone')?.toString(),
    };

    try {
      console.log(contactData);
      const response = handleAddContact(contactData as formContact);
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
          <div className='col-12 text-white-50 text-center h5'>Add a new Contact</div>
          <div className='col-12 col-md-4 p-1'>
            <input
              name='name'
              placeholder='Name...'
              type='text'
              className='form-control form-control-sm'
            />
          </div>
          <div className='col-12 col-md-4 p-1'>
            <input
              name='email'
              placeholder='Email...'
              type='text'
              className='form-control form-control-sm'
            />
          </div>
          <div className='col-12 col-md-4 p-1'>
            <input
              name='phone'
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
          <div className='col-12'>
            <button className='btn btn-primary btn-sm form-control'>Create</button>
          </div>
          <div className='col-12'>
            <button className='btn btn-danger btn-sm form-control'>Cancel</button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default AddContact;
