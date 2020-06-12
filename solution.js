let axios= require('axios');
let cheerio = require('cheerio');
let fs = require('fs');

const main = async ()=>{
    const result = {};
    const baseurl= 'https://www.bankmega.com/promolainnya.php/';
    const file = 'solution.json';

    const data = await axios ({
        method: 'GET',
        baseURL: baseurl,
        url : '/promolainnya.php'
    });

    const $= cheerio.load(data.data);
    const category = $('#subcatpromo div');
    const count = category.length;

    let i;
    for (i=1; i <= count; i++){
        const req = await axios({
            method: 'GET',
            baseURL: baseurl,
            url: '/promolainnya.php',
            params: {
                subcat: i
            }
         });
         
        const page = cheerio.load(req.data)
        const categorylist = page('div#subcatselected img')[0].attribs['title'];
        const promo = page('#imgClass');
        const promos = [];
        promo.each((i,el)=>{
            promos.push({
                title :`${el.attribs['title']}`,
                imageURL : `${baseurl}/${el.attribs['src']}`,
                url : `${baseurl}/${el.parentNode.attribs['href']}`
        });
        });
        result[categorylist]= promos;
    }
        // const final = result.filter(n => n/ !=undefined);
        fs.writeFile(file, JSON.stringify(result,null,2), (err) => {
            if (err) {
                console.log('GAGAL');
            }else{
                console.log('BERHASIL');
            }
        });
};

main();