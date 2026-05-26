document.addEventListener("DOMContentLoaded", function () {
  var filterButtons = document.querySelectorAll(".filter-buttons .gallery-btn");
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
  var defaultCategory = "creativeArts";
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
});

window.addEventListener("DOMContentLoaded", function() {
  var images = document.querySelectorAll(".lazy-load-image");

  function setLazyLoading() {
    var windowWidth = window.innerWidth;

    images.forEach(function(image) {
      if (windowWidth <= 768) {
        image.setAttribute("loading", "lazy");
      } else {
        image.removeAttribute("loading");
      }
    });
  }

  // Call the function on page load
  setLazyLoading();

  // Call the function on window resize
  window.addEventListener("resize", function() {
    setLazyLoading();
  });
});


