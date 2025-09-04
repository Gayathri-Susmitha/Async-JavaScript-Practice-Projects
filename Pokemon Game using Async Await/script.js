const POKEAPI_URL = "https://pokeapi.co/api/v2/pokemon/";
let allPokemon = [];
let player1Score = 0;
let player2Score = 0;

const fightButton = document.getElementById("fight");
const p1NameSpan = document.getElementById("p1_name");
const p1ScoreSpan = document.getElementById("p1_score");
const p2NameSpan = document.getElementById("p2_name");
const p2ScoreSpan = document.getElementById("p2_score");

const img1 = document.querySelector("#img1");
const name1 = document.querySelector("#name1");
const experience1 = document.querySelector("#experience1");
const abilities1 = document.querySelector("#abilities1");

const img2 = document.querySelector("#img2");
const name2 = document.querySelector("#name2");
const experience2 = document.querySelector("#experience2");
const abilities2 = document.querySelector("#abilities2");

async function fetchAllPokemonList() {
  try {
    const response = await fetch(`${POKEAPI_URL}`);
    if (!response.ok) {
      throw new Error("Pokemon data not found!");
    }
    const data = await response.json();
    allPokemon = data.results;
  } catch (err) {
    console.error("Error fetching pokemon list", err);
    throw err;
  }
}

async function getRandomPokemonData() {
  if (allPokemon.length === 0) {
    console.log("Pokemon list is empty");
    return null;
  }

  const randomIndex = Math.floor(Math.random() * allPokemon.length);
  const pokemonUrl = allPokemon[randomIndex].url;

  try {
    const response = await fetch(pokemonUrl);
    if (!response.ok) {
      throw new Error("Unable to fetch detailed pokemon details");
    }
    const data = await response.json();
    return {
      name: data.name.charAt(0).toUpperCase() + data.name.slice(1),
      experience: data.base_experience,
      image: data.sprites.front_default,
      abilities: data.abilities.map(able => able.ability.name),
    };
  } catch (err) {
    console.error(
      `Error fetching detailed Pokemon data for ${pokemonUrl}:`,
      err
    );
    return null;
  }
}

function renderPokemonCard(
  imgElement,
  nameElement,
  experienceElement,
  abilitiesElement,
  pokemonData
) {
  if (!pokemonData) {
    imgElement.src = "https://via.placeholder.com/150?text=Error";
    nameElement.textContent = "Error";
    experienceElement.textContent = "EXP: N/A";
    abilitiesElement.innerHTML = "<li>Error loading abilities</li>";
    return;
  }

  imgElement.src = pokemonData.image;
  imgElement.alt = pokemonData.name;
  nameElement.textContent = pokemonData.name;
  experienceElement.textContent = `EXP: ${pokemonData.experience}`;

  abilitiesElement.innerHTML = `<li>Abilities:</li>`;
  if (pokemonData.abilities && pokemonData.abilities.length > 0) {
    pokemonData.abilities.forEach(ability => {
      const li = document.createElement("li");
      li.textContent = ability;
      abilitiesElement.appendChild(li);
    });
  } else {
    const li = document.createElement("li");
    li.textContent = "No known abilities";
    abilitiesElement.appendChild(li);
  }
}

function updateScore() {
  p1ScoreSpan.textContent = `Score:${player1Score}`;
  p2ScoreSpan.textContent = `Score: ${player2Score}`;
}

async function fightHandler() {
  fightButton.disabled = true;
  try {
    const [pokemon1Details, pokemon2Details] = await Promise.all([
      getRandomPokemonData(),
      getRandomPokemonData(),
    ]);

    renderPokemonCard(img1, name1, experience1, abilities1, pokemon1Details);
    renderPokemonCard(img2, name2, experience2, abilities2, pokemon2Details);

    if (pokemon1Details && pokemon2Details) {
      if (pokemon1Details.experience > pokemon2Details.experience) {
        player1Score++;
      } else if (pokemon2Details.experience > pokemon1Details.experience) {
        player2Score++;
      } else {
        console.log("It's a draw!");
      }
    } else {
      console.error(
        "One or both Pokemon failed to load. Cannot determine winner."
      );
    }
    updateScore();
  } catch (err) {
    console.error("Error during fight:", err);
  } finally {
    fightButton.disabled = false;
  }
}

async function initGame() {
  p1NameSpan.textContent = "Alice";
  p2NameSpan.textContent = "Bob";
  updateScore();

  try {
    await fetchAllPokemonList();
    if (allPokemon.length > 0) {
      fightButton.addEventListener("click", fightHandler);
    } else {
      console.log("Could not load Pokemon list. Game cannot start.");
      fightButton.disabled = true;
    }
  } catch (err) {
    console.error("An error occurred while initializing the game:", err);
    fightButton.disabled = true;
  }
}
document.addEventListener("DOMContentLoaded", initGame);
