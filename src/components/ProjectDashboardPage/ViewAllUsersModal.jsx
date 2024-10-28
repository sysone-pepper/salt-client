import React from 'react';
import './ViewAllUsersModal.css';

const ViewAllUsersModal = ({ users, closeModal, deleteUser }) => {
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

  return (
    <div className="vau-modal-overlay">
      <div className="vau-modal-content">
        <div className="vau-header">
          <h2>유저 목록</h2>
          <button className="vau-close-button" onClick={closeModal}>
            닫기
          </button>
        </div>
        <table className="vau-table">
          <thead>
            <tr>
              <th>사용자 계정</th>
              <th>사용자 이름</th>
              <th>비밀번호 복사</th>
              <th>관리</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
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
                <td>
                  <button
                    className="vau-delete-button"
                    onClick={() => deleteUser(user.username)}
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ViewAllUsersModal;
