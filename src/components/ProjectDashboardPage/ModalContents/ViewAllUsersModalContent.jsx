import React, { useState } from 'react';
import './ViewAllUsersModalContent.css';

const ViewAllUsersModalContent = ({ users, deleteUser, currentRole }) => {
  const [search, setSearch] = useState('');

  const filteredUsers = users.filter((user) => {
    const lowerCaseQuery = search.toLowerCase();
    return (
      user.username.toLowerCase().includes(lowerCaseQuery) ||
      user.name.toLowerCase().includes(lowerCaseQuery)
    );
  });

  const copyToClipboard = (password) => {
    navigator.clipboard.writeText(password).then(
      () => {
        alert('비밀번호가 복사되었습니다.');
      },
      (error) => {
        alert('비밀번호 복사에 실패했습니다.');
      },
    );
  };

  const isAdmin = currentRole === 'ROOT';

  return (
    <>
      <div className="vau-header">
        <h2>유저 목록</h2>
        <input
          className="vau-search"
          type="text"
          placeholder="사용자 계정 또는 이름 검색"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <table className="vau-table">
        <thead>
          <tr>
            <th>사용자 계정</th>
            <th>사용자 이름</th>
            <th>비밀번호 복사</th>
            <th>권한</th>
            {isAdmin && <th>관리</th>}
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <tr key={user.username}>
              <td>{user.username}</td>
              <td>{user.name}</td>
              <td>
                <button
                  className="vau-copy-button"
                  onClick={() => copyToClipboard(user.password)}
                >
                  •••••••• 📋
                </button>
              </td>
              <td>{user.authority === 'ALL' ? '전체 권한' : '읽기 전용'}</td>
              {isAdmin && (
                <td>
                  {user.role === 'NORMAL' && (
                    <button
                      className="vau-delete-button"
                      onClick={() => deleteUser(user.username)}
                    >
                      🗑️
                    </button>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default ViewAllUsersModalContent;
