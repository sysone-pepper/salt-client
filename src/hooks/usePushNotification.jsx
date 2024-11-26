import { useState, useEffect } from 'react';

// 커스텀 훅: useNotification
const useNotification = () => {
  const [permission, setPermission] = useState(Notification.permission);

  // 권한 요청
  const requestPermission = async () => {
    if (permission === 'default') {
      const result = await Notification.requestPermission();
      setPermission(result);
      if (result !== 'granted') {
        console.warn('Notification permission denied!');
      }
    }
  };

  // 알림 표시 함수
  const showNotification = (title, options = {}) => {
    if (permission === 'granted') {
      const notification = new Notification(title, options);

      // 클릭 이벤트 처리 (옵션)
      notification.onclick = () => {
        console.log('Notification clicked!');
        window.focus(); // 현재 창으로 포커스 이동
      };

      return notification;
    } else {
      console.warn('No permission to show notifications!');
    }
  };

  useEffect(() => {
    // 컴포넌트 마운트 시 권한 요청
    if (permission === 'default') {
      requestPermission();
    }
  }, [permission]);

  return { permission, requestPermission, showNotification };
};

export default useNotification;
