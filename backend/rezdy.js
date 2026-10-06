const axios=require('axios');
const REZDY_API=process.env.REZDY_API_KEY;


async function fetchProductFromRezdy(code){
    const products= await axios.get(`https://api.rezdy.com/v1/products/${code}`, {
        params: { apiKey: REZDY_API }
      });

      return products.data.product;
}

//dagsetning á forminu YYYY-MM-DD, daysAhead dögum frá deginum í dag
function dateFromToday(daysAhead){
const d=new Date();
d.setDate(d.getDate()+daysAhead);
return d.toISOString().split('T')[0];
}

//sækir sessions frá deginum í dag og eitt ár fram í tímann
async function fetchAvailFromRezdy(code){
const availability=await axios.get('https://api.rezdy.com/v1/availability', {
    params: { apiKey:REZDY_API, productCode:code, startTime:dateFromToday(0), endTime:dateFromToday(365)}
});

const trips=availability.data.sessions; //setja "eða tómt fylki" fyrir villumeðh
return trips || [];
}

//sækir öll products, rezdy skilar max 100 í einu svo við flettum í gegn
async function fetchAllProductsFromRezdy(){
const all=[];
const limit=100;
for (let offset=0; ; offset+=limit){
  const res=await axios.get('https://api.rezdy.com/v1/products', {
    params: { apiKey:REZDY_API, limit, offset }
  });
  const products=res.data.products || [];
  all.push(...products);
  if (products.length<limit) break;
}
return all;
}

module.exports = {
    fetchAvailFromRezdy,
    fetchProductFromRezdy,
    fetchAllProductsFromRezdy
  };
