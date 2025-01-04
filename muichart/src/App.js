import { useState } from 'react';
import './App.css';
import { LineChart } from '@mui/x-charts';


function App() {
  const [gamescoreData, setgamescoreData] = useState([
    { x: 0, random: 0, markov: 0 },
    { x: 1, random: 5, markov: 7 },
    { x: 2, random: 6, markov: 8 },
  ]);
  return (
      <main>
            <ScoreCardMarkov />
            <button onClick={handleClick}>Add Data</button> 
      </main>
  );

  function ScoreCardMarkov() {
    return (
      <LineChart
        dataset={gamescoreData}
        yAxis={[{
          type: 'number',
          label: 'Score',
          max: 25,
          min: -25,
        }]}
        xAxis={[{
          dataKey: 'x',
          type: 'number',
          label: 'Turns',
          tickMinStep: 1,
          tickFontSize: 15
        }]}
        series={[{ dataKey: 'markov' }]}
        width={800}
        height={800}
        grid={{ vertical: true, horizontal: true }}
      />
    );
  }
  
  function handleClick() {
    var newRound = { x: gamescoreData.length, random: Math.random() * 25, markov: Math.random() * 25 };
    setgamescoreData([...gamescoreData, newRound]);
    console.log(gamescoreData);
  }
}

export default App;
