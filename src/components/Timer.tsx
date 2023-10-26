import { memo, useEffect, useState } from 'react';

type Props = {
  initTime: number;
  className: string;
};

const Timer = memo(function TimerBase({ initTime, className }: Props) {
  const [countTime, setCountTime] = useState<number>(initTime);

  useEffect(() => {
    setCountTime(initTime);
    const countDownInterval = setInterval(() => {
      if (countTime > 0) {
        setCountTime((t) => t - 1);
      } else {
        clearInterval(countDownInterval);
      }
    }, 1000);
    return () => {
      clearInterval(countDownInterval);
    };
  }, [initTime]);

  const hr = Math.floor(countTime / (60 * 60))
    .toString()
    .padStart(2, '0');
  const min = Math.floor((countTime / 60) % 60)
    .toString()
    .padStart(2, '0');
  const sec = (countTime % 60).toString().padStart(2, '0');

  return (
    <p className={className}>
      expires: {hr}:{min}:{sec}
    </p>
  );
});

export default Timer;
