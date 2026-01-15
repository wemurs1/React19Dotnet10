import getRandomUser from '../../Utility/api';
import type { formContact } from './Contact';

type Props = {
    handleAddRandomContext: (contact:formContact)=>void;
}

function AddRandomContact({handleAddRandomContext}:Props) {
  const getRandomContact = async () => {
    const response = await getRandomUser();
    if (response && response.results && response.results.length > 0) {
      const user = response.results[0];
      const formattedUser: formContact = {
        name: user.name.first + ' ' + user.name.last,
        email: user.email,
        phone: user.phone,
      };
      handleAddRandomContext(formattedUser);
    }
  };

  return (
    <button onClick={getRandomContact} className='btn btn-success form-control'>
      Add Random Contact
    </button>
  );
}

export default AddRandomContact;
