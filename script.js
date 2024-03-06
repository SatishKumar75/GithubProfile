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
    main.classList.add("show-before");
  } catch (error) {
    main.innerHTML = `<h3 class="animate__animated animate__shakeX">${error}</h3>`;
  }
};

const getRepos = async (username) => {
  try {
    const reposContainer = document.querySelector("#repo");
    const response = await fetch(APIURL + username + "/repos");
    const data = await response.json();

    const topRepos = data.sort(
      (a, b) => new Date(b.pushed_at) - new Date(a.pushed_at)
    );
    const reposHTML = topRepos
      .slice(0, 10)
      .map(
        (item) =>
          `<a class="repo" href="${item.html_url}" target="_blank">${item.name}</a>`
      )
      .join("");
    reposContainer.innerHTML = reposHTML;
  } catch (error) {
    console.error("Error fetching or processing data:", error);
  }
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

    const followerDetailsPromises = followersData
      .slice(0, 4)
      .map(async (follower) => {
        try {
          const followerDetailsResponse = await fetch(follower.url);

          if (!followerDetailsResponse.ok) {
            throw new Error(
              `Failed to fetch follower details. Status: ${followerDetailsResponse.status}`
            );
          }

          return await followerDetailsResponse.json();
        } catch (detailsError) {
          console.error("Error fetching follower details:", detailsError);
          return null;
        }
      });

    const followerDetailsArray = await Promise.all(followerDetailsPromises);

    followerDetailsArray
      .filter((followerDetails) => followerDetails !== null)
      .forEach((followerDetails) => {
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
      });
  } catch (error) {
    console.error("Error fetching followers:", error);
  }
};

// Background Animation
let canvas,
  ctx,
  w,
  h,
  stars = [],
  meteors = [],
  particlesarray = [];

function init() {
  canvas = document.getElementById("canvas");
  ctx = canvas.getContext("2d");
  resizeCanvas();
  createStars();
  createMeteors();
  animate();
  animateParticles();
  window.addEventListener("resize", resizeCanvas);
  canvas1.addEventListener("mousemove", addParticles);
}

function resizeCanvas() {
  w = canvas.width = canvas1.width = window.innerWidth;
  h = canvas.height = canvas1.height = window.innerHeight;
}

function createStars() {
  stars = Array.from({ length: w * h * 0.0003 }, () => new Star());
}

function createMeteors() {
  meteors = Array.from({ length: 5 }, () => new Meteor());
}

function animate() {
  ctx.clearRect(0, 0, w, h);
  drawMeteors();
  stars.forEach((star) => {
    star.update();
    star.draw();
  });
  requestAnimationFrame(animate);
}

function drawMeteors() {
  meteors.forEach((meteor) => {
    meteor.update();
    meteor.draw();
  });
}

// Particle animation
function animateParticles() {
  const canvas1 = document.getElementById("canvas1");
  const ctx1 = canvas1.getContext("2d");
  canvas1.width = window.innerWidth;
  canvas1.height = window.innerHeight;
  particlesarray.forEach((particle, index) => {
    particle.update();
    particle.draw();
    if (particle.size <= 0.1) {
      particlesarray.splice(index, 1);
    }
  });
  requestAnimationFrame(animateParticles);
}

function addParticles(event) {
  const mouse = { x: event.clientX, y: event.clientY };
  for (let i = 0; i < 5; i++) {
    particlesarray.push(new Particle(mouse.x, mouse.y));
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
    this.z = Math.random() * 1000;
    this.size = Math.random() * 3 + 1;
    this.speed = (Math.random() + 0.5) * 8;
  }

  draw() {
    ctx.save();

    const perspective = 1200;
    const scale = perspective / (perspective + this.z);
    const projectedX = this.x * scale;
    const projectedY = this.y * scale;
    const projectedSize = this.size * scale;

    ctx.translate(projectedX, projectedY);
    ctx.scale(scale, scale);

    ctx.strokeStyle = "rgba(255, 255, 255, .1)";
    ctx.lineCap = "round";
    for (let i = 0; i < 10; i++) {
      const opacity = 1 - i * 0.1;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineWidth = projectedSize * 0.3;
      ctx.lineTo(10 * (i + 1), -10 * (i + 1));
      ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
      ctx.stroke();
      ctx.closePath();
    }

    ctx.beginPath();
    ctx.arc(0, 0, projectedSize * 0.5, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
    ctx.fill();
    ctx.closePath();

    // Reset transformations
    ctx.restore();
  }

  update() {
    this.x -= this.speed;
    this.y += this.speed;

    // Reset meteor if out of bounds
    if (this.y >= h + 100) {
      this.reset();
    }
  }
}

const canvas1 = document.getElementById("canvas1");
const ctx1 = canvas1.getContext("2d");

class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = Math.random() * 5 + 1;
    this.speedx = Math.random() * 3 - 1.5;
    this.speedy = Math.random() * 3 - 1.5;
    this.color = "#ffffff"; // Initially set to white
    this.targetColor = getRandomColor();
    this.colorChangeRate = 0.05; // Adjust the speed of color change
  }

  update() {
    this.x += this.speedx;
    this.y += this.speedy;
    if (this.size > 0) {
      this.size -= 0.1;
    }
    this.updateColor();
  }

  draw() {
    ctx1.fillStyle = this.color;
    ctx1.beginPath();
    ctx1.moveTo(this.x, this.y + this.size);
    for (let i = 1; i <= 5; i++) {
      ctx1.lineTo(
        this.x + this.size * Math.cos((i * 4 * Math.PI) / 5),
        this.y + this.size * Math.sin((i * 4 * Math.PI) / 5)
      );
      ctx1.lineTo(
        this.x + (this.size / 2) * Math.cos(((i + 0.5) * 4 * Math.PI) / 5),
        this.y + (this.size / 2) * Math.sin(((i + 0.5) * 4 * Math.PI) / 5)
      );
    }
    ctx1.closePath();
    ctx1.fill();
  }

  updateColor() {
    const diffR = hexToRgb(this.targetColor).r - hexToRgb(this.color).r;
    const diffG = hexToRgb(this.targetColor).g - hexToRgb(this.color).g;
    const diffB = hexToRgb(this.targetColor).b - hexToRgb(this.color).b;

    // Update each RGB component of the color
    const newR = hexToRgb(this.color).r + diffR * this.colorChangeRate;
    const newG = hexToRgb(this.color).g + diffG * this.colorChangeRate;
    const newB = hexToRgb(this.color).b + diffB * this.colorChangeRate;

    // Set the new color
    this.color = rgbToHex(Math.floor(newR), Math.floor(newG), Math.floor(newB));

    // If the color is very close to the target color, set a new target color
    if (
      Math.abs(hexToRgb(this.targetColor).r - hexToRgb(this.color).r) < 1 &&
      Math.abs(hexToRgb(this.targetColor).g - hexToRgb(this.color).g) < 1 &&
      Math.abs(hexToRgb(this.targetColor).b - hexToRgb(this.color).b) < 1
    ) {
      this.targetColor = getRandomColor();
    }
  }
}

function getRandomColor() {
  return "#" + Math.floor(Math.random() * 16777215).toString(16);
}

function hexToRgb(hex) {
  const bigint = parseInt(hex.substring(1), 16);
  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255,
  };
}

function rgbToHex(r, g, b) {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

// Your other code here...

init();
