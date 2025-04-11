const axios=require('axios');
const REZDY_API=process.env.REZDY_API_KEY;


async function fetchProductFromRezdy(code){
    //þarf þetta örgl ekkert hér
    const products= await axios.get(`https://api.rezdy.com/v1/products/${code}(`, {
        params: { apiKey: REZDY_API }
      });
    
      return products;

}

async function fetchAvailFromRezdy(code){
const availability=await axios.get('https://api.rezdy.com/v1/availability', {
    params: { apiKey:REZDY_API, productCode:code, startTime:'2025-05-01', endTime:'2025-09-30'}
});

const trips=availability.data.session; //setja "eða tómt fylki" fyrir villumeðh
//const sessionIsFull = sessions.some(session => session.seatsAvailable <= 0);

//const isFull = sessionIsFull ? 0 : 1;

//const title=products.name;
//const seatsAvailable=availability.seatsAvailable;
//const startDate=availability.startTimeLocal.split(" ")[0];
// const endDate=availability.endTimeLocal.split(" ")[0];
return {trips}
}

module.exports = fetchAvailFromRezdy, fetchProductFromRezdy;