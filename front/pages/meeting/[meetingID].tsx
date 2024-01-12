import React from 'react';
import { GetServerSideProps, NextPage } from 'next';
import Header from '../../components/Header';

interface MeetingProps {
  meeting?: {
    id: string;
    name: string;
    description: string;
  };
  error?: string;
}

const MeetingPage: NextPage<MeetingProps> = ({ meeting, error }) => {
  if (error) {
    return (
      <>
        <div>
          <h1>Error</h1>
          <p>{error}</p>
        </div>
      </>
    );
  }

  return (
    <>
      <div>
        <h1>{meeting?.name}</h1>
        <p>{meeting?.description}</p>
        {/* Render other meeting details */}
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const meetingId = typeof context.params?.meetingId === 'string' ? context.params.meetingId : 'defaultId';

  // Fetch the meeting data from your database
  // This is placeholder logic, replace it with your actual database query
  let meeting;
  try {
    // Replace this with your actual data fetching logic
    if (meetingId !== 'defaultId') {
      meeting = {
        id: meetingId,
        name: 'Sample Meeting',
        description: 'This is a sample meeting description.'
      };
    } else {
      throw new Error('Meeting not found');
    }
  } catch (error) {
    return {
      props: {
        error: 'Meeting not found or an error occurred'
      }
    };
  }

  return {
    props: {
      meeting
    }
  };
};

export default MeetingPage;
