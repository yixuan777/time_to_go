'use client';

import { useState, useEffect } from 'react';

export default function Home() {
  // 預設下班時間為 18:00
  const [offTime, setOffTime] = useState('18:00');
  const [timeLeft, setTimeLeft] = useState<string>('計算中...');
  const [isOffTime, setIsOffTime] = useState(false);

  // 計算剩餘時間
  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const [hours, minutes] = offTime.split(':').map(Number);
      const offDateTime = new Date();
      offDateTime.setHours(hours, minutes, 0, 0);

      // 如果下班時間已過，設定為明天
      if (offDateTime <= now) {
        offDateTime.setDate(offDateTime.getDate() + 1);
      }

      const diff = offDateTime.getTime() - now.getTime();
      
      if (diff <= 0) {
        setIsOffTime(true);
        setTimeLeft('下班時間到！');
        return;
      }

      setIsOffTime(false);
      const hoursLeft = Math.floor(diff / (1000 * 60 * 60));
      const minutesLeft = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const secondsLeft = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft(
        `${hoursLeft.toString().padStart(2, '0')}:${minutesLeft.toString().padStart(2, '0')}:${secondsLeft.toString().padStart(2, '0')}`
      );
    };

    // 立即計算一次
    calculateTimeLeft();

    // 每秒更新一次
    const interval = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(interval);
  }, [offTime]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <main className="w-full max-w-md mx-auto px-6 py-12">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 space-y-8">
          {/* 標題 */}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
              下班倒數計時器
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              距離下班還有多久？
            </p>
          </div>

          {/* 時間設定 */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              設定下班時間
            </label>
            <input
              type="time"
              value={offTime}
              onChange={(e) => setOffTime(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* 倒數顯示 */}
          <div className="text-center py-8">
            <div className={`text-6xl font-mono font-bold mb-4 ${
              isOffTime 
                ? 'text-green-500 animate-pulse' 
                : 'text-indigo-600 dark:text-indigo-400'
            }`}>
              {timeLeft}
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              {isOffTime ? '🎉 可以下班了！' : '⏰ 繼續加油'}
            </p>
          </div>

          {/* 當前時間顯示 */}
          <div className="text-center pt-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              現在時間：{new Date().toLocaleTimeString('zh-TW')}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
