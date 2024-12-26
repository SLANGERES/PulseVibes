import React from 'react'

export const Album = ({album}) => {
  return (
    <div>
      <div>
        <h1>{album.name}</h1>
        <p>Album Type: {album.album_type}</p>
        <p>Total Tracks: {album.total_tracks}</p>
        <p>Release Date: {album.release_date}</p>
        <img src={album.images[0].url} alt={album.name} width={300} />
        <h2>Artists:</h2>
        <ul>
          {album.artists.map((artist, index) => (
            <li key={index}>{artist.name}</li>
          ))}
        </ul>
        <h2>Tracks:</h2>
        <ul>
          {album.tracks.items.map((track, index) => (
            <li key={index}>{track.name}</li>
          ))}
        </ul>
      </div>
  </div>
  )
}
