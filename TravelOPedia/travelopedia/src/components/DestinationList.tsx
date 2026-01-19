import type { ReactNode } from 'react';
import { useGetAllDestinationQuery } from '../api/destinationApi';

function DestinationList() {
  const { data, isLoading, isSuccess, isError, error } = useGetAllDestinationQuery({});

  let content: ReactNode;
  if (isLoading) {
    <p>Loading...</p>;
  } else if (isSuccess) {
    content = data.map((destination) => {
      return (
        <article key={destination.id}>
          <div className='text-center text-info p-2'>
            {destination.city}, {destination.country} - {destination.daysNeeded} days
          </div>
        </article>
      );
    });
  } else if (isError) {
    content = <p>{error.toString()}</p>;
  }

  return <div>{content}</div>;
}

export default DestinationList;
