const axios=require('axios');
const REZDY_API=process.env.REZDY_API_KEY;


async function fetchProductFromRezdy(code){
    const products= await axios.get(`https://api.rezdy.com/v1/products/${code}`, {
        params: { apiKey: REZDY_API }
      });

      return products.data.product;
}

//rezdy skilar stundum 500/504, reynum aftur nokkrum sinnum áður en við gefumst upp
async function getWithRetry(url, config, tries=4){
for (let attempt=1; ; attempt++){
  try {
    return await axios.get(url, config);
  } catch (err){
    const status=err.response?.status;
    const retryable=!status || status>=500 || status===429;
    if (!retryable || attempt>=tries) throw err;
    await new Promise(resolve=>setTimeout(resolve, 2000*attempt));
  }
}
}

//dagsetning á forminu YYYY-MM-DD, daysAhead dögum frá deginum í dag
function dateFromToday(daysAhead){
const d=new Date();
d.setDate(d.getDate()+daysAhead);
return d.toISOString().split('T')[0];
}

//sækir sessions á bilinu startTime-endTime, sjálfgefið frá deginum í dag og eitt ár fram í tímann
async function fetchAvailFromRezdy(code, startTime=dateFromToday(0), endTime=dateFromToday(365)){
const availability=await getWithRetry('https://api.rezdy.com/v1/availability', {
    params: { apiKey:REZDY_API, productCode:code, startTime, endTime}
});

const trips=availability.data.sessions; //setja "eða tómt fylki" fyrir villumeðh
return trips || [];
}

//sækir öll products, rezdy skilar max 100 í einu svo við flettum í gegn
async function fetchAllProductsFromRezdy(){
const all=[];
const limit=100;
for (let offset=0; ; offset+=limit){
  const res=await getWithRetry('https://api.rezdy.com/v1/products', {
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
