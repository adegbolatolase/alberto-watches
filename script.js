var app = angular.module("myApp", ["ngRoute"]);

app.config(function ($routeProvider) {
  $routeProvider
    .when("/", {
      templateUrl: "home.html",
      controller: "HomeController",
      data: {
        pageTitle: "Alberto Watch Company",
        pageCSS: "home-style.css",
      },
    })
    .when("/products", {
      templateUrl: "products.html",
      controller: "ProductsController",
      data: {
        pageTitle: "Products - Alberto Watch Company",
        pageCSS: "products-style.css",
      },
    })
    .when("/technology", {
      templateUrl: "technology.html",
      // controller: "TechnologyController",
      data: {
        pageTitle: "Technology - Alberto Watch Company",
        pageCSS: "tech-style.css",
      },
    })
    .when("/store-locator", {
      templateUrl: "store-locator.html",
      controller: "StoreLocatorController",
      data: {
        pageTitle: "Store Locator - Alberto Watch Company",
        pageCSS: "store-style.css",
      },
    })
    .when("/about", {
      templateUrl: "about.html",
      // controller: 'AboutController',
      data: {
        pageTitle: "About - Alberto Watch Company",
        pageCSS: "about-style.css",
      },
    })
    .when("/contact", {
      templateUrl: "contact.html",
      // controller: 'ContactController',
      data: {
        pageTitle: "Contact - Alberto Watch Company",
        pageCSS: "contact-style.css",
      },
    })
    .otherwise({ redirectTo: "/" });
});

app.controller("NavController", function ($scope, $location) {
  // Function to check if a given route is active
  $scope.isActive = function (route) {
    return route === $location.path();
  };

  // Support dropdown controller
  $scope.isSupportDropdownActive = false;

  $scope.toggleSupportDropdown = function () {
    $scope.isSupportDropdownActive = !$scope.isSupportDropdownActive;
  };
});

app.run(function ($rootScope, $location, $route) {
  $rootScope.$on("$routeChangeSuccess", function (event, current, previous) {
    // Check if there is a route change and the current route has 'data' property
    if (current.$$route && current.$$route.data) {
      $rootScope.pageTitle = current.$$route.data.pageTitle;
      $rootScope.pageCSS = current.$$route.data.pageCSS;
    } else {
      // Fallback values if the route data is missing
      $rootScope.pageTitle = "Default Page Title";
      $rootScope.pageCSS = "default.css";
    }
  });
});

app.controller("StoreLocatorController", function ($scope) {
  const addresses = [
    {
      name: "Location 1",
      address:
        "Shop No. 5, 3rd floor Mega Plaza,14, Idowu Martins Street, Victoria Island, Lagos.",
      coordinates: [6.433398245042587, 3.4205210949841844],
    },
    {
      name: "Location 2",
      address:
        "Entrance 2, Shop 11 ,The Palms Shopping Mall, No. 1 British International School (BIS) Way, Lekki-Epe Expressway, Lagos.",
      coordinates: [6.4434305236170015, 3.450256400658176],
    },
    {
      name: "Location 3",
      address: "Shop L21, Ikeja City Mall, Alausa, Ikeja, Lagos.",
      coordinates: [6.461740444149388, 3.400741144590577],
    },
    {
      name: "Location 4",
      address: "Portharcourt Mall (Ground Floor), Portharcourt, Rivers State.",
      coordinates: [4.786571669810845, 7.04148682318103],
    },
    {
      name: "Location 5",
      address:
        "Ground Floor , Silverbird Entertainment Centre, 1161 Memorial Drive, Central Business District, FCT, Abuja.",
      coordinates: [9.067535770577493, 7.485572395003445],
    },
  ];

  // Initialize the map with the default view set to "Location 1"
  const defaultLocationCoordinates = addresses[0].coordinates;
  const map = L.map("map").setView(defaultLocationCoordinates, 10);

  // Add a tile layer to display the map
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);

  // Function to locate the marker when the "Locate" button is clicked
  function locateMarker(lat, lng) {
    map.setView([lat, lng], 15);
  }

  // Add markers and Locate buttons for each address
  addresses.forEach((location, index) => {
    const marker = L.marker(location.coordinates).addTo(map);

    // Set the popup content for each marker
    marker.bindPopup(location.name);

    // Add click event to each marker to open the popup when clicked
    marker.on("click", () => {
      marker.openPopup();
    });

    // Create the "Locate" button for each address
    const locateButton = document.createElement("button");
    locateButton.innerText = "Locate";
    locateButton.classList.add("view-all-button", "store-btn");
    locateButton.dataset.lat = location.coordinates[0];
    locateButton.dataset.lng = location.coordinates[1];

    // Add click event to each "Locate" button
    locateButton.addEventListener("click", (event) => {
      const lat = parseFloat(event.target.dataset.lat);
      const lng = parseFloat(event.target.dataset.lng);
      locateMarker(lat, lng);
    });

    // Append the "Locate" button to the address item
    const addressItem = document.querySelectorAll(".address-item")[index];
    const locateButtonContainer = addressItem.querySelector(
      ".locate-button-container"
    );
    locateButtonContainer.appendChild(locateButton);
  });
});

app.controller("ProductsController", function ($scope) {
  const popupContainer2 = document.getElementById("popupContainer2");
  const popupContent2 = document.getElementById("popupContent2");
  const closeBtn2 = document.getElementById("closeBtn2");

  var filterButtons = document.querySelectorAll(
    ".filter-buttons .gallery-btn"
  );
  var categorySelect = document.getElementById("category-select");
  var shuffleInstance = new Shuffle(document.querySelector(".gallery"), {
    itemSelector: ".gallery-item",
  });

  categorySelect.addEventListener("change", function (event) {
    var selectedValue = event.target.value;
    shuffleInstance.filter(function (element) {
      var groups = element.getAttribute("data-groups");
      return groups.indexOf(selectedValue) !== -1;
    });
    updateActiveClass(event.target.value);
  });

  filterButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      var selectedGroup = this.getAttribute("data-group");
      shuffleInstance.filter(function (element) {
        var groups = element.getAttribute("data-groups");
        return groups.indexOf(selectedGroup) !== -1;
      });
      updateActiveClass(selectedGroup);
    });
  });

  // Apply default category on page load
  var defaultCategory = "Vintage";
  shuffleInstance.filter(function (element) {
    var groups = element.getAttribute("data-groups");
    return groups.indexOf(defaultCategory) !== -1;
  });
  updateActiveClass(defaultCategory);

  function updateActiveClass(activeGroup) {
    filterButtons.forEach(function (button) {
      if (button.getAttribute("data-group") === activeGroup) {
        button.classList.add("active");
      } else {
        button.classList.remove("active");
      }
    });
    categorySelect.value = activeGroup;
  }

  const gallery = document.querySelector('.gallery');
  console.log(gallery)

  // Load data from JSON file
  fetch('data.json')
    .then(response => response.json())
    .then(data => {
      // Iterate through categories and add content to gallery-items
      Object.keys(data).forEach(categoryName => {
        // Exclude the "NewArrivals" category
        if (categoryName !== "NewArrivals") {
          const category = data[categoryName];
          const galleryItem = gallery.querySelector(`[data-groups='["${categoryName}"]']`);
  
          // Create and append the gallery-container
          const galleryContainer = document.createElement('div');
          galleryContainer.classList.add('watch-container');
          galleryItem.appendChild(galleryContainer);
  
          // Create and append gallery-box elements within the container
          category.forEach(item => {
            const galleryBox = document.createElement('div');
            galleryBox.classList.add('watch-card');
  
            const galleryImg = document.createElement('div');
            galleryImg.classList.add('watch-image');
  
            const img = document.createElement('img');
            img.src = item.image;
            img.alt = 'gallery-image';
            // img.width = '300';
            img.height = '220';
            img.className = 'lazy-load-image';
  
            const desc = document.createElement('div');
            desc.classList.add('watch-name');
            desc.textContent = item.name;

            const price = document.createElement('div');
            price.classList.add('watch-price');
            price.textContent = item.price;
  
            galleryContainer.appendChild(galleryBox);
            galleryBox.appendChild(galleryImg);
            galleryImg.appendChild(img);
            galleryBox.appendChild(desc);
            galleryBox.appendChild(price);
  
            // Add click event listener to gallery-box
            galleryBox.addEventListener("click", () => {
              // Handle click event
              showPopup(item)
            });
          });
        }
      });
    })
    .catch(error => {
      console.error('Error loading data:', error);
    });
    function showPopup(item) {
      popupContent2.innerHTML = `
        <img src="${item.image}" alt="${item.name}" class="watch-image">
        <div class="watch-details">
          <h2 class="watch-name">${item.name}</h2>
          <div class="watch-price">${item.price}</div>
          <p class="watch-description">${item.description}</p>
          <!-- You can display other details here, like the 'details' array -->
        </div>
      `;
    
      popupContainer2.style.display = "flex";
    }
    
    closeBtn2.addEventListener("click", () => {
      popupContainer2.style.display = "none";
    });
});

  
  
app.controller("HomeController", function ($scope, $http) {
  document.addEventListener("DOMContentLoaded", function () {
    // Delay the initialization by 3 seconds (3000 milliseconds)
    setTimeout(function () {
      var myCarousel = new bootstrap.Carousel(document.getElementById('carouselExample'), {
        interval: 5000, // Set the interval to 5 seconds
      });
    }, 3000); // 3 seconds delay
  });
  
  const watchContainer = document.getElementById("watchContainer");
  const popupContainer = document.getElementById("popupContainer");
  const popupContent = document.getElementById("popupContent");
  const closeBtn = document.getElementById("closeBtn");

  // Fetch data from "data.json" using AngularJS $http service
  fetch("data.json")
    .then((response) => response.json())
    .then((data) => {
      if (data && Array.isArray(data.NewArrivals)) {
        const watches = data.NewArrivals;
        let watchCards = [];

        watches.forEach((watch) => {
          const watchCard = document.createElement("div");
          watchCard.classList.add("watch-card");

          const image = document.createElement("img");
          image.classList.add("watch-image");
          image.src = watch.image;
          image.alt = watch.name;

          const name = document.createElement("div");
          name.classList.add("watch-name");
          name.textContent = watch.name;

          const price = document.createElement("div");
          price.classList.add("watch-price");
          price.textContent = watch.price;

          watchCard.appendChild(image);
          watchCard.appendChild(name);
          watchCard.appendChild(price);

          watchContainer.appendChild(watchCard);
          watchCards.push(watchCard);

          watchCard.addEventListener("click", () => {
            showPopup(watch);
          });
        });
      } else {
        console.error(
          "Error: Invalid or missing 'watches' data in the JSON file."
        );
      }
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });

  function showPopup(watch) {
    popupContent.innerHTML = `
      <img src="${watch.image}" alt="${watch.name}" class="watch-image">
      <div class="watch-details">
        <h2 class="watch-name">${watch.name}</h2>
        <div class="watch-price">${watch.price}</div>
        <p class="watch-description">${watch.description}</p>
        <!-- You can display other details here, like the 'details' array -->
      </div>
    `;

    popupContainer.style.display = "flex";
  }

  closeBtn.addEventListener("click", () => {
    popupContainer.style.display = "none";
  });

  const text = new SplitType("#text");

  const tl = gsap.timeline({ defaults: { ease: "power1.out" } });

  tl.to(".char", { y: 0, stagger: 0.05, delay: 0.2, duration: 0.1 });
  tl.to(".ling", { width: "80%", duration: 1, delay: 0.8 });
  tl.to(".header", { y: "-100%", duration: 1, delay: 1 }, "-=1");
});

// Function to get current date and time
function getCurrentDateTime() {
  const currentDate = new Date();
  const dateOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  const timeOptions = {
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    timeZoneName: "short",
  };
  const dateString = currentDate.toLocaleDateString("en-US", dateOptions);
  const timeString = currentDate.toLocaleTimeString("en-US", timeOptions);
  return `${dateString} ${timeString}`;
}

// Function to get current location using geolocation
function getCurrentLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        // Call the reverse geocoding API
        fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
        )
          .then((response) => response.json())
          .then((data) => {
            const state = data.address.state;
            const country = data.address.country;

            const locationString = state
              ? `${state}, ${country}`
              : `${country}`;

            updateTicker(getCurrentDateTime(), locationString);
          })
          .catch((error) => {
            console.error("Error getting geolocation:", error.message);
            // If reverse geocoding fails or state information is not available, use only the country.
            const country = data.address.country;
            const locationString = country;

            updateTicker(getCurrentDateTime(), locationString);
          });
      },
      (error) => {
        console.error("Error getting geolocation:", error.message);
        // If geolocation fails, still update the ticker with just the current date and time.
        updateTicker(getCurrentDateTime());
      }
    );
  } else {
    console.error("Geolocation is not supported by this browser.");
    updateTicker(getCurrentDateTime());
  }
}

// Function to update the ticker content
function updateTicker(dateAndTime, location = "") {
  const tickerContent = document.getElementById("ticker-content");
  tickerContent.textContent = location
    ? `${dateAndTime} | Location: ${location}`
    : dateAndTime;
}

// Update the ticker with current date, time, and location
getCurrentLocation();
// Update the ticker every minute (60,000 milliseconds)
setInterval(getCurrentLocation, 60000);

// Function to perform the counting animation
function countUp(target, duration) {
  const start = 0;
  const increment = Math.ceil(target / (duration / 16));
  let current = 0;

  function updateCount() {
    current += increment;
    if (current >= target) {
      current = target;
    }

    const countElement = document.getElementById("count");
    countElement.textContent = current;

    if (current < target) {
      requestAnimationFrame(updateCount);
    }
  }

  updateCount();
}

// Function to fetch and update the visitor count
function updateVisitorCount() {
  let count = parseInt(localStorage.getItem("visitorCount")) || 0;
  count++; // Increment the count

  // Update the count on the page with the animation
  countUp(count, 2500); // Adjust the duration as needed

  // Store the updated count in local storage
  localStorage.setItem("visitorCount", count.toString());
}

// Call the function to update the visitor count when the page loads
document.addEventListener("DOMContentLoaded", updateVisitorCount);

// JavaScript to toggle the mobile navigation
const navLinks = document.querySelector(".navlinks");
function showMenu() {
  navLinks.style.left = "0";
}
function hideMenu() {
  navLinks.style.left = "-800px";
}
