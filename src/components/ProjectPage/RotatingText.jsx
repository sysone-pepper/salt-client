import React, { useState, useEffect, useContext } from 'react';
import './RotatingText.css'; // CSS 스타일 분리
import { NetworkContext } from '../../contexts/NetworkContext';

const RotatingText = ({ interval = 3000 }) => {
  const { pushMessages, setPushMessages } = useContext(NetworkContext);
  const [animationClass, setAnimationClass] = useState('');
  const [isInitialized, setIsInitialized] = useState(false); // 초기화 상태 확인

  // 기본 메시지 설정
  const defaultMessages = [
    '반갑습니다.',
    '모니터링 대상 장비에서 에러가 존재하지 않습니다.',
  ];

  // 기본 메시지 초기화
  useEffect(() => {
    if (!isInitialized && pushMessages.length === 0) {
      setPushMessages([...defaultMessages]);
      setIsInitialized(true); // 초기화 완료
    }
  }, [isInitialized, pushMessages, setPushMessages]);

  // 애니메이션 로직 처리
  useEffect(() => {
    if (isInitialized && pushMessages.length > 0) {
      const intervalId = setInterval(() => {
        setAnimationClass('fade-out-up');
        setTimeout(() => {
          setPushMessages((prevMessages) => {
            if (prevMessages.length > 1) {
              const newMessages = [...prevMessages];
              newMessages.shift(); // 메시지 제거
              return newMessages;
            }
            return defaultMessages; // 기본 메시지로 복원
          });
          setAnimationClass('fade-in-up');
        }, 1000); // 애니메이션 지속 시간
      }, interval);

      return () => clearInterval(intervalId); // 정리
    }
  }, [isInitialized, interval]);

  return (
    <div className={`text-container ${animationClass}`}>
      {pushMessages.length > 0 ? pushMessages[0] : '로딩 중...'}
    </div>
  );
};

export default RotatingText;
