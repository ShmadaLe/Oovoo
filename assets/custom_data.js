// This file's intended use is to store hard-coded data used for testing

const passenger_data = [
  {
    name: "Passenger1",
    imageURL: "https://images-platform.99static.com//tPzkeQWbvRTHuqIbjKJ3YkgJ7CI=/0x0:1000x1000/fit-in/500x500/projects-files/97/9789/978952/773d9e25-0fa4-467d-96d7-d95943cab1f8.jpeg" 
  },
  {
    name: "Passenger2",
    imageURL: "https://images-platform.99static.com//tPzkeQWbvRTHuqIbjKJ3YkgJ7CI=/0x0:1000x1000/fit-in/500x500/projects-files/97/9789/978952/773d9e25-0fa4-467d-96d7-d95943cab1f8.jpeg" 
  },
  {
    name: "Passenger3",
    imageURL: "https://images-platform.99static.com//tPzkeQWbvRTHuqIbjKJ3YkgJ7CI=/0x0:1000x1000/fit-in/500x500/projects-files/97/9789/978952/773d9e25-0fa4-467d-96d7-d95943cab1f8.jpeg" 
  },
]

const vehicles_data = [
  {
    user: "Jeff",
    vehicle_model: "Red Honda CR-V",
    pickupLocation: "EVGR Loop",
    capacity: 5,
    departure: "3:00PM",
    passengers: passenger_data,
  },
  {
    user: "Anton",
    vehicle_model: "Purple Lexus IS500",
    pickupLocation: "Wilbur Lot",
    capacity: 4,
    departure: "4:00PM",
    passengers: passenger_data,
  },
]

const trips_data = [
  {
    id: "1",
    imageURL: 'https://images-platform.99static.com//tPzkeQWbvRTHuqIbjKJ3YkgJ7CI=/0x0:1000x1000/fit-in/500x500/projects-files/97/9789/978952/773d9e25-0fa4-467d-96d7-d95943cab1f8.jpeg',
    tripOrganizer: "Ski Team",
    tripSource: "Stanford",
    tripDestination: "Lake Tahoe",
    tripDate: new Date("2024-01-04"),
    // assuming we're going to scrape all outbound car for the earliest and latest departure times. alternatively, we can also
    // pass the prop as an array of car departure times and take the min/max
    earliestDeparture: new Date(2024, 0, 4, 15, 10),
    latestDeparture: new Date(2024, 0, 4, 16, 30)
  },
  {
    id: "2",
    imageURL: 'https://img.freepik.com/premium-vector/rock-climbing-logo_617585-1697.jpg',
    tripOrganizer: "Climbing Team",
    tripSource: "AEORC",
    tripDestination: "Nola",
    tripDate: new Date("2024-01-07"),
    earliestDeparture: new Date(2024, 0, 4, 12, 35),
    latestDeparture: new Date(2024, 0, 4, 17, 15)
  },
  {
    id: "3",
    imageURL: 'https://cdn.britannica.com/08/190808-050-CB26C47B/The-Powerpuff-Girls-Bubbles-Blossom-Buttercup.jpg',
    tripOrganizer: "Gals",
    tripSource: "Target",
    tripDestination: "Stanford",
    tripDate: new Date("2024-02-04"),
    earliestDeparture: new Date(2024, 0, 4, 13, 25),
    latestDeparture: new Date(2024, 0, 4, 14, 45)
  },
  {
    id: "4",
    imageURL: 'https://www.nicepng.com/png/detail/5-55961_dance-png-transparent-dance-logos-graphic-design-png.png',
    tripOrganizer: "Dance",
    tripSource: "Mount Shasta",
    tripDestination: "Yosemite National Park",
    tripDate: new Date("2024-04-03"),
    earliestDeparture: new Date(2024, 0, 4, 6, 15),
    latestDeparture: new Date(2024, 0, 4, 6, 20)
  },
]

let communities_data = [
  {
    id: '1',
    name: 'Ski Team',
    handle: '@ski-team',
    passcode: 1234,
    imageURL: 'https://images-platform.99static.com//tPzkeQWbvRTHuqIbjKJ3YkgJ7CI=/0x0:1000x1000/fit-in/500x500/projects-files/97/9789/978952/773d9e25-0fa4-467d-96d7-d95943cab1f8.jpeg',
    numMembers: 256
  }, 
  {
    id: '2',
    name: 'Climbing Team',
    handle: '@climbing-team',
    passcode: 1234,
    imageURL: 'https://img.freepik.com/premium-vector/rock-climbing-logo_617585-1697.jpg',
    numMembers: 124
  }, 
  {
    id: '3',
    name: 'Gals',
    handle: '@gals',
    passcode: 1234,
    imageURL: 'https://cdn.britannica.com/08/190808-050-CB26C47B/The-Powerpuff-Girls-Bubbles-Blossom-Buttercup.jpg',
    numMembers: 5
  }, 
  {
    id: '4',
    name: 'Family',
    handle: '@fambam',
    passcode: 1234,
    imageURL: 'https://img.freepik.com/free-vector/live-laugh-love-lettering-with-flowers_52683-29339.jpg',
    numMembers: 6
  }, 
  {
    id: '5',
    name: 'Dance',
    handle: '@dance-team',
    passcode: 1234,
    imageURL: 'https://www.nicepng.com/png/detail/5-55961_dance-png-transparent-dance-logos-graphic-design-png.png',
    numMembers: 26
  }, 
  {
    id: '6',
    name: 'Senior Class',
    handle: '@class-of-2024',
    passcode: 1234,
    imageURL: 'https://i.pinimg.com/736x/7a/74/6d/7a746d6f76bfdefb1cf046ef22377a3a.jpg',
    numMembers: 1342
  }, 
  {
    id: '7',
    name: 'Chinese Club',
    handle: '@chinese-club',
    passcode: 1234,
    imageURL: 'https://thumbs.dreamstime.com/b/golden-dragon-chinese-new-year-circle-frame-antique-ornament-monochrome-icon-vector-flat-illustration-asian-traditional-dinosaur-259888149.jpg',
    numMembers: 214
  }
]

export {vehicles_data, passenger_data, trips_data, communities_data}