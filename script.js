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
const spots = [{
number: "A01",
occupied: false
},
{
number: "A02",
occupied: false
},
{
number: "A03",
occupied: false
},
{
number: "A04",
occupied: false
},
{
number: "A05",
occupied: false
},
{
number: "B01",
occupied: false
},
{
number: "B02",
occupied: false
},
{
number: "B03",
occupied: false
},
{
number: "B04",
occupied: false
},
{
number: "B05",
occupied: false
},
{
number: "C01",
occupied: false
},
{
number: "C02",
occupied: false
},
{
number: "C03",
occupied: false
},
{
number: "C04",
occupied: false
},
{
number: "C05",
occupied: false
},
]

function createSpots(){
  const spots = getSpots() || []
  let spotsCount = 0;
  for(spot of spots){
      if(!spot.occupied){
        spotsCount++
      }
  }
  document.getElementById("availablespots").textContent = `Available spots: ${spotsCount}`
  const spotsRow = document.getElementById("spotsRow")
  spotsRow.innerHTML = ""
  for (let i=0; i<spots.length; i++){
            const spotDiv = document.createElement("div")
            spotDiv.id = `${spots[i].number}`
            spotDiv.className=("flex-none w-[calc(20%-12px)] h-20 bg-[#3468B5] border rounded-3xl flex items-center justify-center cursor-pointer")
            spotDiv.onclick = () => {
              showModal(i); 
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

let currentSelectedSpot = null; // To keep track of which spot is open

function showModal(index) {
    const modal = document.getElementById("infoModal");
    const spots = getSpots()
    const vehicules = getVehicules()
    const currentSpot = spots[index]
    const currentVehicule = vehicules.find(item=>item.slotNumber == currentSpot.number)
    if(currentSpot.occupied){
          document.getElementById("modalSpotId").innerText = currentSpot.number;
    document.getElementById("modalPlate").innerText = currentVehicule.plateNumber || "Empty";
    document.getElementById("modalType").innerText = currentVehicule.type || "N/A";
    document.getElementById("modalTime").innerText = currentVehicule.entryTime || "Not checked-in";
    }else{
                document.getElementById("modalSpotId").innerText = currentSpot.number;
    document.getElementById("modalPlate").innerText = "Empty";
    document.getElementById("modalType").innerText = "N/A";
    document.getElementById("modalTime").innerText = "Not checked-in";
    }
    // 2. Fill the text fields with the data from the 'spots' array


    // 3. Show/Hide the Release button based on status
    const releaseBtn = modal.querySelector('button[onclick="releaseSpot()"]');
    releaseBtn.style.display = currentSpot.occupied ? "block" : "none";

    // 4. Open the native dialog
    modal.showModal();
}

function closeModal() {
    document.getElementById("modalSpotId").innerText = "";
    document.getElementById("modalPlate").innerText = "";
    document.getElementById("modalType").innerText = "";
    document.getElementById("modalTime").innerText = "";
    document.getElementById("infoModal").close();
}

document.addEventListener("DOMContentLoaded", () => {
    createSpots()
})


