const express = require("express");
const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended:false}));

const axios = require("axios");
const path = require('path');

app.set('view engine', 'ejs');

app.use(express.static(path.resolve("./public")));


let countryCode = "AF";

app.get('/', (req, res) => {

    const options = {
        method: 'GET',
        url: 'https://country-facts.p.rapidapi.com/all',
        headers: {
            'X-RapidAPI-Key': '9fae4153bemsh6d37cccd33f31b3p1d580fjsn6ff190afef3a',
            'X-RapidAPI-Host': 'country-facts.p.rapidapi.com'
        }
    };

    axios.request(options).then(function (response) {
     

        for (let i = 0; i < (response.data).length; i++) {
            if ((response.data[i].cca2) == countryCode) {
                console.log(i);
                console.log(response.data[i]);

                let latitude = response.data[i].latlng[0];
                let longitude = response.data[i].latlng[1];

                let capitalCity = response.data[i].capital[0];


                const options2 = {
                    method: 'GET',
                    url: 'https://cost-of-living-and-prices.p.rapidapi.com/prices',
                    params: {city_name: response.data[i].capital[0], country_name: response.data[i].name.common},
                    headers: {
                      'X-RapidAPI-Key': '9fae4153bemsh6d37cccd33f31b3p1d580fjsn6ff190afef3a',
                      'X-RapidAPI-Host': 'cost-of-living-and-prices.p.rapidapi.com'
                    }
                  };
                  
                  axios.request(options2).then(function (response2) {
                      console.log((response2.data).prices);

                      res.render("index",{name:response.data[i].name.common, population:response.data[i].population,capitalCity: capitalCity, flag:response.data[i].flag, priceDetails: (response2.data).prices , longitude: longitude, latitude: latitude});
                  }).catch(function (error) {
                      console.error(error);
                  });

            }
         
        }


    }).catch(function (error) {
        console.error(error);
    });

})


app.post("/",(req,res)=>{
    console.log(req.body);
    if(req.body.country == null){

    }else{countryCode = req.body.country;}

    res.redirect("/");
    
})


app.listen(8000, () => {
    console.log("server listening at port 8000");
})