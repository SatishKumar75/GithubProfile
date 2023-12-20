const APIURL = "https://api.github.com/users/";
const main = document.querySelector("#main");
const searchBox = document.querySelector("#search");
const URL = "https://github.com/";
let followersClickHandler = null;

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
  if (document.getElementById("follow")) {
    document.getElementById("follow").innerHTML = "";
  }
  try {
    main.innerHTML = skeleton;

    const response = await fetch(APIURL + username);
    const data = await response.json();
    // console.log(data);
    if (data.message == "Not Found") {
      throw new Error("User not found");
    }
    if (followersClickHandler) {
      document.removeEventListener("click", followersClickHandler);
    }

    // Add a new click event listener
    followersClickHandler = (event) => {
      if (event.target.id === "followers") {
        getFollowersDetails(data.followers_url);
        console.log(data.followers_url);
      }
    };

    document.addEventListener("click", followersClickHandler);

    const card = `
    
    <div class="card">
        <a href="${URL + username}" target="_blank">
            <img class="avatar skeleton" src="${
              data.avatar_url
            }" alt="Florin pop">
        </a>
        <div class="user-info">
            <h2>${data.name}</h2>
            <p>${data.bio ? data.bio : ""}</p>

            <ul class="info">
                <li >${
                  data.followers
                }<strong id="followers" >Followers</strong> </li>
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
    main.innerHTML = `<h3 class="animate__animated animate__shakeX">${error}</h3>`;
  }
};

const getRepos = async (username) => {
  const repos = document.querySelector("#repo");

  try {
    const response = await fetch(APIURL + username + "/repos");
    const data = await response.json();
    data.length > 10 ? data.splice(15) : null;
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

// Get Followers details

const getFollowersDetails = async (followersUrl) => {
  const followContainer = document.getElementById("follow");
  followContainer.innerHTML = "";

  try {
    const response = await fetch(followersUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch followers. Status: ${response.status}`);
    }

    const followersData = await response.json();

    for (let i = 0; i < Math.min(2, followersData.length); i++) {
      const follower = followersData[i];

      try {
        const followerDetailsResponse = await fetch(follower.url);
        if (!followerDetailsResponse.ok) {
          throw new Error(
            `Failed to fetch follower details. Status: ${followerDetailsResponse.status}`
          );
        }

        const followerDetails = await followerDetailsResponse.json();
        console.log(followerDetails);

        const card = `
          <div class="follow-card">
            <a href="${followerDetails.html_url}" target="_blank">
              <img class="avatar" src="${followerDetails.avatar_url}" alt="${
          followerDetails.login
        }">
            </a>
            <div class="follower-info">
              <h2>${followerDetails.name}</h2>
              <p>${followerDetails.bio || ""}</p>
              <ul class="info">
                <li>${followerDetails.followers} <strong>Followers</strong></li>
                <li>${followerDetails.following} <strong>Following</strong></li>
                <li>${followerDetails.public_repos} <strong>Repos</strong></li>
              </ul>
            </div>
          </div>
        `;
        followContainer.innerHTML += card;
      } catch (detailsError) {
        console.error("Error fetching follower details:", detailsError);
      }
    }
  } catch (error) {
    console.error("Error fetching followers:", error);
  }
};

// Background Animation

let canvas,
  ctx,
  w,
  h,
  moon,
  stars = [],
  meteors = [];

function init() {
  canvas = document.querySelector("#canvas");
  ctx = canvas.getContext("2d");
  resizeReset();
  moon = new Moon();
  for (let a = 0; a < w * h * 0.0003; a++) {
    stars.push(new Star());
  }
  for (let b = 0; b < 5; b++) {
    meteors.push(new Meteor());
  }
  animationLoop();
}

function resizeReset() {
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
}

function animationLoop() {
  ctx.clearRect(0, 0, w, h);
  drawScene();
  requestAnimationFrame(animationLoop);
}

function drawScene() {
  moon.draw();
  stars.map((star) => {
    star.update();
    star.draw();
  });
  meteors.map((meteor) => {
    meteor.update();
    meteor.draw();
  });
}

class Moon {
  draw() {
    ctx.save();
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.shadowColor = "rgba(254, 247, 144, .7)";
    ctx.shadowBlur = 70;
    ctx.fillStyle = "rgba(254, 247, 144, 1)";
    ctx.fill();
    ctx.closePath();
    ctx.restore();
  }
}

class Star {
  constructor() {
    this.x = Math.random() * w;
    this.y = Math.random() * h;
    this.size = Math.random() + 0.5;
    this.blinkChance = 0.005;
    this.alpha = 1;
    this.alphaChange = 0;
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 255, 255, ${this.alpha})`;
    ctx.fill();
    ctx.closePath();
  }
  update() {
    if (this.alphaChange === 0 && Math.random() < this.blinkChance) {
      this.alphaChange = -1;
    } else if (this.alphaChange !== 0) {
      this.alpha += this.alphaChange * 0.05;
      if (this.alpha <= 0) {
        this.alphaChange = 1;
      } else if (this.alpha >= 1) {
        this.alphaChange = 0;
      }
    }
  }
}

class Meteor {
  constructor() {
    this.reset();
  }
  reset() {
    this.x = Math.random() * w + 300;
    this.y = -100;
    this.size = Math.random() * 3 + 0.5;
    this.speed = (Math.random() + 0.5) * 8;
  }
  draw() {
    ctx.save();
    ctx.strokeStyle = "rgba(255, 255, 255, .1)";
    ctx.lineCap = "round";
    ctx.shadowColor = "rgba(255, 255, 255, 1)";
    ctx.shadowBlur = 10;
    for (let i = 0; i < 10; i++) {
      ctx.beginPath();
      ctx.moveTo(this.x, this.y);
      ctx.lineWidth = this.size;
      ctx.lineTo(this.x + 10 * (i + 1), this.y - 10 * (i + 1));
      ctx.stroke();
      ctx.closePath();
    }
    ctx.restore();
  }
  update() {
    this.x -= this.speed;
    this.y += this.speed;
    if (this.y >= h + 100) {
      this.reset();
    }
  }
}

window.addEventListener("DOMContentLoaded", init);
window.addEventListener("resize", resizeReset);

// Follower details
