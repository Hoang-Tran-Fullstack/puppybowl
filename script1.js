const playerContainer = document.getElementById('all-players-container');
const newPlayerFormContainer = document.getElementById('new-player-form');

// Add your cohort name to the cohortName variable below, replacing the 'COHORT-NAME' placeholder
const cohortName = '2302-ACC-ET-WEB-PT-D';
// Use the APIURL variable for fetch requests
const APIURL = `https://fsa-puppy-bowl.herokuapp.com/api/${cohortName}/players`;

/**
 * It fetches all players from the API and returns them
 * @returns An array of objects.
 */
const fetchAllPlayers = async () => {
    try {
        const response = await fetch(APIURL)
        const players = await response.json()
        console.log(players)
        return players

    } catch (err) {
        console.error('Uh oh, trouble fetching players!', err);
    }
};

const fetchSinglePlayer = async (playerId) => {
    try {
        const response = await fetch(`${APIURL}/${playerId}`)
        const player = await response.json()
        // console.log(player)
        return player
    } catch (err) {
        console.error(`Oh no, trouble fetching player #${playerId}!`, err);
    }
};

const addNewPlayer = async (playerObj) => {
    try {
        const response = await fetch(APIURL, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(playerObj),
        });
      
        if (response.ok) {
            const newPlayer = await response.json();
            console.log('New player added:', newPlayer);
        } else {
            throw new Error('Failed to add player');
        }

    } catch (err) {
        console.error('Oops, something went wrong with adding that player!', err);
    }
};

const removePlayer = async (playerId) => {
    try {
        const response = await fetch(`${APIURL}${playerId}`, {
            method: 'DELETE',
          });
      
          if (response.ok) {
            console.log(`Player #${playerId} removed from the roster.`);
          } else {
            throw new Error(`Failed to remove player #${playerId}`);
          }

    } catch (err) {
        console.error(
            `Whoops, trouble removing player #${playerId} from the roster!`,
            err
        );
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
 * @param playerList - an array of player objects
 * @returns the playerContainerHTML variable.
 */
const renderAllPlayers = async (playerList) => {
    try {
      let playerContainerHTML = '';
    //   const arr = Array.from(playerList)
  
      playerList.forEach((player) => {
        const playerHTML = `
          <div class="player-card">
            <h3>${player.name}</h3>
            <p>${player.breed}</p>
            <p>${player.status}</p>
            <p>${player.createdAt}</p>
            <p>${player.updatedAt}</p>
            <p>${player.teamId}</p>
            <img src:${player.imageUrl}></img>
            <button class="details-btn" data-player-id="${player.id}">See details</button>
            <button class="remove-btn" data-player-id="${player.id}">Remove from roster</button>
          </div>
        `;
        playerContainerHTML += playerHTML;
      });
  
      playerContainer.innerHTML = playerContainerHTML;
  
      // Add event listeners to the buttons
      const detailsButtons = document.querySelectorAll('.details-btn');
      const removeButtons = document.querySelectorAll('.remove-btn');
  
      detailsButtons.forEach((button) => {
        button.addEventListener('click', async () => {
          const playerId = button.getAttribute('data-player-id');
          await fetchSinglePlayer(playerId);
        });
      });
  
      removeButtons.forEach((button) => {
        button.addEventListener('click', async (event) => {
          const playerId = event.target.dataset.id('data-player-id');
          const deleted = await removePlayer(playerId)
          if (deleted) {
            playerHTML.remove()
          }
        });
      });
    } catch (err) {
      console.error('Uh oh, trouble rendering players!', err);
    }
  };
  
          


/**
 * It renders a form to the DOM, and when the form is submitted, it adds a new player to the database,
 * fetches all players from the database, and renders them to the DOM.
 */
const renderNewPlayerForm = () => {
    try {
      const formHTML = `
        <form id="new-player-form">
          <h3>New Player Form</h3>
          <label for="name">Name:</label>
          <input type="text" id="name" name="name" required>
          <label for="breed">Breed:</label>
          <input type="text" id="breed" name="breed" required>
          <button type="submit">Add Player</button>
        </form>
      `;
  
      newPlayerFormContainer.innerHTML = formHTML;
  
      const form = document.getElementById('new-player-form');
      form.addEventListener('submit', async (event) => {
        event.preventDefault();
  
        const nameInput = document.getElementById('name');
        const breedInput = document.getElementById('breed');
  
        const newPlayer = {
          name: nameInput.value,
          breed: breedInput.value,
        };
  
        await addNewPlayer(newPlayer);
        const players = await fetchAllPlayers();
        renderAllPlayers(players);
  
        // Clear the form inputs
        nameInput.value = '';
        breedInput.value = '';
      });
    } catch (err) {
      console.error('Uh oh, trouble rendering the new player form!', err);
    }
  };
  

const init = async () => {
    const players = await fetchAllPlayers();
    renderAllPlayers(players.data.players);

    renderNewPlayerForm();
}

init();