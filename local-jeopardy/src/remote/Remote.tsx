import { useVideoControl } from '../VideoControlContext';

const Remote = () => {
  const { isPaused, pauseVideo, playVideo } = useVideoControl();

  const handleButtonClick = () => {
    console.log('Button clicked. Current state isPaused:', isPaused);
    if (isPaused) {
      playVideo();
    } else {
      pauseVideo();
    }
  };

  return (
    <div>
      <h1>Remote Control</h1>
      <button onClick={handleButtonClick}>
        {isPaused ? 'Play' : 'Pause'}
      </button>
    </div>
  );
};

export default Remote;