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
   * Fetch trips from database
   * @returns {Array} trips array
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
        className: [availabilityClass],
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
   * Litir based on availability og difficulty
   */
  function getColor(level) {
      const colors = ['#8A9A5B', '#2C5F2D', '#6B3F1F'];
      const difficultyLevels = ['beginner', 'intermediate', 'advanced'];
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

        eventDiv.style.backgroundColor = info.event.backgroundColor;
        eventDiv.style.color = info.event.textColor;

        eventDiv.innerHTML = `${info.event.title}`;
        return { domNodes: [eventDiv] };
      },
      eventDidMount: function (info) {
        const availabilityText = parseInt(info.event.extendedProps.availability) > 0
    ? "A few seats still available"
    : "Fully booked";
        tippy(info.el, {
          content: `
            Riding Days: ${info.event.extendedProps.riding_days || 'N/A'}<br>
            Difficulty: ${info.event.extendedProps.difficulty || 'Unknown'}<br>
            <br>
            Availability: ${availabilityText}`,
          allowHTML: true,
          placement: 'top',
          theme: 'custom',
          animation: 'shift-away',
          duration: [200, 10],
        });

        info.el.style.cursor = 'pointer';
        info.el.addEventListener('click', function () {
          if (info.event.extendedProps.href) {
            window.open(info.event.extendedProps.href, "_blank");
          }
        });
      }
    });

    calendar.render();
  }

  function addOneDay(date) {
    let dagur = new Date(date);
    dagur.setDate(dagur.getDate() + 1);
    return dagur.toISOString().split("T")[0];
  }

  updateCalendar();
});