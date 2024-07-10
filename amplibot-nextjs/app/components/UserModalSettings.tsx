import { withAuthenticator } from '@aws-amplify/ui-react';
import { useRouter } from 'next/navigation';
import { signOut } from 'aws-amplify/auth';
import React from 'react';
import handleExport from '../helper/exporthelper';

function UserModalSettings({messages} : {messages: Message[]}) {
  const router = useRouter();

  const handleSignOut = () => {
    router.push('/');

    setTimeout(() => {
      signOut();
    }, 2000);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="text-primary flex flex-col gap-2">
        <div className="text-2xl font-bold">Data</div>
        <div className="flex justify-between">
          <div>Export Data (JSON)</div>
          <button className='bg-primary px-4 py-1 text-offwhite rounded-lg hover:bg-primary-dark' onClick={() => handleExport(messages)}>Export</button>
        </div>
      </div>
      <div className="text-primary flex flex-col gap-2">
        <div className="text-2xl font-bold">Account</div>
        <div className="flex justify-between">
          <div>Log out</div>
          <button
            onClick={handleSignOut}
            className="text-offwhite rounded-lg py-1 px-4 bg-red-500 hover:bg-red-400 hover:text-offwhite"
          >
            Log out
          </button>
        </div>
        {/* <div className="flex justify-between">
          <div>Delete all chat</div>
          <div className="border-2 border-red-400 rounded-lg py-1 px-4 text-red-400">
            Delete
          </div>
        </div> */}
      </div>
    </div>
  );
}

export default withAuthenticator(UserModalSettings);
