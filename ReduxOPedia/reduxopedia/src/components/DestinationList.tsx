import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../redux/store';
import { destinationClicked } from '../redux/slice/destinationSlice';

function DestinationList() {
  const dispatch = useDispatch();
  const destinations = useSelector((state: RootState) => state.destinationStore.destinations);
  return destinations.map((dest, index) => (
    <div className='text-center row border-bottom' key={index}>
      <div className='col-8 pt-2'>{dest.name}</div>
      <div className='col-4'>
        <button
          className='btn btn-success form-control m-1'
          onClick={() => dispatch(destinationClicked(dest))}
        >
          Details
        </button>
      </div>
    </div>
  ));
}

export default DestinationList;
