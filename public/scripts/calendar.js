document.addEventListener('DOMContentLoaded', async function () {
    var calendarEl = document.getElementById('calendar');
  

    /**
     * lesa í databaseinu
     * @returns 
     */
    async function fetchTrips() {
      try {
        const response = await fetch("/trips");
        const trips = await response.json();
        console.log(trips);
        return trips.map(trip => ({
          id:trip.id,
          title: trip.title,
          start: trip.start_date,
          end: addOneDay(trip.end_date),
          difficulty: trip.difficulty,
          color:getColor(trips, trip.difficulty),
          href: trip.link,
          riding_days: trip.riding_days,
          groupId: trip.title,
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
    function getColor(trips, level){
            const colors = ['#8A9A5B', '#2C5F2D', '#6B3F1F'];//'#8A9A5B', '#B24C27', '#A08C64'
           // const tripss=trips.map(trip=>({title:trip.title}))
            //const index=tripss.findIndex(trip=>trip.title==titl);
            const difficultyy=['beginner', 'intermediate', 'advanced'];
            for (i of difficultyy){
              if(level===i){
                return colors[difficultyy.findIndex(el=> el===i)];}
            }
            
            //const tripss=trips.map(trip=>({difficulty:trip.difficulty}))
            return;
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
      slotEventOverlap: false,
      fixedWeekCount:false,
      validRange: {
        start: '2025-06-01',
        end: '2025-10-01',
      }, height:'auto',
      events: trips,
      eventContent: function(info) {
        if(!info.isStart){
          let eventDiv = document.createElement('div');
        eventDiv.className = 'jaa';

        eventDiv.innerHTML =  `${info.event.title}`;
    
        return { domNodes: [eventDiv] };}
         else{
        let eventDiv = document.createElement('div');
        eventDiv.className = 'jaa';

        eventDiv.innerHTML = `
          ${info.event.title} - 
          <span>${info.event.extendedProps.riding_days || 'N/A'} riding days, ${info.event.extendedProps.difficulty}</span>
        `;
    
        return { domNodes: [eventDiv] };}
      },
      eventDidMount: function(info) {
        tippy(info.el, {
          content: `
              <strong>${info.event.title}</strong><br>
              Riding Days: ${info.event.extendedProps.riding_days || 'N/A'}<br>
              Difficulty: ${info.event.extendedProps.difficulty || 'Unknown'}<br>
              Description: ${info.event.extendedProps.description}`, //setja inn description á allar ferðir
          allowHTML: true,
          placement: 'top',
          theme: 'custom',
          animation: 'shift-away', //líka hægt að fadea hérna ef við viljum
          duration: [200, 10],
      });
        //hægt að ýta
        info.el.style.cursor = 'pointer';
        info.el.addEventListener('click', function() {
            console.log(info.event.href)
          if (info.event.extendedProps.href) {
            window.open(info.event.extendedProps.href, "_blank");
            
          }
          
        })
        
      
        info.el.setAttribute('data-event-id', info.event.id);
        info.el.addEventListener('mouseenter', function() {
            let relatedEvents = document.querySelectorAll(`[data-event-id="${info.event.id}"]`);
            relatedEvents.forEach(el => el.style.opacity = "0.4");

        });

        info.el.addEventListener('mouseleave', function() {
            let relatedEvents = document.querySelectorAll(`[data-event-id="${info.event.id}"]`);
            relatedEvents.forEach(el => el.style.opacity = "1");
      
        });
      }
    
    });
  
    calendar.render();
  });