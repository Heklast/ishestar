document.addEventListener('DOMContentLoaded', async function () {
  var calendarEl = document.getElementById('calendar');
  const checkboxes = document.querySelectorAll(".checkb");

  checkboxes.forEach(checkbox => {
    checkbox.addEventListener("change", () => {
      checkboxes.forEach(cb => {
        if (cb !== checkbox) cb.checked = false;
      });
      updateCalendar();
    });
  });

  /**
   * Sækja ferðir í database
   * @returns {Array} trips
   */
  async function fetchTrips() {
    try {
      const response = await fetch("/trips");
      const trips = await response.json();
      console.log(trips);

      return trips.map(trip => {
        const isFull = parseInt(trip.availability) === 0;
        const availabilityClass = isFull ? 'trip-full' : 'trip-available';
    return{
        id: trip.id,
        title: trip.title,
        start: trip.start_date,
        end: addOneDay(trip.end_date),
        difficulty: trip.difficulty,
        backgroundColor: getColor(trip.difficulty), 
        textColor: '#FFFFFF',
        href: trip.link,
        riding_days: trip.riding_days,
        groupId: trip.title,
        availability: trip.availability,
        className: [availabilityClass, `event-${trip.id}`],
      }});
    } catch (error) {
      console.error("Error fetching trips:", error);
      return [];
    }
  }

  function isAvailable(availability) {
    return parseInt(availability) > 0;
  }

  /**
   * Litir based on difficulty
   */
  function getColor(level) {
      const colors = ['#2C5F2D','#8A9A5B']; //'#6B3F1F' bruni
      const difficultyLevels = ['intermediate', 'advanced'];
      for (let i = 0; i < difficultyLevels.length; i++) {
        if (level === difficultyLevels[i]) {
          return colors[i];
        }
      }
    return;
  }

  function filterTrips(trips) {
    const selectedCheckbox = document.querySelector(".checkb:checked");
    if (!selectedCheckbox) return trips;

    const selectedFilter = selectedCheckbox.dataset.filter;
    return selectedFilter === "avail" ? trips.filter(trip => isAvailable(trip.availability)) : trips;
  }

  async function updateCalendar() {
    const allTrips = await fetchTrips();
    const filteredTrips = filterTrips(allTrips);

    var calendar = new FullCalendar.Calendar(calendarEl, {
      initialView: 'dayGridMonth',
      slotEventOverlap: false,
      fixedWeekCount: false,
      headerToolbar: {
        left: '',
        center: 'title',
      },
      validRange: {
        start: '2025-06-01',
        end: '2025-10-01',
      },
      height: 'auto',
      events: filteredTrips,
      eventContent: function (info) {
        let eventDiv = document.createElement('div');
        eventDiv.className = 'jaa';

        //eventDiv.style.backgroundColor = info.event.backgroundColor;
        eventDiv.style.color = info.event.textColor;

        eventDiv.innerHTML = `${info.event.title}`;
        return { domNodes: [eventDiv] };
      },
      eventDidMount: function (info) {
        const availabilityText = parseInt(info.event.extendedProps.availability) > 0
    ? "<span style='font-size:14px'><b>A few seats still available!</b></span>"
    :  "<span style='font-size:14px'><b>Fully booked</b></span>";
        tippy(info.el, {
          content: `
            Riding Days: ${info.event.extendedProps.riding_days || 'N/A'}<br>
            Difficulty: ${capitalizeFirst(info.event.extendedProps.difficulty || 'Unknown')}<br>
            <br>
             ${availabilityText}`,
          allowHTML: true,
          placement: 'top',
          theme: 'custom',
          animation: 'shift-away',
          duration: [200, 10],
        });

        info.el.style.cursor = 'pointer';
        info.el.addEventListener('click', function () {
          if (info.event.extendedProps.href) {
            //window.open(info.event.extendedProps.href, "_blank"); þetta opnar í nýjum blank window
            window.location.href = info.event.extendedProps.href;
          }
        });
        const isFull = info.event.classNames.includes("trip-full");

        info.el.setAttribute('data-event-id', info.event.id);
        info.el.addEventListener('mouseenter', function(){
          let relatedEvents=document.querySelectorAll(`[data-event-id="${info.event.id}"]`);
          relatedEvents.forEach(el => {
            if (isFull) {
              el.style.backgroundColor = "#E0E0E0";
            } else {
              el.style.opacity = "0.7";
            }
          });});
          

        info.el.addEventListener('mouseleave', function(){
          const originalColor = getColor(info.event.extendedProps.difficulty);
            let relatedEvents=document.querySelectorAll(`[data-event-id="${info.event.id}"]`);
            relatedEvents.forEach(el => {
              if (isFull) {
                el.style.backgroundColor =originalColor;
              } else {
                el.style.opacity = "1";
              }
            });});   
      }
    });

    calendar.render();
  }

  const params = new URLSearchParams(window.location.search);
  const keysToStrip = ['_gl', '_gcl_au', '_ga', '_ga_PXYSDSG8YH'];

  let shouldStrip = false;
  for (const key of keysToStrip) {
    if (params.has(key)) {
      params.delete(key);
      shouldStrip = true;
    }
  }

  if (shouldStrip) {
    const newUrl = window.location.pathname + (params.toString() ? '?' + params.toString() : '');
    window.history.replaceState({}, document.title, newUrl);
  }

  function capitalizeFirst(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  function addOneDay(date) {
    let dagur = new Date(date);
    dagur.setDate(dagur.getDate() + 1);
    return dagur.toISOString().split("T")[0];
  }

  updateCalendar();
});