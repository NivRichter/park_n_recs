const hotelIds = [8, 10, 11, 12, 13, 21, 9, 15, 24, 23, 26, 27, 17, 22];

async function saveLogMessage(message) {
  const url = 'https://us-central1-parks-n-rec-4b77b.cloudfunctions.net/saveLogMessage?message=';
  return fetch(url + message);
}

async function saveToFirebase(data) {
  const url = 'https://us-central1-parks-n-rec-4b77b.cloudfunctions.net/saveAvailability';
  const options = {
    method: 'POST',
    body: JSON.stringify({ data: data }),
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json'
    }
  }
  return fetch(url, options);
}

async function gatherResponse(response) {  
  const { headers } = response;
  const contentType = headers.get("content-type") || "";
  if (contentType.includes("application/json")) {    
    return JSON.stringify(await response.json());
  } else if (contentType.includes("application/text")) {    
    return await response.text();
  } else if (contentType.includes("text/html")) {
    return await response.text();
  } else {    
    return await response.text();
  }
}

async function getSingleCampsiteAvailability(hotelID) {
  const url = 'https://secure-hotels.net/INPA/BE_Engine.aspx/getAvalibility';
  const options = {
      method: 'POST',
      body: JSON.stringify({
          "hotelID": hotelID,
          "dsn": "",
          "lang": "heb",
          "days": 30,
          "fromdate": null,
          "enddate": null
      }),
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      }
  }
  return fetch(url, options);
}

function formatResponse(parsedResponse) {
  let availability = parsedResponse.d.Availibility;
  availability.length = 14;
  let campsiteData = {}
  for(let day of availability) {
    if (day && day.DayDate) {
      const { DayDate, IsAvail, CloseToArrival, CloseToDeparture, MinDays, SumRoomsForSale, RoomsInHotel } = day;
      const DayDateNum = parseInt(DayDate.substr(6));
      const DayDateYYYYMMDD = (new Date(DayDateNum)).toISOString().split('T')[0];
      campsiteData[DayDateYYYYMMDD] = { IsAvail, CloseToArrival, CloseToDeparture, MinDays, SumRoomsForSale, RoomsInHotel };
    }
  }
  return campsiteData
}

async function getAllCampsitesAvailability() {
  const campsites = [8, 10, 11, 12, 13, 21, 9, 15, 24, 23, 26, 27, 17, 22];
  let data = {
      lastUpdate: Date.now(),
      lastUpdateFormatted: (new Date()).toISOString(),
      sites: {},
      days: {},
  };

  for (let campsiteID of campsites) {
    console.log('fetching availability for campsiteID ' + campsiteID);
    if (!data.sites[campsiteID]) data.sites[campsiteID] = {};
    
    try {
      const response = await getSingleCampsiteAvailability(campsiteID);
      const gatheredResponse = await gatherResponse(response);
      const parsedResponse = JSON.parse(gatheredResponse);
      let availability = parsedResponse.d.Availibility;
      console.log('availability.length: ' + availability.length);
      if(availability.length > 30) availability.length = 30;
      
      for(let day of availability) {
        if (day && day.DayDate) {
          const { DayDate, IsAvail, CloseToArrival, CloseToDeparture, MinDays, SumRoomsForSale, RoomsInHotel } = day;
          const DayDateNum = parseInt(DayDate.substr(6));
          const DayDateYYYYMMDD = (new Date(DayDateNum)).toISOString().split('T')[0];
          const dayDateKey = 'date-' + DayDateYYYYMMDD;
          data.sites[campsiteID][DayDateYYYYMMDD] = { IsAvail, CloseToArrival, CloseToDeparture, MinDays, SumRoomsForSale, RoomsInHotel };
          
          if(!data.days[dayDateKey]) data.days[dayDateKey] = {};
          data.days[dayDateKey]['camp-'+campsiteID] = { IsAvail, CloseToArrival, CloseToDeparture, MinDays, SumRoomsForSale, RoomsInHotel };
        }
      }
    } catch(error) {
      await saveLogMessage('Cloudflare getcampsites-serial Worker getAllCampsitesAvailability error!');
      await saveLogMessage(error);
      return error;
    }
  }


  // save to firebase rtdb
  console.log('saving to firebase rtdb');
  console.log(data);
  const saveResponse = await saveToFirebase(data);
  const saveGatheredResponse = await gatherResponse(saveResponse);
  console.log('saveToFirebase finished!');
  await saveLogMessage('Cloudflare getcampsites-serial Worker getAllCampsitesAvailability finished successfully!');

  return true;
}




addEventListener('scheduled', event => {
  event.waitUntil(
    handleSchedule(event.scheduledTime)
  )
})



async function handleSchedule(scheduledDate) {
  // console.log(scheduledDate)
  // await saveLogMessage('Cloudflare getcampsites-serial Worker scheduled job triggered ' + scheduledDate);
  console.log('scheduledDate: ' + scheduledDate);
  const response = await getAllCampsitesAvailability();
  console.log('getAllCampsitesAvailability finished!');
  // await saveLogMessage('Cloudflare mute-leaf-d6c4 Worker handleSchedule finished');
}

