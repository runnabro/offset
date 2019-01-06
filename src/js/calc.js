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

AirportInput('autocomplete-airport-1', airportOptions)
AirportInput('autocomplete-airport-2', airportOptions)

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
  return distance
}

const calcCarbon = (distance) => {
  distance = distance * 2 // assume round-trip
  distance = distance * .621371 // convert to miles

  // source: http://lipasto.vtt.fi/yksikkopaastot/henkiloliikennee/ilmaliikennee/ilmae.htm
  // if short-haul, 14.7 ounces/miles = .000416738 metric tonnes/mile
  // if long-haul, 10.1 ounces/miles = .0002863302 metric tonnes/mile
  if (distance < 288) carbon = distance * .000416738
  else carbon = distance * .0002863302

  // source: https://www.coolearth.org/cool-earth-carbon/ https://carbonfund.org/individuals/
  // Carbon Fund estimates they offset 1 metric tonne per $10 USD
  // Cool Earth estimates they mitigate 1 metric tonne per 25 pence (.32 USD in Dec 2018)
  // carbon impact by metric tonnes, offset cost, mitigation cost
  carbon = carbon.toFixed(1)
  return carbon
}

const checkInputData = (id) => {
  const realId = 'autocomplete-airport-' + id
  const realIdEl = document.getElementById(realId)
  return ([
    realIdEl.getAttribute('data-lat'),
    realIdEl.getAttribute('data-lon')
  ])
}

const calc = new Vue({
  el: 'main',
  data: {
    showResults: false,
    carbon: null
  },
  methods: {
    airportChanged: checkDistance = () => {
      const distance = calcDistance(...checkInputData(1), ...checkInputData(2))
      calc.carbon = `${calcCarbon(distance)} METRIC TONS`
      if (distance !== 0) calc.showResults = true
    }
  }
})
