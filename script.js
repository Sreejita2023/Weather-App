// accessing all the important tags in html
const userTab=document.querySelector("[userTab]")
const searchTab=document.querySelector("[searchTab]")

const userContainer=document.querySelector('.weather_container')

const grantContainer=document.querySelector(".grant_location")
const loading=document.querySelector(".loadingScreen")
const infoContainer=document.querySelector(".container")
const searchForm=document.querySelector("[dataSearchForm]")
const errorPage=document.querySelector(".error")

// initial variables are declared ??
let currentTab=userTab
const API_KEY = "d1845658f92b31c64bd94f06f7188c9c";
currentTab.classList.add("current-tab")
getfromSessionStorage()


function switchTab(clickedTab){
	// switching between the userTab and searchTab.If the clicked tab and current tab are different 
	// change it
	if(clickedTab!=currentTab){
		console.log(clickedTab)
		currentTab.classList.remove("current-tab")
		currentTab=clickedTab
		console.log(currentTab)
		currentTab.classList.add("current-tab")
		errorPage.classList.remove("active")
		  // check searchForm is invisible or not
	      if(!searchForm.classList.contains("active")){
         		// if the searchTab is not visible then make your weather visible
         	 grantContainer.classList.remove("active")
         	 infoContainer.classList.remove("active")
         	 searchForm.classList.add("active")
			

          }
          else{
         	 // if searchTab is visible then make it invisible 
         	 // make your weather visible
         	 searchForm.classList.remove("active")
         	 infoContainer.classList.remove("active")
         	 //ab main your weather tab me aagya hu, toh weather bhi display karna poadega, so let's check local storage first
         	  //for coordinates, if we haved saved them there.
         	  getfromSessionStorage()
          }
	}

	

}




// check all the coordinates are present in session storage or not
function getfromSessionStorage(){
	const localCoordinates=sessionStorage.getItem("user_coordinates")
	if(!localCoordinates){
        grantContainer.classList.add("active")
	}
	else{
		const coordinates=JSON.parse(localCoordinates)
		fetchUserWeatherInfo(coordinates);
	}
}

//get all the necessary weather details from api using user location 
async function fetchUserWeatherInfo(coordinates){
    const {lat,lon}=coordinates
	// make grantcontainer invisible
    grantContainer.classList.remove("active");
    //make loader visible
    loading.classList.add("active");

	// API Call
	try{
		const response=await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
		const data=await response.json()
		loading.classList.remove("active")
	    infoContainer.classList.add("active")
		renderWeatherInfo(data)
	}
	catch(err){
		loading.classList.remove("active")
		// need to add
	}
}   


// add the user data in user container weather interface
function renderWeatherInfo(data){
    //  first fetch the elements
	const city_name=document.querySelector("[data_city]")
	const countryIcon=document.querySelector("[data_country_icon]")
	const desc=document.querySelector("[data_weather_desc]")
	const weatherIcon=document.querySelector("[data_weather_icon]")
	const temp=document.querySelector("[data_temp]")
	const speed=document.querySelector("[data_wind]")
	const humidity=document.querySelector("[data_humidity]")
	const cloud=document.querySelector("[data_cloud]")
       
	console.log(data)
    console.log("it's working")

	//fetch values from weatherINfo object and put it UI element
    city_name.innerText=data?.name
	countryIcon.src = `https://flagcdn.com/144x108/${data?.sys?.country.toLowerCase()}.png`;
	desc.innerText=data?.weather?.[0]?.description
	weatherIcon.src = `https://openweathermap.org/img/w/${data?.weather?.[0]?.icon}.png`;
	console.log(weatherIcon)
	temp.innerText=`${data?.main?.temp}°C`
	speed.innerText=`${data?.wind?.speed}m/s`
	humidity.innerText=`${data?.main?.humidity}%`
	cloud.innerText=`${data?.clouds?.all}%`

}  

// find the location of the current place to get user weather
function getLocation() {
	if (navigator.geolocation) {
	  navigator.geolocation.getCurrentPosition(showPosition);
	} else {
	  alert( "Geolocation is not supported by this browser.")
	}
  }
  
  function showPosition(position) {
	const user_coordinates={
		lat:position.coords.latitude,
		lon:position.coords.longitude,
	}
	sessionStorage.setItem("user_coordinates",JSON.stringify(user_coordinates))
	fetchUserWeatherInfo(user_coordinates)
  }

// make the rgrant acess button accessable
const grantAcessBtn=document.querySelector("[grantaccess]")
grantAcessBtn.addEventListener("click",getLocation)

// make search tab accessable
const searchInput=document.querySelector("[dataSearchInput]")
searchForm.addEventListener('submit',(e)=>{
   e.preventDefault()
   let cityName=searchInput.value
   if(cityName===""){
	window.alert("Enter the name of city\neg-Delhi")
	return
   }
   else{
	fetchSearchWeatherInfo(cityName);
   }
})

// how to find the weather of a place wit the city name\
async function fetchSearchWeatherInfo(cityName){
	grantContainer.classList.remove("active")
	infoContainer.classList.remove("active")
	errorPage.classList.remove("active")
	loading.classList.add("remove")
	try{
	  const response=await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric`)
	  const data=await response.json()
	  console.log(data?.cod)
	  if(data?.cod==='404'){
		console.log("city not present")
		window.alert( "This geolocation doesn't exists.")
		errorPage.classList.add("active")
	}
	  else{
		loading.classList.remove("active")
		infoContainer.classList.add("active")
		renderWeatherInfo(data)
	  }
	}
    catch(err){
		window.alert( "Geolocation is not supported by this browser.")
	}
}


// add clickable mouse events to the user and search tab
userTab.addEventListener("click",()=>{
	console.log("its user tab")
	switchTab(userTab)
})
searchTab.addEventListener("click",()=>{
	console.log("its search tab")
	switchTab(searchTab)
})
