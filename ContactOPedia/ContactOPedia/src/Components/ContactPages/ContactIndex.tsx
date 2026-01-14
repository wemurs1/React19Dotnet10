import { useState } from 'react';
import FavoriteContacts from './FavoriteContacts';
import type { contact, formContact } from './Contact';
import GeneralContacts from './GeneralContacts';
import AddContact from './AddContact';

function ContactIndex() {
  const [contactList, setContactList] = useState<contact[]>([
    {
      id: 1,
      name: 'Ben Parker',
      phone: '666-666-7770',
      email: 'ben@dotnetmastery.com',
      isFavorite: false,
    },
    {
      id: 2,
      name: 'Kathy Patrick',
      phone: '111-222-0000',
      email: 'kathy@dotnetmastery.com',
      isFavorite: true,
    },
    {
      id: 3,
      name: 'Paul Show',
      phone: '999-222-1111',
      email: 'paul@dotnetmastery.com',
      isFavorite: true,
    },
  ]);

  function handleToggleFavorite(contact: contact) {
    setContactList((prev) => {
      return prev.map((obj) => {
        if (obj.id === contact.id) {
          return { ...obj, isFavorite: !obj.isFavorite };
        }
        return obj;
      });
    });
  }

  function handleDeleteContact(id: number) {
    setContactList((prev) => {
      return prev.filter((u) => u.id !== id);
    });
  }

  function handleAddContact(newContact: formContact) {
    // validation
    const duplicateRecord = contactList.filter((x) => {
      if (x.name === newContact.name && x.phone === newContact.phone) {
        return true;
      }
    });

    if (duplicateRecord.length > 0) {
      return { status: 'error', msg: 'Duplicate record' };
    }

    const newFinalContact: contact = {
      ...newContact,
      id: contactList[contactList.length - 1].id + 1,
      isFavorite: false,
    };
    setContactList((prev) => {
      return prev.concat([newFinalContact]);
    });
    return { status: 'success', msg: 'Contact was added successfully' };
  }

  return (
    <div className='container' style={{ minHeight: '85vh' }}>
      <div className='py-3'>
        <div className='row py-2'>
          <div className='col-6'>ADD CONTACT</div>
          <div className='col-6'>REMOVE CONTACT</div>
        </div>
        <div className='py-2'>
          <div className='col-12'>
            <AddContact handleAddContact={handleAddContact} />
          </div>
        </div>
        <div className='py-2'>
          <div className='col-12'>
            <FavoriteContacts
              favoriteClick={handleToggleFavorite}
              deleteClick={handleDeleteContact}
              contacts={contactList.filter((u) => u.isFavorite === true)}
            />
          </div>
        </div>
        <div className='py-2'>
          <div className='col-12'>
            <GeneralContacts
              favoriteClick={handleToggleFavorite}
              deleteClick={handleDeleteContact}
              contacts={contactList.filter((u) => u.isFavorite === false)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactIndex;
