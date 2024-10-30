import React, { useState } from 'react';
import './AddUserModal.css';

const AddUserModal = ({ closeModal, onCreate }) => {
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [authority, setAuthority] = useState('READ_ONLY');

  const handleCreate = () => {
    if (password !== confirmPassword) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }
    onCreate({
      id: username,
      name,
      password,
      authority,
    });
  };

  return (
    <div className="au-modal-overlay">
      <div className="au-modal-content">
        <div className="au-wrapper">
          <form
            className="au-form"
            onSubmit={(e) => {
              e.preventDefault();
              handleCreate();
            }}
          >
            <h1 className="au-title">새 유저 생성</h1>
            <hr className="au-sep" />
            <div className="au-group">
              <input
                type="text"
                required
                className="au-input"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <span className="au-highlight"></span>
              <span className="au-bar"></span>
              <label className="au-label">사용자 계정</label>
            </div>
            <div className="au-group">
              <input
                type="text"
                required
                className="au-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <span className="au-highlight"></span>
              <span className="au-bar"></span>
              <label className="au-label">사용자 이름</label>
            </div>
            <div className="au-group">
              <input
                type="password"
                required
                className="au-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <span className="au-highlight"></span>
              <span className="au-bar"></span>
              <label className="au-label">사용자 비밀번호</label>
            </div>
            <div className="au-group">
              <input
                type="password"
                required
                className="au-input"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <span className="au-highlight"></span>
              <span className="au-bar"></span>
              <label className="au-label">사용자 비밀번호 확인</label>
            </div>

            <div className="au-group">
              <div className="au-authority-title">권한</div>
              <div className="au-radio-group">
                <label className="au-radio-label">
                  <input
                    type="radio"
                    value="ALL"
                    checked={authority === 'ALL'}
                    onChange={(e) => setAuthority(e.target.value)}
                    className="au-radio-input"
                  />
                  <span className="au-radio-text">관리자 권한</span>
                </label>
                <label className="au-radio-label">
                  <input
                    type="radio"
                    value="READ_ONLY"
                    checked={authority === 'READ_ONLY'}
                    onChange={(e) => setAuthority(e.target.value)}
                    className="au-radio-input"
                  />
                  <span className="au-radio-text">읽기 전용</span>
                </label>
              </div>
            </div>

            <div className="au-btn-box">
              <button className="au-btn au-btn-submit" type="submit">
                생성
              </button>
              <button
                className="au-btn au-btn-cancel"
                type="button"
                onClick={closeModal}
              >
                취소
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddUserModal;
