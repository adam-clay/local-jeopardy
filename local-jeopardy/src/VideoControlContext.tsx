import React, { createContext, useContext, useState } from 'react';

interface VideoControlContextType {
  isPaused: boolean;
  pauseVideo: () => void;
  playVideo: () => void;
}

const VideoControlContext = createContext<VideoControlContextType | undefined>(undefined);

export const useVideoControl = () => {
  const context = useContext(VideoControlContext);
  if (!context) {
    throw new Error('useVideoControl must be used within a VideoControlProvider');
  }
  return context;
};

export const VideoControlProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isPaused, setIsPaused] = useState(false);

  const pauseVideo = () => {
    const iframe = document.querySelector('iframe');
    if (iframe) {
      const iframeWindow = iframe.contentWindow;
      if (iframeWindow) {
        iframeWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
        setIsPaused(true);
      }
    }
  };

  const playVideo = () => {
    const iframe = document.querySelector('iframe');
    if (iframe) {
      const iframeWindow = iframe.contentWindow;
      if (iframeWindow) {
        iframeWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
        setIsPaused(false);
      }
    }
  };

  return (
    <VideoControlContext.Provider value={{ isPaused, pauseVideo, playVideo }}>
      {children}
    </VideoControlContext.Provider>
  );
};
