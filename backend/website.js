const axios=require('axios');

//id á flokknum "Riding Excursions" á ishestar.is, allt annað telst riding journey
const EXCURSION_CATEGORY_ID=155;

//sækir slug á öllum ferðum í excursion flokknum, t.d. "spirit-of-hekla"
async function fetchExcursionSlugs(){
const res=await axios.get('https://www.ishestar.is/wp-json/wp/v2/portfolio', {
    params: { portfolio_category:EXCURSION_CATEGORY_ID, per_page:100, _fields:'slug' },
    //síðan svarar 403 ef þetta vantar þegar beðið er frá servernum
    headers: { 'User-Agent':'Mozilla/5.0 (compatible; IshestarCalendarSync/1.0; +https://www.ishestar.is)', 'Accept':'application/json' }
});
return (res.data || []).map(item=>item.slug);
}

module.exports = {
    fetchExcursionSlugs
  };
