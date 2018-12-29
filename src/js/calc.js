const airportOptions = {
  shouldSort: true,
  threshold: .4,
  maxPatternLength: 32,
  keys: [
    {
      name: 'IATA',
      weight: .6
    }, {
      name: 'name',
      weight: .2
    }, {
      name: 'city',
      weight: .4
    }
  ]
}

let distance = null;

AirportInput('autocomplete-airport-1', airportOptions);
AirportInput('autocomplete-airport-2', airportOptions);

// great circle using haversine formula
const convertDegreesToRadians = (degrees) => degrees * Math.PI / 180
const calcDistance = (lat1, lon1, lat2, lon2) => {
  const earthRadiusKm = 6371
  let dLat = convertDegreesToRadians(lat2 - lat1)
  let dLon = convertDegreesToRadians(lon2 - lon1)
  lat1 = convertDegreesToRadians(lat1)
  lat2 = convertDegreesToRadians(lat2)
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  distance = earthRadiusKm * c
  calcCarbon(distance)
}

const calcCarbon = (distance) => {
  let carbon = null;
  distance = distance * 2 // assume round-trip
  distance = distance * .621371 // convert to miles
  console.log(`miles flown (rt): ${distance}`)

  // source: http://lipasto.vtt.fi/yksikkopaastot/henkiloliikennee/ilmaliikennee/ilmae.htm
  // if short-haul, 14.7 ounces/miles = .000416738 metric tonnes/mile
  // if long-haul, 10.1 ounces/miles = .0002863302 metric tonnes/mile
  if (distance < 288) carbon = distance * .000416738
  else carbon = distance * .0002863302

  // source: https://www.coolearth.org/cool-earth-carbon/ https://carbonfund.org/individuals/
  // Carbon Fund estimates they offset 1 metric tonne per $10 USD
  // Cool Earth estimates they mitigate 1 metric tonne per 25 pence (.32 USD in Dec 2018)
  // carbon impact by metric tonnes, offset cost, mitigation cost
  showResults(carbon, carbon * 10, carbon * .32)
}

const checkInputData = (id) => {
  const realId = 'autocomplete-airport-' + id
  const realIdEl = document.getElementById(realId)
  return ([
    realIdEl.getAttribute('data-lat'),
    realIdEl.getAttribute('data-lon')
  ])
}

const checkDistance = (self) => {
  setTimeout(() => {
    const idChanged = self['id'].slice(-1)
    if (checkInputData(1)[0] && checkInputData(2)[0]) calcDistance(...checkInputData(1), ...checkInputData(2))
  }, 200)
}

const showResults = (carbon, offset, mitigation) => {
  document.getElementById('impact').innerHTML = `${carbon.toFixed(1)} METRIC TONS`
  document.getElementById('offset').innerHTML = `$${offset.toFixed(2)} IN OFFSETS OR…`
  document.getElementById('mitigation').innerHTML = `$${mitigation.toFixed(2)} IN MITIGATION`
  document.querySelector('.results').classList.add('show')
}