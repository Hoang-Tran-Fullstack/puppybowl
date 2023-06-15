// if (typeof document !== 'undefined') {
const playerContainer = document.getElementById('all-players-container');
const newPlayerFormContainer = document.getElementById('new-player-form');


// Add your cohort name to the cohortName variable below, replacing the 'COHORT-NAME' placeholder
const cohortName = '2302-ACC-ET-WEB-PT-D';
// Use the APIURL variable for fetch requests
const APIURL = `https://fsa-puppy-bowl.herokuapp.com/api/${cohortName}/players`


/**
 * It fetches all players from the API and returns them
 * @returns An array of objects.
 */
const fetchAllPlayers = async () => {
    try {
      const response = await fetch(APIURL);
      const data = await response.json();
      console.log(data)
      return data;
    } catch (err) {
      console.error('Uh oh, trouble fetching players!', err);
      return [];
    }
  };
  

  const fetchSinglePlayer = async (playerId) => {
    try {
      const response = await fetch(APIURL + `players/${playerId}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch player #${playerId}`);
      }
      const data = await response.json();
      return data;
    } catch (err) {
      console.error(`Oh no, trouble fetching player #${playerId}!`, err);
      return null;
    }
  };
  

  const addNewPlayer = async (playerObj) => {
    try {
      const response = await fetch(APIURL + 'players', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(playerObj)
      });
  
      if (!response.ok) {
        throw new Error('Failed to add a new player');
      }
      const data = await response.json();
      return data;
    } catch (err) {
      console.error('Oops, something went wrong with adding that player!', err);
      return null;
    }
  };
  

  const removePlayer = async (playerId) => {
    try {
      const response = await fetch(APIURL + `players/${playerId}`, {
        method: 'DELETE'
      });
  
      if (!response.ok) {
        throw new Error(`Failed to remove player #${playerId} from the roster`);
      }
  
      return true;
    } catch (err) {
      console.error(`Whoops, trouble removing player #${playerId} from the roster!`, err);
      return false;
    }
  };
  

/**
 * It takes an array of player objects, loops through them, and creates a string of HTML for each
 * player, then adds that string to a larger string of HTML that represents all the players. 
 * 
 * Then it takes that larger string of HTML and adds it to the DOM. 
 * 
 * It also adds event listeners to the buttons in each player card. 
 * 
 * The event listeners are for the "See details" and "Remove from roster" buttons. 
 * 
 * The "See details" button calls the `fetchSinglePlayer` function, which makes a fetch request to the
 * API to get the details for a single player. 
 * 
 * The "Remove from roster" button calls the `removePlayer` function, which makes a fetch request to
 * the API to remove a player from the roster. 
 * 
 * The `fetchSinglePlayer` and `removePlayer` functions are defined in the
 * param playerList - an array of player objects
 * returns the playerContainerHTML variable.
 */
const renderAllPlayers = async (players) => {
    try {
      let playerContainerHTML = '';
  
      
        // Loop through each player in the playerList
        players.forEach((player) => {
          // Create HTML string for the player card
          const playerCardHTML = `
            <div class="player-card">
              <h3>${player.name}</h3>
              <p>breed: ${player.breed}</p>
              <p>Number: ${player.number}</p>
              <button class="details-button" data-player-id="${player.id}">See details</button>
              <button class="remove-button" data-player-id="${player.id}">Remove from roster</button>
            </div>
          `;
  
          // Append the player card HTML to the playerContainerHTML
          playerContainerHTML += playerCardHTML;
        });
      
  
      // Add the playerContainerHTML to the DOM
      playerContainer.innerHTML = playerContainerHTML;
  
      // Add event listeners to the buttons in each player card
      const detailsButtons = document.querySelectorAll('.details-button');
      detailsButtons.forEach((button) => {
        button.addEventListener('click', () => {
          const playerId = button.getAttribute('data-player-id');
          fetchSinglePlayer(playerId);
        });
      });
  
      const removeButtons = document.querySelectorAll('.remove-button');
      removeButtons.forEach((button) => {
        button.addEventListener('click', () => {
          const playerId = button.getAttribute('data-player-id');
          removePlayer(playerId);
        });
      });
    } catch (err) {
      console.error('Uh oh, trouble rendering players!', err);
    }
  };
  
  


// /**
//  * It renders a form to the DOM, and when the form is submitted, it adds a new player to the database,
//  * fetches all players from the database, and renders them to the DOM.
//  */
const renderNewPlayerForm = () => {
    try {
      const formHTML = `
        <form id="add-player-form">
          <h2>Add New Player</h2>
          <label for="name">Name:</label>
          <input type="text" id="name" name="name" required>
          <label for="position">Position:</label>
          <input type="text" id="position" name="position" required>
          <label for="number">Number:</label>
          <input type="number" id="number" name="number" required>
          <button type="submit">Add Player</button>
        </form>
      `;
  
      newPlayerFormContainer.innerHTML = formHTML;
  
      const addPlayerForm = document.getElementById('add-player-form');
      addPlayerForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const nameInput = document.getElementById('name');
        const positionInput = document.getElementById('position');
        const numberInput = document.getElementById('number');
  
        const playerObj = {
          name: nameInput.value,
          position: positionInput.value,
          number: numberInput.value
        };
  
        await addNewPlayer(playerObj);
  
        nameInput.value = '';
        positionInput.value = '';
        numberInput.value = '';
  
        const players = await fetchAllPlayers();
        renderAllPlayers(players);
      });
    } catch (err) {
      console.error('Uh oh, trouble rendering the new player form!', err);
    }
  };
  

const init = async () => {
    const players = await fetchAllPlayers();
    // renderAllPlayers(players);

    // renderNewPlayerForm();
}

init();