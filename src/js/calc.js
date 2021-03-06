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

AirportInput('input-origin', airportOptions)
AirportInput('input-destination', airportOptions)

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

const calc = new Vue({
  el: 'main',
  data: {
    carbon: null,
    showResults: false
  },
  methods: {
    selectAll: (e) => e.target.setSelectionRange(0, e.target.value.length),
    closePopovers: () => {
      const popovers = document.body.querySelectorAll('.autocomplete-results')
      for (let i = 0; i < popovers.length; i++) {
        popovers[i].innerHTML = ''
      }
    }
  }
})

const targetNode = document.querySelectorAll('.js-input')
const config = { attributes: true }
let origin = null
let destination = null

// Callback function to execute when mutations are observed
const callback = (mutationsList, observer) => {
  for(let mutation of mutationsList) {
    if (mutation.attributeName === 'data-lon' && mutation.target.id === 'input-origin') origin = mutation.target
    if (mutation.attributeName === 'data-lon' && mutation.target.id === 'input-destination') destination = mutation.target
    if (origin && destination) {
      const distance = calcDistance(origin.getAttribute('data-lat'), origin.getAttribute('data-lon'), destination.getAttribute('data-lat'), destination.getAttribute('data-lon'))
      calc.carbon = `${calcCarbon(distance)} METRIC TONS`
      calc.showResults = true
    }
  }
}

// Create an observer instance linked to the callback function
const observer = new MutationObserver(callback)

// Start observing the target node for configured mutations
for (let i = 0; i < targetNode.length; i++) {
  observer.observe(targetNode[i], config)
}
