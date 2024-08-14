import { useState } from 'react';

const Remote = () => {
  const [isPaused, setIsPaused] = useState(false);

  const handlePause = () => {
    const iframe = document.querySelector('iframe');
    if (iframe) {
      const iframeWindow = iframe.contentWindow;
      if (iframeWindow) {
        iframeWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
        setIsPaused(true);
      }
    }
  };

  return (
    <div>
      <h1>Remote Control</h1>
      <button onClick={handlePause}>{isPaused ? 'Paused' : 'Pause'}</button>
    </div>
  );
};

export default Remote;