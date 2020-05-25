document.addEventListener('DOMContentLoaded', ()=> {
    elBtn = document.getElementById('weatherBtn');
    elInput = document.getElementById('weatherInput');

    const key = '26e332d34fb63993da7fd6e6cedd790f';
    const url = 'https://api.openweathermap.org/data/2.5/forecast?q=';


    elBtn.addEventListener('click', ()=> {
        if(elInput.value){
            let cityName = elInput.value;
            let urlPath = `${url}${cityName}&appid=${key}`;
            
            fetch(urlPath)
                .then(response => response.json())
        
                .then(data=> {  
                    const {city, list} = data;
                    const arrDays = checkDays(list);
                    addToDivs(city, arrDays);
                })
                .catch((error) => {
                    console.log('error:', error);
                }); 
        }
    })

    const forecastDivs = Array.from(document.querySelectorAll('.weatherDay'));
    elNoteTxt = document.getElementById('BGtext');

    function addToDivs(city, arrDays){
        let noteTxt = `Weather Info for ${city.name}`;
        for (let i = 0; i < arrDays.length; i++){
            let addedText = `\n${arrDays[i][0].dt_txt.slice(5,10)}\n\n`;
            let mainTxt = `\n${arrDays[i][0].weather[0].description}`;
            arrDays[i].forEach(log=> {
                let t = log.dt_txt.slice(11, 16);
                let f = KtoF(log.main.temp);
                addedText += `${t}\t${f}°F\n`;
            });
            addedText += mainTxt;
            try{
                forecastDivs[i].innerText = addedText;
                elNoteTxt.innerText = noteTxt;
            }
            catch(e){console.log(";_;", e);}
        }
    }
    
    function KtoF(K){
        return Math.round(((K - 273.15) * 9/5 + 32));
    }

    function checkDays(list){
        const dayList = [];
        let startDay = new Date().getDate().toString();
        let hourList = [];
        list.forEach(log => {
            let logDay = log.dt_txt.slice(8,10);
            
            if(startDay==logDay){
                hourList.push(log);
            } else {
                if (hourList.length){
                    dayList.push(hourList);
                }
                hourList = [];
                startDay = logDay;
            }
        })
        return dayList;
    }
    


});