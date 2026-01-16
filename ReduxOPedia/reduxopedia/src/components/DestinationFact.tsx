import { useSelector } from 'react-redux';
import type { RootState } from '../redux/store';

function DestinationFact() {
  const selectedDestination = useSelector(
    (state: RootState) => state.destinationStore.destinationSelected
  );
  if (selectedDestination == undefined) {
    return <div className='text-center pt-4 text-warning'>Select a Destination</div>;
  }
  return (
    <div className='text-center border p-3 m-3'>
      <h4 className='text-success'>{selectedDestination.name}</h4>
      Days recommended: {selectedDestination.days}
      <br />
      Fun Fact: {selectedDestination.fact}
    </div>
  );
}

export default DestinationFact;
