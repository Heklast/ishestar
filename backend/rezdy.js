const axios=require('axios');
const REZDY_API=process.env.REZDY_API_KEY;


async function fetchProductFromRezdy(code){
    const products= await axios.get(`https://api.rezdy.com/v1/products/${code}`, {
        params: { apiKey: REZDY_API }
      });
    
      return products.data.product;

}

async function fetchAvailFromRezdy(code){
const availability=await axios.get('https://api.rezdy.com/v1/availability', {
    params: { apiKey:REZDY_API, productCode:code, startTime:'2025-05-01', endTime:'2026-09-30'}
});

const trips=availability.data.sessions; //setja "eða tómt fylki" fyrir villumeðh
return trips || [];
}

module.exports = {
    fetchAvailFromRezdy,
    fetchProductFromRezdy
  };