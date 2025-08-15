'use client';

import { useState } from 'react';

export default function TempRoleUpdatePage() {
  const [userEmail, setUserEmail] = useState('horace.karatu@gmail.com');
  const [newRole, setNewRole] = useState('admin');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdateRole = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/temp-update-role', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userEmail, newRole }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(`Success: ${data.message}`);
        if (data.modifiedCount > 0) {
          setMessage(`Success: ${data.message}. Please sign out and sign back in to refresh your session.`);
        } else {
          setMessage(`Info: ${data.message} (role was already set)`);
        }
      } else {
        setMessage(`Error: ${data.error}`);
      }
    } catch (error) {
      setMessage('Error: Failed to update user role');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Temporary Role Update</h1>
          <p className="text-gray-600 mb-6">
            This page allows you to update your user role. After updating, please sign out and sign back in to refresh your session.
          </p>
          
          <form onSubmit={handleUpdateRole} className="space-y-4">
            <div>
              <label htmlFor="userEmail" className="block text-sm font-medium text-gray-700 mb-1">
                User Email
              </label>
              <input
                type="email"
                id="userEmail"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter user email"
                required
              />
            </div>

            <div>
              <label htmlFor="newRole" className="block text-sm font-medium text-gray-700 mb-1">
                New Role
              </label>
              <select
                id="newRole"
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="user">User</option>
                <option value="moderator">Moderator</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Updating...' : 'Update User Role'}
            </button>
          </form>

          {message && (
            <div className={`mt-4 p-3 rounded-md ${
              message.startsWith('Success') || message.startsWith('Info')
                ? 'bg-green-50 text-green-800 border border-green-200' 
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}>
              {message}
            </div>
          )}

          <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
            <h2 className="text-lg font-semibold text-yellow-900 mb-2">Important Notes:</h2>
            <ul className="text-yellow-800 text-sm space-y-1">
              <li>• After updating your role, sign out and sign back in</li>
              <li>• This is a temporary page - delete it after use</li>
              <li>• Only use this to give yourself admin access</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 