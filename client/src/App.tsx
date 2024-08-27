import { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import JeopardyLogo from './images/Jeopardy-Logo.png';
import Remote from './components/Remote';
import { VideoControlProvider } from './VideoControlContext';

interface Video {
  id: {
    videoId: string;
  };
  snippet: {
    title: string;
    thumbnails: {
      default: {
        url: string;
      };
    };
  };
}

function App() {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [videos, setVideos] = useState<Video[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [ws, setWs] = useState<WebSocket | null>(null);

  useEffect(() => {
    const socket = new WebSocket(process.env.REACT_APP_WS_SERVER || 'ws://localhost:8080');
  
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      // Handle incoming data (e.g., update the search results or selected video)
      if (data.type === 'search') {
        setVideos(data.videos);
        setSelectedVideo(null);
      } else if (data.type === 'select') {
        setSelectedVideo(data.video);
      }
    };
  
    setWs(socket);
  
    return () => {
      socket.close();
    };
  }, []);
  
  const fetchVideos = async (query: string) => {
    if (!query.toLowerCase().includes('jeopardy')) {
      query = `jeopardy ${query}`;
    }
    const response = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&type=video&videoDuration=long&key=${process.env.REACT_APP_YOUTUBE_API_KEY}`);
    const data = await response.json();
    setVideos(data.items);
  
    // Send the search result to all clients
    if (ws) {
      ws.send(JSON.stringify({ type: 'search', videos: data.items }));
    }
  };

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    fetchVideos(searchQuery);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleVideoSelect = (video: Video) => {
    setSelectedVideo(video);

    // Send the selected video to all clients
    if (ws) {
      ws.send(JSON.stringify({ type: 'select', video }));
    }
  };

  return (
    <VideoControlProvider>
      <Router>
        <Routes>
          <Route path="/" element={
            <>
              <img src={JeopardyLogo} alt="Jeopardy Logo" className="banner" />
              <form onSubmit={handleSearch}>
                <input 
                  type="text" 
                  value={searchQuery} 
                  onChange={handleInputChange} 
                  placeholder="Search Jeopardy videos" 
                />
                <button type="submit">Search</button>
              </form>

              {!selectedVideo && (
                <div className="video-list">
                  {videos.map(video => (
                    <div key={video.id.videoId} onClick={() => handleVideoSelect(video)}>
                      <img src={video.snippet.thumbnails.default.url} alt={video.snippet.title} />
                      <p>{video.snippet.title}</p>
                    </div>
                  ))}
                </div>
              )}

              {selectedVideo && (
                <div className="video-player">
                  <iframe 
                    width="560" 
                    height="315" 
                    src={`https://www.youtube.com/embed/${selectedVideo.id.videoId}?enablejsapi=1`} 
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen
                  ></iframe>
                </div>
              )}
            </>
          } />
          <Route path="/remote" element={<Remote />} />
        </Routes>
      </Router>
    </VideoControlProvider>
  );
}

export default App;
