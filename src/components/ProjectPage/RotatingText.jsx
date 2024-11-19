import React, { useState, useEffect } from 'react';
import './RotatingText.css'; // CSS 스타일 분리

const RotatingText = ({ sentences, interval = 3000 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [animationClass, setAnimationClass] = useState('');

  useEffect(() => {
    const intervalId = setInterval(() => {
      setAnimationClass('fade-out-up'); // 현재 문장을 사라지게
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % sentences.length);
        setAnimationClass('fade-in-up'); // 새 문장을 등장시키는 애니메이션
      }, 1000); // 애니메이션 시간
    }, interval);

    return () => clearInterval(intervalId); // 컴포넌트 언마운트 시 정리
  }, [sentences, interval]);

  return (
    <div className={`text-container ${animationClass}`}>
      {sentences[currentIndex]}
    </div>
  );
};

export default RotatingText;
