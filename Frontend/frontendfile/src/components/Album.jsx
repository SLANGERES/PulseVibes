import React from "react";

export const Album = ({ album }) => {
  const RedirectURL = (url) => {
    // Redirect function
    setTimeout(() => {
      window.location.replace(url);
    }, 3000);
  };

  return (
    <div
      className="flex"
      onClick={() => RedirectURL(album?.RedirectURL?.spotify)}
    >
      <div className="h-72 w-72 border-yellow-400 border bg-white m-5 rounded-xl flex justify-start p-3 flex-col obj shadow-none transition-shadow duration-300 cursor-pointer hover:shadow-lg hover:shadow-yellow-400">
        <div className="w-full h-full rounded-lg overflow-hidden">
          <img
            className="object-fill w-full h-full"
            src={album?.images[0]?.url}
            alt={album?.name}
          />
        </div>

        <h1 className="text-lg text-black font-thin">{album?.name}</h1>
        <h1 className="font-thin text-lg text-black">{album?.total_track}</h1>
        <h1 className="font-thin text-lg text-black">
          <span>{album?.album_type}</span> <span>{album?.total_track}</span>
        </h1>
      </div>
    </div>
  );
};
