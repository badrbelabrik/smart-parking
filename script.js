function getVehicules(){
    return JSON.parse(localStorage.getItem("vehicules")) || []
}
function setVehicules(vehicules){
    localStorage.setItem("vehicules",JSON.stringify(vehicules))
}
function getSpots(){
    return JSON.parse(localStorage.getItem("spots")) || []
}
function setSpots(spots){
    localStorage.setItem("spots",JSON.stringify(spots))
}

function createSpots(){
  const spots = getSpots() || []
  const spotsRow = document.getElementById("spotsRow")
  spotsRow.innerHTML = ""
  for (let i=0; i<spots.length; i++){
            const spotDiv = document.createElement("div")
            spotDiv.id = `${spots[i].number}`
            spotDiv.className=("flex-none w-[calc(20%-12px)] h-20 bg-gray-400 border rounded-3xl flex items-center justify-center cursor-pointer")
            spotDiv.onclick = () => {
              releaseSpot(i); 
            };
            spotDiv.innerHTML = `
            <span class="text-white text-xs font-bold">${spots[i].number}</span>
            `
            if(spots[i].occupied == true){
              spotDiv.style.backgroundColor = "green"
            }
            spotsRow.appendChild(spotDiv)
  }
}

function showInfo(index){
  const spots = getSpots()
  console.log(spots[index].number)
}


// document.getElementById("btn-submit").addEventListener("click", (e) => {

//   e.preventDefault();
//    bookSpot()

// } );

function bookSpot(){
  const spots = getSpots()
  const vehicules = getVehicules()
  const availableSpot = spots.find(item => item.occupied == false)
  if (availableSpot){
    const date = new Date()
    const creationDate = `${date.getDate()}-${date.getMonth()+1}-${date.getFullYear()}-${date.getHours()}:${date.getMinutes().toString().padStart(2, "0")}`
    const platenumber = document.getElementById("plateNumber")
    const vehiculetype = document.getElementById("vehiculeType")
    const newVehicule = {plateNumber:platenumber.value,type:vehiculetype.value,slotNumber:availableSpot.number,entryTime:creationDate}
    const spot = document.getElementById(availableSpot.number)
    availableSpot.occupied = true
    vehicules.push(newVehicule)
    setVehicules(vehicules)
    setSpots(spots)
  } else {
    console.log("there is no available spot")
  }
}


function releaseSpot(index){
  const spots = getSpots()
  spots[index].occupied = false
  setSpots(spots)
}
// const spots = getSpots()
// const findspot = spots.find(item=>item.number == "A02")
// findspot.occupied = false
// setSpots(spots)
createSpots()


