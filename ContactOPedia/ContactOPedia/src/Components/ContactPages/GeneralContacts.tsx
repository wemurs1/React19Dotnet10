import type { contact } from './Contact';
import Contact from './Contact';

type Props = {
  contacts: contact[];
  favoriteClick: (contact: contact) => void;
  deleteClick: (id: number) => void;
};

function GeneralContacts({ contacts, favoriteClick, deleteClick }: Props) {
  return (
    <div className='col-12 p-2' style={{ borderRadius: '10px', backgroundColor: '#323637' }}>
      <div className='text-center text-white-50'>General Contacts</div>
      <div className='p-2'>
        {contacts.map((contact) => (
          <Contact
            key={contact.id}
            contact={contact}
            favoriteClick={favoriteClick}
            deleteClick={deleteClick}
          />
        ))}
      </div>
    </div>
  );
}

export default GeneralContacts;
