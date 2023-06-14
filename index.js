const userTab=document.querySelector("[data-userWeather]")
const searchTab=document.querySelector("[data-searchWeather]")
const userContainer=document.querySelector(".weather-container")

const grantAccessContainer=document.querySelector(".grant-location-container")
const searchForm=document.querySelector("[data-searchForm]")
const loadingScreen=document.querySelector(".loading-container")
const useInfoContainer=document.querySelector(".user-info-container")


const API_KEY="d1845658f92b31c64bd94f06f7188c9c";
  
let OldTab=userTab;
OldTab.classList.add("current-tab");

function switchTab(NewTab){

    //yachi functionality ahe ki ya toh searchform visible krne aur invisible krne
if(NewTab != OldTab){
    OldTab.classList.remove("current-tab");
    OldTab = NewTab;
    OldTab.classList.add("current-tab")

//searchform ko visible krva liya
    if(!searchForm.classList.contains("active")){
        useInfoContainer.classList.remove("active")
        grantAccessContainer.classList.remove("active")
        //isko eventlistener  kiya
        searchForm.classList.add("active")

    }
    else{
        searchForm.classList.remove("active")
        useInfoContainer.classList.remove("active")
        //ab main your whether tab me aa gya hu toh weather bhi display krna padega so lets check local storage first
        //for corrdinates if we haved saved them there
         getfromSessionStorage()
    }
}
}


userTab.addEventListener("click",()=>{

    //passed newtab as a parameter
switchTab(userTab)
})

searchTab.addEventListener("click",()=>{
    switchTab(searchTab)
})

//check if coordinates are alreasy present in session storage
function getfromSessionStorage(){
const localcoordinates=sessionStorage.getItem("user-coordinates")

if(!localcoordinates){
    //agar local cordinates nhi mila toh
    grantAccessContainer.classList.add("active")

}
else{
    const coordinates=JSON.parse(localcoordinates)

    fetcUserhWeatherInfo(coordinates)
}
}
  

async function fetcUserhWeatherInfo(coordinates){
const {lat,lon}=coordinates;
//make grantContainer invisible

grantAccessContainer.classList.remove("active")

//make loader visble

loadingScreen.classList.add("active")


try{

    const response=await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`)
    const data= await response.json()

    //loader ko hata

    loadingScreen.classList.remove("active")
       useInfoContainer.classList.add("active")

    renderweatherInfo(data)   ;

}catch(err){

}
}

function renderweatherInfo(weatherInfo){
     //firstly we have fetch the elemenet

     const cityName=document.querySelector("[data-cityName]")
     const countryIcon=document.querySelector("[data-countryIcon]")
     const desc=document.querySelector("[data-weatherDesc]")
     const weatherIcon=document.querySelector("[data-weatherIcon]")
     const temp=document.querySelector("[data-temp]")
     const speed=document.querySelector("[data-windspeed]")
     const humidity=document.querySelector('[data-humidity]')
     const cloudiness=document.querySelector('[data-cloudiness]')


     cityName.innerText=weatherInfo?.name;
     countryIcon.src=`https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
     desc.innerText=weatherInfo?.weather?.[0]?.description;
      weatherIcon.src=`http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`
      temp.innerText=`${weatherInfo?.main?.temp} °C`;
      speed.innerText=`${weatherInfo?.wind?.speed} m/s`;
      humidity.innerText=`${weatherInfo?.main?.humidity} %`;
      cloudiness.innerText=`${weatherInfo?.clouds?.all} %`;
        

}

function getLocation(){
    if(navigator.geolocation){
navigator.geolocation.getCurrentPosition(showPosition)
    }
    else{
        alert("No Geolocation Support Available")
    }
}

function showPosition(position){
      const userCoordinates={
        lat: position.coords.latitude,
        lon:position.coords.longitude

      }
 sessionStorage.setItem("user-coordinates",JSON.stringify(userCoordinates))
fetcUserhWeatherInfo(userCoordinates);
}

const grantAccessButton=document.querySelector("[data-grantAccess]")

grantAccessButton.addEventListener("click",getLocation);

const searchInput=document.querySelector("[data-searchFormInput]")
searchForm.addEventListener("submit",(e)=>{
    e.preventDefault();

    let cityName=searchInput.value;

    if(cityName==""){
return;
    }else{
        fetchSearchInfo(cityName);
    }
    searchInput.value=""
})

async function fetchSearchInfo(city){
    loadingScreen.classList.add("active");
    useInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");


    try{
   const response=await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`)
   const data= await response.json()

   loadingScreen.classList.remove("active");
   useInfoContainer.classList.add("active")
   renderweatherInfo(data)
    }catch(err){

    }
}



