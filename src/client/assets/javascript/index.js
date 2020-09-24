// PROVIDED CODE BELOW (LINES 1 - 80) DO NOT REMOVE
// The store will hold all information needed globally
let store = {
  track_id: undefined,
  player_id: undefined,
  race_id: undefined,
  car_model: undefined,
};
let OtherCarsInTheRace = [];
let racers;
let carsModel = {
  images: [
    {
      id: 1,

      car: "../assets/images/car1.png",
    },
    {
      id: 2,

      car: "../assets/images/car2.png",
    },
    {
      id: 3,

      car: "../assets/images/car3.png",
    },
    {
      id: 4,

      car: "../assets/images/car4.png",
    },
    {
      id: 5,

      car: "../assets/images/car5.png",
    },
    {
      id: 6,

      car: "../assets/images/car6.png",
    },
  ],
};
// We need our javascript to wait until the DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  onPageLoad();
  setupClickHandlers();
});

async function onPageLoad() {
  try {
    getTracks().then((tracks) => {
      const html = renderTrackCards(tracks);
      renderAt("#tracks", html);
    });

    getRacers().then((racers) => {
      numberOfRacers = racers.length;
      const html = renderRacerCars(racers);
      renderAt("#racers", html);
    });

    renderAt("#cars", renderCars(carsModel));
  } catch (error) {
    console.log("Problem getting tracks and racers ::", error.message);
    console.error(error);
  }
}

function setupClickHandlers() {
  document.addEventListener(
    "click",
    function (event) {
      let { target } = event;

      // Race track form field
      //This is to avoid missclicks
      if (target.matches("img") || target.matches("p") || target.matches("h3")) {
        target = target.parentElement;
      }
      if (target.matches(".track")) {
        handleSelectTrack(target);
      }

      // Podracer form field
      if (target.matches(".racer")) {
        handleSelectPodRacer(target);
      }

      // car model form field

      if (target.matches(".model")) {
        handleSelectCar(target);
      }

      // Submit create race form
      if (target.matches("#submit-create-race")) {
        event.preventDefault();

        // start race
        handleCreateRace();
      }

      // Handle acceleration click
      if (target.matches("#gas-peddle")) {
        handleAccelerate(target);
      }
    },
    false
  );
}

async function delay(ms) {
  try {
    return await new Promise((resolve) => setTimeout(resolve, ms));
  } catch (error) {
    console.log(error);
  }
}
// ^ PROVIDED CODE ^ DO NOT REMOVE

// This async function controls the flow of the race, add the logic and error handling
async function handleCreateRace() {
  // render starting UI
  // TODO - Get player_id and track_id from the store

  if (!store.player_id || !store.track_id) {
    alert("Please select racer and track");
    return false;
  }

  // const race = TODO - invoke the API call to create the race, then save the result

  try {
    createRace(store.player_id, store.track_id, store.car_model)
      .then((res) => {
        const race = res;
        // TODO - update the store with the race id

        store.race_id = race.ID - 1;
        renderAt("#race", renderRaceStartView(race.Track));
        // The race has been created, now start the countdown
        // TODO - call the async function runCountdown

        return runCountdown();
      })
      .then(() => assignCars(store.car_model))

      .then(() => startRace(store.race_id))
      // TODO - call the async function runRace
      // TODO - call the async function startRace
      .then(() => runRace(store.race_id))
      .then((res) => renderAt("#race", resultsView(res.positions)));
  } catch (err) {
    console.log(err);
  }
}
function assignCars() {
  let coches = 0;
  return new Promise((resolve) => {
    for (let index = 0; index < racers.length; index++) {
      if (index != parseInt(store.player_id) - 1) {
        if (coches != parseInt(store.car_model - 1)) {
          Object.assign(racers[index], carsModel.images[coches]);
          coches++;
        }
        else {
          coches++;
          Object.assign(racers[index], carsModel.images[coches]);
          coches++;
        }

      }
    }
    resolve();
  }).catch((err) => {
    console.log("Problem with assignCars request::", err);
  });
}


function runRace(raceID) {
  const raceInterval = 500;
  // TODO - use Javascript's built in setInterval method to get race info every 500ms
  let racestatus;
  return new Promise((resolve) => {
    setInterval(function () {
      racestatus = getRace(raceID).then((res) => {
        if (res.status != "finished") {
          renderAt("#leaderBoard", raceProgress(res.positions));
        } else {
          clearInterval(raceInterval); // clearing interval
          resolve(res); // resolving promise
        }
      });
    }, raceInterval);
  }).catch((err) => {
    console.log("Problem with runRace request::", err);
  });
}

async function runCountdown() {
  try {
    // wait for the DOM to load
    await delay(1000);
    let timer = 3;

    return new Promise((resolve) => {
      // TODO - use Javascript's built in setInterval method to count down once per second

      // run this DOM manipulation to decrement the countdown for the user
      const StartYourEngines = setInterval(() => {
        if (timer == 0) {
          clearInterval(StartYourEngines);
          resolve();
        } else {
          document.getElementById("big-numbers").innerHTML = --timer;
        }
      }, 1000);
      // TODO - if the countdown is done, clear the interval, resolve the promise, and return
    });
  } catch (error) {
    console.log(error);
  }
}

function handleSelectPodRacer(target) {
  console.log("selected a racer", target.id);

  // remove class selected from all racer options
  const selected = document.querySelector("#racers .selected");
  if (selected) {
    selected.classList.remove("selected");
  }

  // add class selected to current target
  target.classList.add("selected");
  // TODO - save the selected racer to the store
  store.player_id = target.id;
}
function handleSelectCar(target) {
  console.log("selected a car", target.id);

  // remove class selected from all racer options
  const selected = document.querySelector("#cars .selected");
  if (selected) {
    selected.classList.remove("selected");
  }

  // add class selected to current target
  target.classList.add("selected");
  // TODO - save the selected car to the store

  store.car_model = target.id;

}
function handleSelectTrack(target) {
  console.log("selected a track", target.id);

  // remove class selected from all track options
  const selected = document.querySelector("#tracks .selected");
  if (selected) {
    selected.classList.remove("selected");
  }

  // add class selected to current target
  target.classList.add("selected");
  // TODO - save the selected track id to the store

  store.track_id = target.id;

}

function handleAccelerate() {
  // TODO - Invoke the API call to accelerate

  accelerate(store.race_id)
    .then(() => console.log("Engine goes BRRRRR!"))
    .catch(() => console.log("error! engine broken :("));
}

// HTML VIEWS ------------------------------------------------
// Provided code - do not remove

function renderRacerCars(racers) {
  if (!racers.length) {
    return `
			<h4>Loading Racers...</4>
		`;
  }

  const results = racers.map(renderRacerCard).join("");

  return `
		<ul id="racers">
			${results}
		</ul>
	`;
}
function renderCars(cars) {
  if (!cars.images.length) {
    return `
			<h4>Loading cars...</4>
		`;
  }
  const results = cars.images.map(renderCarModel).join("");

  return `
		<ul id="cars">
    ${results}
		</ul>
	`;
}
function renderCarModel(cardata) {
  return `
    <li class="card model" id="${cardata.id}">
    <img src="${cardata.car}" alt="Car Img" width="200" height="200">


		</li>
	`;
}
function renderRacerCard(racer) {
  const { id, driver_name, top_speed, acceleration, handling } = racer;

  return `
    <li class="card racer" id="${id}">
      <h4>Name: ${driver_name}</h4>

			<p>Top Speed: ${top_speed}</p>
			<p>Acceleration: ${acceleration}</p>
      <p>Handling: ${handling}</p>

		</li>
	`;
}

function renderTrackCards(tracks) {
  if (!tracks.length) {
    return `
			<h4>Loading Tracks...</4>
		`;
  }

  const results = tracks.map(renderTrackCard).join("");

  return `
		<ul id="tracks">
			${results}
		</ul>
	`;
}

function renderTrackCard(track) {
  const { id, name } = track;

  return `
		<li id="${id}" class="card track">
			<h3>${name}</h3>
		</li>
	`;
}

function renderCountdown(count) {
  return `
		<h2>Race Starts In...</h2>
		<p id="big-numbers">${count}</p>
	`;
}

function renderRaceStartView(track, racers) {
  return `
		<header>
			<h1>Race: ${track.name}</h1>
		</header>
		<main id="two-columns">
			<section id="leaderBoard">
				${renderCountdown(3)}
			</section>

			<section id="accelerate">
				<h2>Directions</h2>
				<p>Click the button as fast as you can to make your racer go faster!</p>
				<button id="gas-peddle">Click Me To Win!</button>
			</section>
		</main>
		<footer></footer>
	`;
}

function resultsView(positions) {
  // THIS IS SO BROKEN IN API!!! (Last is first???)
  positions.sort((a, b) => (a.final_position < b.final_position ? 1 : -1));

  //completionPercentage = completetion*100
  return `
		<header>
			<h1>Race Results</h1>
		</header>
		<main>
			${raceProgress(positions)}
			<a href="/race">Start a new race</a>
		</main>
	`;
}

function raceProgress(positions) {
  let userPlayer = positions.find((e) => e.id === parseInt(store.player_id));
  userPlayer.driver_name += " (you)";
  let mycar = carsModel.images.find((e) => e.id == parseInt(store.car_model));

  positions = positions.sort((a, b) => (a.segment > b.segment ? -1 : 1));
  let count = 1;

  const completetion = (positions[0].segment / 201) * 100;
  var otroscorredores = racers;

  const results = positions.map((p) => {
    // if (positions[0].id == p.id) {
    //   trophy = "<div class=`trophy`></div>"
    // }
    if (p.id == store.player_id) {
      return `
			<tr>
				<td>
          <h3>${count++} - ${p.driver_name}  <img width="15%" src="${mycar.car}"> </h3>
         
				</td>
			</tr>
    `;
    }
    let imagecar = otroscorredores.find((e) => e.id == p.id);

    if (imagecar) {
      return `
			<tr>
				<td>
          <h3>${count++} - ${p.driver_name} <img width="15%" src="${imagecar.car}"> </h3>
				</td>
			</tr>
    `;
    }
    return '';
  });

  return `
		<main>
      <h3>Leaderboard </h3>
      <h3>Race Completion ${completetion.toFixed(0)}%</h3>

			<section id="leaderBoard">
				${results}
			</section>
		</main>
	`;
}

function renderAt(element, html) {
  const node = document.querySelector(element);

  node.innerHTML = html;
}

// ^ Provided code ^ do not remove

// API CALLS ------------------------------------------------

const SERVER = "http://localhost:8000";

function defaultFetchOpts() {
  return {
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": SERVER,
    },
  };
}

// TODO - Make a fetch call (with error handling!) to each of the following API endpoints

// GET request to `${SERVER}/api/tracks`

function getTracks() {
  // GET request to `${SERVER}/api/tracks`
  return fetch(`${SERVER}/api/tracks`, {
    method: "GET",
    ...defaultFetchOpts(),
  })
    .then((res) => res.json())
    .catch((err) => console.log("Problem with getTracks request::", err));
}

function getRacers() {
  // GET request to `${SERVER}/api/cars`
  return fetch(`${SERVER}/api/cars`, {
    method: "GET",
    ...defaultFetchOpts(),
  })
    .then((res) => racers = res.json())
    .then((racersJson) => racers = racersJson)
    .catch((err) => console.log("Problem with getRacers request::", err));
}

function createRace(player_id, track_id) {
  player_id = parseInt(player_id);
  track_id = parseInt(track_id);

  const body = { player_id, track_id };

  return fetch(`${SERVER}/api/races`, {
    method: "POST",
    ...defaultFetchOpts(),
    dataType: "json",
    body: JSON.stringify(body),
  })
    .then((res) => res.json())
    .catch((err) => console.log("Problem with createRace request::", err));
}
// GET request to `${SERVER}/api/races/${id}`
function getRace(id) {
  let race_id = parseInt(id);
  return fetch(`${SERVER}/api/races/${race_id}`, {
    method: "GET",
    ...defaultFetchOpts(),
    dataType: "json",
  })
    .then((res) => res.json())

    .catch((err) => { store.race_id = 0; console.log("Problem with getRace request::", err) });
}

function startRace(id) {
  let race_id = parseInt(id);

  return fetch(`${SERVER}/api/races/${race_id}/start`, {
    method: "POST",
    ...defaultFetchOpts(),
  })
    .then((res) => res.json())
    .catch((err) =>
      console.log("Problem with startRace request::", err));
}

function accelerate(id) {
  const race_id = parseInt(id);
  return fetch(`${SERVER}/api/races/${race_id}/accelerate`, {
    ...defaultFetchOpts(),
    method: "POST",
  })
    .catch((err) =>
      console.log("Problem with startRace request::", err));;
}
