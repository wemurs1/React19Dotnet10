import AddDestination from './AddDestination';
import DestinationList from './DestinationList';

function DestinationIndex() {
  return (
    <div className='py-4'>
      <h1 className='text-success  text-center'>Travel List</h1>
      <AddDestination />
      <br />
      <div className='text-center h3 text-warning'>Destination List</div>
      <DestinationList />
    </div>
  );
}

export default DestinationIndex;
