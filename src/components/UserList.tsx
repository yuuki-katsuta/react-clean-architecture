import { useUsers } from '../hooks/useUsers';

export function UserList() {
  const { users, isLoading, isError } = useUsers();

  if (isLoading) {
    return (
      <div className="user-list loading">
        <div className="loading-spinner">Loading users...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="user-list error">
        <h3>Error</h3>
      </div>
    );
  }

  // データ表示（View）
  return (
    <div className="user-list">
      <h2>User List</h2>
      <div className="user-count">Total Users: {users.length}</div>
      <div className="user-grid">
        {users.map(user => (
          <div key={user.id} className="user-card">
            <div className="user-card-header">
              <h3>{user.name}</h3>
              <span className="user-id">#{user.id}</span>
            </div>
            <div className="user-card-body">
              <p>
                <strong>Username:</strong> {user.name}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
