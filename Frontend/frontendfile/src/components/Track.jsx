import React from 'react'

export const Track = ({data}) => {
  return (
    <div> 
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>Spotify Tracks</h1>
      <p>Total Tracks: {data.tracks.total}</p>
      <div>
        {data.tracks.items.map((item, index) => (
          <div
            key={index}
            style={{
              border: "1px solid #ddd",
              borderRadius: "8px",
              padding: "15px",
              marginBottom: "15px",
            }}
          >
            {/* Album Information */}
            <div style={{ display: "flex", alignItems: "center" }}>
              <img
                src={item.album.images[1].url}
                alt="Album Cover"
                style={{ width: "100px", height: "100px", marginRight: "20px" }}
              />
              <div>
                <h2>{item.album.name}</h2>
                <p>
                  <strong>Release Date:</strong> {item.album.release_date}
                </p>
                <p>
                  <strong>Total Tracks:</strong> {item.album.total_tracks}
                </p>
                <a
                  href={item.album.external_urls.spotify}
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: "blue" }}
                >
                  View Album on Spotify
                </a>
              </div>
            </div>

            {/* Artists Information */}
            <div style={{ marginTop: "10px" }}>
              <h3>Artists:</h3>
              <ul>
                {item.artists.map((artist) => (
                  <li key={artist.id}>
                    <a
                      href={artist.external_urls.spotify}
                      target="_blank"
                      rel="noreferrer"
                      style={{ color: "darkblue" }}
                    >
                      {artist.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
  </div>
  </div>
  )
}
