import React, { useState } from 'react';
import './CreateNodeContent.css';
import { CreateObjectForm } from './CreateObjectForm';
import { LoadDeviceForm } from './LoadDeviceForm';

export const CreateNodeContent = ({ closeModal }) => {
  const [isCreateForm, setIsCreateForm] = useState(true);
  return (
    <div className="create-node-content">
      <span className="create-option-container">
        <div
          className={`option load-option ${
            isCreateForm ? '' : 'selected-option'
          }`}
          onClick={() => setIsCreateForm(false)}
        >
          장비 불러오기
        </div>
        <div
          className={`option create-option ${
            isCreateForm ? 'selected-option' : ''
          }`}
          onClick={() => setIsCreateForm(true)}
        >
          새 장비 등록
        </div>
      </span>
      <div className="content-form-container">
        {!isCreateForm && <LoadDeviceForm closeModal={closeModal} />}
        {isCreateForm && <CreateObjectForm closeModal={closeModal} />}
      </div>
    </div>
  );
};
