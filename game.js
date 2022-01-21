// eslint-disable-next-line no-unused-vars
function main() {
  console.log("Welcome to RPS-JS!");
  game();
  console.log("Goodbye!");
}

function game () {
  for (let i = 0; i < 5; i++) {
    const computerSelection = computerPlay();
    const playerSelection = humanPlay();
    if (playerSelection === null) {
      break;
    }
    playRound(playerSelection, computerSelection);
  };
};

function computerPlay() {
  const randomInt = getRandomPosInt(2);
  return playFromInt(randomInt);
};

function humanPlay() {
  const message = `Play one of "rock", "paper", "scissors"`;
  let input = prompt(message);
  let accepted = false;
  while (!accepted) {
    switch (input) {
      case "paper":
      case "rock":
      case "scissors":
      case null:
        accepted = true;
        return input;
      default:
        console.log(`Improper input ${input}.`);
        input = prompt(message);
    }
  }
}

function playRound(playerSelection, computerSelection) {
  const [result, winner, loser] = getResult(playerSelection, computerSelection);
  switch (result) {
    case "tie":
      console.log(`You ${result}. Both played ${playerSelection}.`);
      break;
    default:
      console.log(`You ${result}! ${capitalize(winner)} beats ${loser}.`);
      break;
  }
};

function getResult(player, computer) {
  switch (beats(player, computer)) {
    case (-1n):
      return ["lose", computer, player]
    case (0n):
      return ["tie"]
    case (1n):
      return ["win", player, computer]
  }
};

function beats(left, right) {
  // the results can be represented by this matrix M,
  // where - stands in for -1:
  //   p r s
  // p 0 1 -
  // r - 0 1
  // s 1 - 0
  //
  // we can simplify the logic by incorporating the
  // antisymmetry, Mij = -Mji, and recognizing
  // that the columns are in lexical order.
  //
  // so we break the results into three classes:
  //   p r s
  // p \ x x
  // r - \ x
  // s - - \

  // \: inputs are equal, so it's a tie
  if (left === right) {
    return 0n;
  }

  // -: right is before left in lexical order
  if (left > right) {
    // reverse the order
    const swappedResult = beats(right, left);
    // and then reverse the result, Mji = -Mji
    return -1n * swappedResult;
  }

  // x: left is before right in lexical order
  //  so let's implement the comparisons
  switch (left) {
    case "paper":
      if (right === "rock") {
        return 1n;
      }
      else if (right === "scissors") {
        return -1n;
      }
      break;
    case "rock": // right must be "scissors"
      return 1n;
  }
}

function capitalize(string) {
  const [first, rest] = [string[0], string.slice(1)];
  switch (first) {
    case undefined:
      return ""
    default:
      return `${first.toUpperCase()}${rest}`
  }
}

function getRandomPosInt(max) {
  max = Math.ceil(max);
  let value = Math.random() % 1; // modulo prevents rare misbehavior of return === max + 1 on value === 1;
  value *= max + 1;
  value = Math.floor(value);
  return value;
}

function playFromInt(integer) {
  switch (integer) {
    case 0:
      return "paper";
    case 1:
      return "rock";
    case 2:
      return "scissors";
    default:
      throw String `bad RNG ${integer}`
  };
}
