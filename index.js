function toggleDiv(event, divId) {
  event.preventDefault();
  const div = document.getElementById(divId);
  div.style.display = (div.style.display === 'none' || div.style.display === '') ? 'block' : 'none';
}

// Store original coordinates when the page loads
document.addEventListener("DOMContentLoaded", () => {
  const areas = document.querySelectorAll("map[name='datamap'] area");
  areas.forEach(area => {
      area.setAttribute("data-original-coords", area.getAttribute("coords"));
  });
});

// Image map scaling with ResizeObserver for better responsiveness
function scaleImageMap() {
  const img = document.querySelector('#datamap');
  const map = document.querySelector('map[name="datamap"]');
  const areas = map.getElementsByTagName('area');
  const originalWidth = 1080;
  const scale = img.clientWidth / originalWidth;

  for (let area of areas) {
      const originalCoords = area.getAttribute('data-original-coords').split(',').map(Number);
      const scaledCoords = originalCoords.map(coord => Math.round(coord * scale));
      area.setAttribute("coords", scaledCoords.join(','));
  }
}

// Use ResizeObserver for efficient resizing
const img = document.querySelector('#datamap');
const observer = new ResizeObserver(() => scaleImageMap());
observer.observe(img);

// Show pop-up and dynamically position it
document.addEventListener("DOMContentLoaded", () => {
  const image = document.getElementById("datamap");
  const mapContainer = document.querySelector(".image-scale");

  function showPin(event, pinId) {
      event.preventDefault();

      // Hide any already open pins
      document.querySelectorAll(".pin").forEach(pin => pin.style.display = "none");

      const pin = document.getElementById(pinId);
      const rect = image.getBoundingClientRect();

      // Determine touch or click position
      const posX = event.clientX || event.touches[0].clientX;
      const posY = event.clientY || event.touches[0].clientY;

      // Position and scale the pop-up dynamically
      pin.style.display = "block";
      pin.style.left = `${posX - mapContainer.offsetLeft}px`;
      pin.style.top = `${posY - mapContainer.offsetTop}px`;
      pin.style.transform = `scale(${rect.width / image.naturalWidth}) translate(-50%, -50%)`;
  }

  // Attach the event listener for both click & touch
  const areas = document.querySelectorAll("map[name='datamap'] area");
  areas.forEach(area => {
      area.addEventListener("click", event => {
          const pinId = area.getAttribute("onclick").match(/'(.*?)'/)[1];
          showPin(event, pinId);
      });

      area.addEventListener("touchstart", event => {
          const pinId = area.getAttribute("onclick").match(/'(.*?)'/)[1];
          showPin(event, pinId);
      });
  });

  // Close pop-ups when clicking outside
  document.addEventListener("click", (event) => {
      if (!event.target.closest(".pin") && !event.target.closest("area")) {
          document.querySelectorAll(".pin").forEach(pin => pin.style.display = "none");
      }
  });
});