import { Album } from './components/Album'; // Import the Album component
import fakedata from './fakedata.json'; // Import the JSON data
import fakeTrackData from './assets/fakeTrackData.json'
import './App.css';
import {Track} from './components/Track';

function App() {
  // Directly use the imported fakedata
  console.log("album",fakedata);
  console.log("track",fakeTrackData)
  const data = fakedata; // No need to parse it
  const track=fakeTrackData
  console.log("track",fakeTrackData)
  console.log("album",data);

  return (
    <>
      <h1>PulseVibes</h1>
      <Track data={track}/>
      {/* <Album album={data} /> Pass the JSON data to the Album component */}
    </>
  );
}

export default App;
