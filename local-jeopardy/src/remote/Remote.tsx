import { useVideoControl } from '../VideoControlContext';

const Remote = () => {
  const { isPaused, pauseVideo, playVideo } = useVideoControl();

  return (
    <div>
      <h1>Remote Control</h1>
      <button onClick={isPaused ? playVideo : pauseVideo}>
        {isPaused ? 'Play' : 'Pause'}
      </button>
    </div>
  );
};

export default Remote;
