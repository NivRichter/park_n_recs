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


async function getAllCampsitesAvailability() {
  const campsites = [8, 10, 11, 12, 13, 21, 9, 15, 24, 23, 26, 27, 17, 22];
  let data = {
      lastUpdate: Date.now(),
      days: {}
  };

  for (let campsiteID of campsites) {
    console.log('fetching availability for campsiteID ' + campsiteID);
    
    try {
      const response = await getSingleCampsiteAvailability(campsiteID);
      const gatheredResponse = await gatherResponse(response);
      const parsedResponse = JSON.parse(gatheredResponse);
      let availability = parsedResponse.d.Availibility;
      if(availability.length > 30) availability.length = 30;
      
      for(let day of availability) {
        if (day && day.DayDate) {
          const { DayDate, IsAvail, CloseToArrival, CloseToDeparture, MinDays, SumRoomsForSale, RoomsInHotel } = day;
          const DayDateNum = parseInt(DayDate.substr(6));
          const DayDateYYYYMMDD = (new Date(DayDateNum)).toISOString().split('T')[0];
          const dayDateKey = 'date-' + DayDateYYYYMMDD;
          if(!data.days[dayDateKey]) data.days[dayDateKey] = {};
          data.days[dayDateKey]['camp-'+campsiteID] = { IsAvail, CloseToArrival, CloseToDeparture, MinDays, SumRoomsForSale, RoomsInHotel };
        }
      }
    } catch(error) {
      return error;
    }
  }

  await KV_CAMPSITES.put('latest', JSON.stringify(data));
}


addEventListener('scheduled', event => {
  event.waitUntil(
    handleSchedule(event.scheduledTime)
  )
})


async function handleSchedule(scheduledDate) {
  console.log('scheduledDate: ' + scheduledDate);
  const response = await getAllCampsitesAvailability();
  console.log('getAllCampsitesAvailability finished!');
}





addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

/**
 * Respond to the request
 * @param {Request} request
 */
async function handleRequest(request) {
  const value = await KV_CAMPSITES.get("latest");
  if (!value) {
    return new Response("data not found", {status: 404});
  }
  return new Response(value, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=900"
    }
  });
}