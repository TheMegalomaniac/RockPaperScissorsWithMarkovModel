import './App.css';
import React, { memo, useState } from 'react';
import { LineChart } from '@mui/x-charts/LineChart';
import { ChartContainer, ChartsReferenceLine, Line, LinePlot, MarkPlot, ChartsGrid, ChartsXAxis, ChartsYAxis, } from '@mui/x-charts';
import Button from '@mui/material/Button';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { List, Box, ListItem, ListItemButton, ListItemAvatar, Avatar, ImageList, ImageListItem, ListItemText, ListItemIcon } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2
import { ButtonGroup } from 'react-bootstrap';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import Typography from '@mui/material/Typography';

const choices = ['rock', 'paper', 'scissors'];
var nMoves = 0;
var nRandomLosses = 0;
var nMarkovLosses = 0;

var prevChoice = choices[0];
var markovMatrix = {
  rock: { rock: 1, paper: 0, scissors: 0 },
  paper: { rock: 0, paper: 1, scissors: 0 },
  scissors: { rock: 0, paper: 0, scissors: 1 },
}


function App() {

  const [gamescoreData, setgamescoreData] = useState([
    { x: 0, random: 0, markov: 0 },
  ]);

  const [turnMemory, setturnMemory] = useState([
  ]);


  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <main>
        <DisplayUserChoices onOptionSelected={userSelectionMade} />

        <Grid container direction="row" align="center">
          <Grid item xs={6}><Typography variant="h3">User vs. Random</Typography></Grid>
          <Grid item xs={6}><Typography variant="h3">User vs. AI</Typography></Grid>
          <Grid item xs={6}>
            <ScoreCardRandom />
          </Grid>

          <Grid item xs={6}>
            <ScoreCardMarkov />
          </Grid>
        </Grid>

        <ShowScoreTable />

      </main>
    </ThemeProvider>
  );

  function WinLossIcon({userChoice, otherChoice}) {
    
    if (userChoice == otherChoice) {
      return <img src='img/equal.png' height='30' width='30' />
    } else if (userChoice == bestResponse(otherChoice)) {
      return <img src='img/up.png' height='30' width='30' />
    } else {
      return <img src='img/down.png' height='30' width='30' />
    }
  }

  function WinnerString({userChoice, otherChoice, engineName}) {
    console.log(userChoice, otherChoice, userChoice== otherChoice);
    if (userChoice == otherChoice) {
      return "Draw";
    } else if (userChoice == bestResponse(otherChoice)) {
      return "User wins";
    } else {
      return engineName + " wins";
    }
  }

  function GetRPSImage({ choice }) {
    const s = require("../public/img/" + choice + ".png");
    const r = 'img/' + choice + '.png';
    return (<img src={r} width='50' height='50' />);
  }

  function ShowScoreTable() {

    return (
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650, maxwidth:650 }} size='small' padding='none' stickyheader='true' aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="left" width={150}></TableCell>
              <TableCell align="left">Win/Loss</TableCell>
              <TableCell align="center">Random Choice</TableCell>
              <TableCell align="center">User Choice</TableCell>
              <TableCell align="center">Markov Choice</TableCell>
              <TableCell align="right">Win/Loss</TableCell>
              <TableCell align="right" width={150}></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {turnMemory.map((row) => (
              <TableRow
                key={row.turn}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                {console.log(row)}
                <TableCell component="th" scope="row" align="center">
                  <WinLossIcon userChoice={row.userChoice} otherChoice={row.randomChoice} />
                </TableCell>
                <TableCell align="left">
                  <WinnerString userChoice={row.userChoice} otherChoice={row.randomChoice} engineName='Random' />
                </TableCell>
                <TableCell align="center">
                  <GetRPSImage choice={row.randomChoice} />
                </TableCell>
                <TableCell align="center">
                  <GetRPSImage choice={row.userChoice} />
                </TableCell>
                <TableCell align="center">
                  <GetRPSImage choice={row.markovChoice} />
                </TableCell>
                <TableCell align="right">
                  <WinnerString userChoice={row.userChoice} otherChoice={row.markovChoice} engineName='AI' />
                </TableCell>
                <TableCell component="th" scope="row" align="center">
                  <WinLossIcon userChoice={row.userChoice} otherChoice={row.markovChoice} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }

  function updateMarkovChain(userChoice) {
    if (prevChoice != null) {
      markovMatrix[prevChoice][userChoice] += 1
    }
    prevChoice = userChoice;
    console.log(markovMatrix);
    console.log(`Most likely next choice: ` + mostLikelyChoice());
    console.log(`Most frequent choice: ` + mostFrequentChoice());
  }

  function ResetScores() {
    markovMatrix = {
      rock: { rock: 1, paper: 0, scissors: 0 },
      paper: { rock: 0, paper: 1, scissors: 0 },
      scissors: { rock: 0, paper: 0, scissors: 1 },
    }
    prevChoice = choices[0];
    nMoves = 0;
    nRandomLosses = 0;
    nMarkovLosses = 0;
    setgamescoreData([{ x: 0, random: 0, markov: 0 }])
    setturnMemory([]);
  }

  function mostLikelyChoice() {
    var max = 0;
    var maxChoice = choices[0][0];
    for (const [key, value] of Object.entries(markovMatrix[prevChoice])) {
      if (value > max) {
        max = value;
        maxChoice = key;
      }
    }
    console.log(maxChoice);
    return maxChoice;
  }

  function mostFrequentChoice() {
    var maxChoice = null;
    let nRocks = markovMatrix.rock.rock + markovMatrix.paper.rock + markovMatrix.scissors.rock;
    let nPapers = markovMatrix.rock.paper + markovMatrix.paper.paper + markovMatrix.scissors.paper;
    let nScissors = markovMatrix.rock.scissors + markovMatrix.paper.scissors + markovMatrix.scissors.scissors;
    var max = Math.max(nRocks, nPapers, nScissors);
    if (max == nRocks) {
      maxChoice = 'rock';
    } else if (max == nPapers) {
      maxChoice = 'paper';
    } else {
      maxChoice = 'scissors';
    }
    return maxChoice;
  }

  function bestResponse(opponentChoice) {
    if (opponentChoice == 'rock') {
      return 'paper';
    } else if (opponentChoice == 'paper') {
      return 'scissors';
    } else {
      return 'rock';
    }
  }

  function randomChoice() {
    return choices[Math.floor(Math.random() * choices.length)];
  }

  function markovChoice() {
    return bestResponse(mostLikelyChoice());
  }

  function UserChoiceButton({ choice, onOptionSelected }) {
    return (
      <Button
        variant="container"
        startIcon={<img src={'img/' + choice + '.png'} width='200' heigh='200' />}
        key={choice}
        onClick={() => onOptionSelected(choice)}
      />
    );
  }

  function userSelectionMade(userChoice) {
    nMoves++;
    const markovsChoice = markovChoice();
    const randomsChoice = randomChoice();
    updateMarkovChain(userChoice);

    console.log(`User: ${userChoice}, Markov: ${markovsChoice}`);
    if (userChoice == markovsChoice) {
      console.log('Tie!');
    } else if (userChoice == bestResponse(markovsChoice)) {
      console.log('User wins!');
      nMarkovLosses++;
    } else {
      console.log('Markov wins!');
      nMarkovLosses--;
    }

    console.log(`User: ${userChoice}, Random: ${randomsChoice}`);
    if (userChoice == randomsChoice) {
      console.log('Tie!');
    } else if (userChoice == bestResponse(randomsChoice)) {
      console.log('User wins!');
      nRandomLosses++;
    } else {
      console.log('Random wins!');
      nRandomLosses--;
    }

    var newRound = { x: nMoves, random: nRandomLosses, markov: nMarkovLosses };
    setgamescoreData([...gamescoreData, newRound]); // add a new turn to the dataset
    console.log(gamescoreData)

    var newTurn = { turn: nMoves, randomChoice: randomsChoice, userChoice: userChoice, markovChoice: markovsChoice};
    setturnMemory([newTurn, ...turnMemory]);
  }

  function DisplayUserChoices({ onOptionSelected, onResetScores }) {
    return (
      <Box>
        <Button onClick={ResetScores}>Reset Scores</Button>
        <ButtonGroup align="center">
          <UserChoiceButton choice='rock' onOptionSelected={onOptionSelected} />
          <UserChoiceButton choice='paper' onOptionSelected={onOptionSelected} />
          <UserChoiceButton choice='scissors' onOptionSelected={onOptionSelected} />
        </ButtonGroup>
      </Box>
    );
  }

  function ScoreCardRandom() {
    return (
      <ChartContainer
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
        series={[{ dataKey: 'random', label: 'Random', type: 'line', lineStyle: { stroke: 'blue' } }]}
        width={1200}
        height={800}
        grid={{ vertical: true, horizontal: true }}>
        <LinePlot />
        <MarkPlot />
        <ChartsReferenceLine y={0} lineStyle={{ stroke: 'white' }} />
        <ChartsXAxis />
        <ChartsYAxis />
        <ChartsGrid vertical={true} horizontal={true} />
      </ChartContainer>
    );
  }

  
  function ScoreCardMarkov() {
    return (
      <ChartContainer
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
        series={[{ dataKey: 'markov', label: 'AI', type: 'line', lineStyle: { stroke: 'blue' } }]}
        width={1200}
        height={800}
        grid={{ vertical: true, horizontal: true }}>
        <LinePlot />
        <MarkPlot />
        <ChartsReferenceLine y={0} lineStyle={{ stroke: 'white' }} />
        <ChartsXAxis />
        <ChartsYAxis />
        <ChartsGrid vertical={true} horizontal={true} />
      </ChartContainer>
    );
  }


  }



const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

export default App;
