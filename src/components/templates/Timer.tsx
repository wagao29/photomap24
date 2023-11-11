import { useEffect, useRef, useState } from 'react';

type Props = {
  initTime: number;
  onExpire: () => void;
  className: string;
};

const Timer = ({ initTime, onExpire, className }: Props) => {
  const [countTime, setCountTime] = useState<number>(initTime);
  const timerRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    setCountTime(initTime);
    timerRef.current = setInterval(() => {
      setCountTime((t) => t - 1);
    }, 1000);
    return () => {
      clearInterval(timerRef.current);
    };
  }, [initTime]);

  useEffect(() => {
    if (countTime <= 0) {
      clearInterval(timerRef.current);
      onExpire();
    }
  }, [countTime]);

  const hr = Math.floor(countTime / (60 * 60))
    .toString()
    .padStart(2, '0');
  const min = Math.floor((countTime / 60) % 60)
    .toString()
    .padStart(2, '0');
  const sec = (countTime % 60).toString().padStart(2, '0');

  if (countTime <= 0) {
    return <p className={className}>Expired</p>;
  } else {
    return (
      <p className={className}>
        Expires: {hr}:{min}:{sec}
      </p>
    );
  }
};

export default Timer;
