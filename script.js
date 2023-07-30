const APIURL = "https://api.github.com/users/";
const main = document.querySelector("#main");
const searchBox = document.querySelector("#search");

const skeleton = `
<div class="box">
<div class="skeleton">
<div class="skeleton-right">
<div>
     <div class="square"></div>
     </div>
     <div> <div class="line line-square h17 w40 m10"></div>
     <div class="line line-square"></div></div>
     
     </div>
     <div class="skeleton-left">
     <div class="line h17 w40 m10"></div>
     <div class="line"></div>
     
     <div class="line h8 w50"></div>
     <div class="line  w75"></div>
     <div class="line h8 w50"></div>
     </div>
     </div>
     </div>
     `;
const getUser = async (username) => {
  try {
    main.innerHTML = skeleton;

    const response = await fetch(APIURL + username);
    const data = await response.json();
    console.log(data);
    if (data.message == "Not Found") {
      throw new Error("user is not available");
    }

    const card = `
    <div class="card">
    <img class="avatar skeleton" src="${data.avatar_url}" alt="Florin pop">
    <div class="user-info">
    <h2>${data.name}</h2>
    <p>${data.bio ? data.bio : ""}</p>
  
  <ul class="info">
          <li>${data.followers}<strong>Followers</strong> </li>
          <li>${data.following}<strong>Following</strong> </li>
          <li>${data.public_repos} <strong>Repos</strong> </li>
          </ul>
      
          <div id="repo">
          
          </div>
      </div>
      </div>
      `;
    main.innerHTML = card;
    getRepos(username);
  } catch (error) {
    main.innerHTML = `${error}`;
  }
};

const getRepos = async (username) => {
  const repos = document.querySelector("#repo");

  try {
    const response = await fetch(APIURL + username + "/repos");
    const data = await response.json();
    data.length > 10 ? data.splice(10) : null;
    data.forEach((item) => {
      const elem = document.createElement("a");
      elem.classList.add("repo");
      elem.href = item.html_url;
      elem.innerText = item.name;
      elem.target = "_blank";
      repos.appendChild(elem);
    });
  } catch (error) {}
};

const formSubmit = () => {
  if (searchBox.value != "") {
    getUser(searchBox.value);
    searchBox.value = "";
  }
  return false;
};

searchBox.addEventListener("focusout", function () {
  formSubmit();
});
