document.addEventListener('DOMContentLoaded', async function () {
    var calendarEl = document.getElementById('calendar');
  

    /**
     * lesa í databaseinu
     * @returns 
     */
    async function fetchTrips() {
      try {
        const response = await fetch("http://localhost:3000/trips");
        const trips = await response.json();
        console.log(trips);
        return trips.map(trip => ({
          title: trip.title,
          start: trip.start_date,
          end: addOneDay(trip.end_date),
          color:getColor(trips, trip.title),
          href: trip.link,
        }));
      } catch (error) {
        console.error("Error fetching trips:", error);
        return [];
      }
    }

    /**
     * velja liti fyrir ferðir eftir nöfnum á ferðunum
     * @param {} trips 
     * @param {*} titl 
     * @returns 
     */
    function getColor(trips, titl){
            const colors = ['yellow', 'red', 'green', 'blue', 'purple'];
            const tripss=trips.map(trip=>({title:trip.title}))
            const index=tripss.findIndex(trip=>trip.title==titl);
            return colors[index];
    }

    /**
     * Bæta einum degi við end_date
     */
    function addOneDay(date){
        let dagur=new Date(date);
        dagur.setDate(dagur.getDate()+1);
        return dagur.toISOString().split("T")[0];
    }
  
   //setja inn í calendarið
    const trips = await fetchTrips();
    var calendar = new FullCalendar.Calendar(calendarEl, {
      initialView: 'dayGridMonth',
      validRange: {
        start: '2025-06-01',
        end: '2025-10-01',
      }, height:'auto',
      events: trips,
      eventDidMount: function(info) {
        // Ensure the event's element is clickable (set pointer cursor)
        info.el.style.cursor = 'pointer';

        // Attach the click functionality
        info.el.addEventListener('click', function() {
            console.log(info.event.href)
          if (info.event.extendedProps.href) {
            window.open(info.event.extendedProps.href, "_blank");
            
          }
        });
      }
    });
  
    calendar.render();
  });