const divEle = document.querySelector(".card-container");

function getDetails(id) {
  const request1 = fetch(`https://dummyjson.com/users/${id}`);
  fetchUser(request1, "ID does not match any data", "beforeend");

  const request2 = fetch(`https://dummyjson.com/users/${id - 1}`);
  fetchUser(request2, "No previous ID exists", "afterbegin", "other");

  const request3 = fetch(`https://dummyjson.com/users/${id + 1}`);
  fetchUser(request3, "ID does not match any data", "beforeend", "other");

  //   request
  //     .then(response => {
  //       if (!response.ok) {
  //         throw new Error("ID does not match any data");
  //       }
  //       return response.json();
  //     })
  //     .then(user => {
  //       displayUser(user, "beforeend");
  //       return fetch(`https://dummyjson.com/users/${id - 1}`);
  //     })
  //     .then(response => {
  //       if (!response.ok) {
  //         throw new Error("No previous ID exists");
  //       }
  //       return response.json();
  //     })
  //     .then(user => {
  //       displayUser(user,"afterbegin","other");
  //       return fetch(`https://dummyjson.com/users/${id + 1}`);
  //     })
  //     .then(response => {
  //       if (!response.ok) {
  //         throw new Error("ID does not match any data");
  //       }
  //       return response.json();
  //     })
  //     .then(user => {
  //       displayUser(user, "beforeend","other");
  //     })
  //     .catch(err => {
  //       console.error(err);
  //     });
}

function fetchUser(promiseObj, msg, displaypos, displayclass) {
  promiseObj
    .then(response => {
      if (!response.ok) {
        throw new Error(msg);
      }
      return response.json();
    })
    .then(user => {
      displayUser(user, displaypos, displayclass);
    })
    .catch(err => {
      console.error(err);
    });
}
function displayUser(data, pos, className = "") {
  const card = `<div class="user-card ${className}">
      <img src="${data.image}" alt="Profile Image" />
      <h3>${data.firstName}</h3>
      <h3>${data.lastName}</h3>
      <p class="email">${data.email}</p>
      <button class="btn">View Profile</button>
      </div>`;

  divEle.insertAdjacentHTML(pos, card);
}

getDetails(2);
