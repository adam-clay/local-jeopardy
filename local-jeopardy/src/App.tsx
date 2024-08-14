import { useState, FormEvent, ChangeEvent } from 'react'
import './App.css'

interface Video {
  id: {
    videoId: string
  }
  snippet: {
    title: string
    thumbnails: {
      default: {
        url: string
      }
    }
  }
}

function App() {
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [videos, setVideos] = useState<Video[]>([])
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null)

  const fetchVideos = async (query: string) => {
    if (!query.toLowerCase().includes('jeopardy')) {
      query = `jeopardy ${query}`
    }
    const response = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&type=video&key=${import.meta.env.VITE_YOUTUBE_API_KEY}`)
    const data = await response.json()
    setVideos(data.items)
  }

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    fetchVideos(searchQuery)
  }

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  return (
    <>
      <form onSubmit={handleSearch}>
        <input 
          type="text" 
          value={searchQuery} 
          onChange={handleInputChange} 
          placeholder="Search Jeopardy videos" 
        />
        <button type="submit">Search</button>
      </form>

      <div className="video-list">
        {videos.map(video => (
          <div key={video.id.videoId} onClick={() => setSelectedVideo(video)}>
            <img src={video.snippet.thumbnails.default.url} alt={video.snippet.title} />
            <p>{video.snippet.title}</p>
          </div>
        ))}
      </div>

      {selectedVideo && (
        <div className="video-player">
          <iframe 
            width="560" 
            height="315" 
            src={`https://www.youtube.com/embed/${selectedVideo.id.videoId}`} 
            frameBorder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowFullScreen
          ></iframe>
        </div>
      )}
    </>
  )
}

export default App