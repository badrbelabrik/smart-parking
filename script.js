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
function getTickets(){
    return JSON.parse(localStorage.getItem("tickets")) || []
}
function setTickets(tickets){
    localStorage.setItem("tickets",JSON.stringify(tickets))
}
// const spots = [{
// number: "A01",
// occupied: false
// },
// {
// number: "A02",
// occupied: false
// },
// {
// number: "A03",
// occupied: false
// },
// {
// number: "A04",
// occupied: false
// },
// {
// number: "A05",
// occupied: false
// },
// {
// number: "B01",
// occupied: false
// },
// {
// number: "B02",
// occupied: false
// },
// {
// number: "B03",
// occupied: false
// },
// {
// number: "B04",
// occupied: false
// },
// {
// number: "B05",
// occupied: false
// },
// {
// number: "C01",
// occupied: false
// },
// {
// number: "C02",
// occupied: false
// },
// {
// number: "C03",
// occupied: false
// },
// {
// number: "C04",
// occupied: false
// },
// {
// number: "C05",
// occupied: false
// },
// ]


function createSpots(){
  const spots = getSpots() || []
  const vehicules = getVehicules()
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
            spotDiv.className=("flex-none w-[calc(20%-12px)] h-20 bg-[#3468B5] border rounded-3xl flex flex-col items-center justify-center cursor-pointer")
            
            spotDiv.onclick = () => {
              showModal(spots[i]); 
            };
            spotDiv.innerHTML = `
            <span class="text-white text-xs font-bold">${spots[i].number}</span>
            `
            if(spots[i].occupied == true){
              const vehiculeFound = vehicules.find(item => item.slotNumber == spots[i].number)
              spotDiv.style.backgroundColor = "green"
                          spotDiv.innerHTML = `
            <span class="text-white text-xs font-bold">${spots[i].number}</span>
            <span class="text-white text-xs font-bold">${vehiculeFound.plateNumber}</span>
            `
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
    const creationDate = `${date.getDate()}-${date.getMonth()+1}-${date.getFullYear()}`
    const entryHour = `${date.getHours()}:${date.getMinutes().toString().padStart(2, "0")}`
    const platenumber = document.getElementById("plateNumber")
    const vehiculetype = document.getElementById("vehiculeType")
    const newVehicule = {plateNumber:platenumber.value,type:vehiculetype.value,slotNumber:availableSpot.number,creationDate:creationDate,entryTime:entryHour,exitTime: null}
    const spot = document.getElementById(availableSpot.number)
    availableSpot.occupied = true
    vehicules.push(newVehicule)
    setVehicules(vehicules)
    setSpots(spots)

    createSpots();

  } else {
    console.log("there is no available spot")
  }
}


function getTicket(spot,vehicule){
    const vehicules = getVehicules()
    const spots = getSpots()
    const tickets = getTickets()
    const date = new Date()
    const exitHour = `${date.getHours()}:${date.getMinutes().toString().padStart(2, "0")}`
    const ticketDate = `${date.getDate()}-${date.getMonth()+1}-${date.getFullYear()}`

    const vehiculeFound = vehicules.find(item => item.plateNumber == vehicule.plateNumber)
    const spotFound = spots.find(item => item.number == spot.number)
    vehiculeFound.exitTime = exitHour
  
    spotFound.occupied = false
    setSpots(spots)
    let newid = tickets.length + 1 
    const price = priceCalculation(vehicule.entryTime,exitHour)
    const ticket = {ticketId:newid,Date:ticketDate,slot:spot.number,plateNumber:vehiculeFound.plateNumber,type:vehicule.type,entryTime:vehicule.entryTime,exitTime:vehiculeFound.exitTime,price:price}
    tickets.push(ticket)
    setTickets(tickets)
    closeModal()
    createSpots()
    const index = vehicules.indexOf(vehiculeFound)
    if (index !== -1) {
    vehicules.splice(index, 1);
        }
    setVehicules(vehicules)
    ticketsList()
  }

function priceCalculation(entry,exit){
    const entryParts = entry.split(":")
    const exitParts = exit.split(":")
    const entryHour = parseInt(entryParts[0], 10)
    const entryMin  = parseInt(entryParts[1], 10)
    const exitHour = parseInt(exitParts[0],10)
    const exitMin = parseInt(exitParts[1],10)

    const entryDuration = (entryHour*60)+entryMin
    const exitDuration = (exitHour*60)+exitMin
    const totalDuration = (Math.floor((exitDuration-entryDuration)/60))
    let price = 0;
    if(totalDuration<=1){
      price = 5;
    } else {
      price = 5+((totalDuration-1)*3)
    }
    return price
}

function ticketsList(){
  const tickets = getTickets()
  const ticketsTable = document.querySelector("#ticketsTable tbody")
  ticketsTable.innerHTML = ""
  for(ticket of tickets){
    const tr = document.createElement("tr")
    tr.innerHTML = `<td class="px-6 py-4 font-medium text-gray-900">${ticket.ticketId}</td>
                    <td class="px-6 py-4 font-medium text-gray-900">${ticket.Date}</td>
                    <td class="px-6 py-4">
                    <span class="rounded-md bg-blue-50 px-2 py-1 font-mono text-blue-700 border border-blue-100">
                      ${ticket.plateNumber}
                    </span>
                    </td>
                    <td class="px-6 py-4 font-medium text-gray-900">${ticket.slot}</td>
                    <td class="px-6 py-4">${ticket.type}</td>
                    <td class="px-6 py-4">${ticket.entryTime}</td>
                    <td class="px-6 py-4 text-gray-400">${ticket.exitTime}</td>
                    <td class="px-6 py-4 font-bold text-green-600">${ticket.price} MAD</td>`
    ticketsTable.appendChild(tr)                
  }
}

function showModal(currentSpot) {
    const modal = document.getElementById("infoModal");
    const spots = getSpots()
    const vehicules = getVehicules()
    // const currentSpot = spots[index]
    const currentVehicule = vehicules.find(item=>item.slotNumber == currentSpot.number)
    if(currentSpot.occupied){
    const date = new Date()
    const exitHour = `${date.getHours()}:${date.getMinutes().toString().padStart(2, "0")}`
    document.getElementById("modalSpotId").innerText = currentSpot.number;
    document.getElementById("modalDate").innerText = currentVehicule.creationDate || "Empty";      
    document.getElementById("modalPlate").innerText = currentVehicule.plateNumber || "Empty";
    document.getElementById("modalType").innerText = currentVehicule.type || "N/A";
    document.getElementById("modalEntryTime").innerText = currentVehicule.entryTime || "Not checked-in";
    document.getElementById("modalExitTime").innerText = exitHour || "Not checked-in"; 
    document.getElementById("modalPrice").textContent = `${priceCalculation(currentVehicule.entryTime,exitHour)} MAD` || "Not checked-in"; 
    }else{
    document.getElementById("modalSpotId").innerText = currentSpot.number;
    document.getElementById("modalDate").innerText = "Empty";
    document.getElementById("modalPlate").innerText = "Empty";
    document.getElementById("modalType").innerText = "N/A";
    document.getElementById("modalEntryTime").innerText = "Not checked-in";
    document.getElementById("modalExitTime").innerText = "Not checked-in";
    document.getElementById("modalPrice").innerText = "Not checked-in";
    }
    // 2. Fill the text fields with the data from the 'spots' array


    // 3. Show/Hide the Release button based on status
    const releaseBtn = document.getElementById("getTicket");
    releaseBtn.onclick = () => {
      getTicket(currentSpot,currentVehicule)
    }
    releaseBtn.style.display = currentSpot.occupied ? "block" : "none";

    // 4. Open the native dialog
    modal.showModal();
}

function closeModal() {
    document.getElementById("modalSpotId").innerText = "";
    document.getElementById("modalPlate").innerText = "";
    document.getElementById("modalType").innerText = "";
    document.getElementById("modalEntryTime").innerText = "";
    document.getElementById("modalExitTime").innerText = "";
    document.getElementById("modalPrice").innerText = "";
    document.getElementById("infoModal").close();
}


document.addEventListener("DOMContentLoaded", () => {
    createSpots()
    ticketsList()
})


