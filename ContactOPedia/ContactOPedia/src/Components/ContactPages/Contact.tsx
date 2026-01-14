export type contact = formContact & {
  id: number;
  isFavorite: boolean;
};

export type formContact = {
  name: string;
  phone: string;
  email: string;
};

type Props = {
  contact: contact;
  favoriteClick: (contact: contact) => void;
  deleteClick: (id: number) => void;
};

function Contact({ contact, favoriteClick, deleteClick }: Props) {
  return (
    <div className='row p-md-2 mb-2' style={{ borderRadius: '10px', border: '1px solid #555' }}>
      <div className='col-2 pt-2 pt-3'>
        <img
          src={`https://ui-avatars.com/api/?name=${contact.name}`}
          alt={contact.name}
          style={{ width: '80%' }}
        />
      </div>
      <div className='col-6 text-warning pt-0'>
        <span className='h4'>{contact.name}</span>
        <br />
        <div className='text-white-50'>
          {contact.email}
          <br />
          {contact.phone}
        </div>
      </div>
      <div className='col-1 pt-2'>
        <button
          className={`btn btn-sm m-1 ${contact.isFavorite ? 'btn-warning' : 'btn-outline-warning'}`}
          onClick={() => favoriteClick(contact)}
        >
          <i className='bi bi-star-fill'></i>
        </button>
      </div>
      <div className='col-3 pt-2'>
        <button className='btn btn-info btn-sm m-1'>
          <i className='bi bi-pencil-square'></i>
        </button>
        <button className='btn btn-danger btn-sm m-1' onClick={() => deleteClick(contact.id)}>
          <i className='bi bi-trash-fill'></i>
        </button>
      </div>
    </div>
  );
}

export default Contact;
