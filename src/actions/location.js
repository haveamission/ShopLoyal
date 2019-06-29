const Actions = {
    GET_LOCATION: 'GET_LOCATION'
  };

export default () => {
  const geolocation = navigator.geolocation;
  
  var coordinates = new Promise((resolve, reject) => {
    if (!geolocation) {
      reject(new Error('Not Supported'));
    }
    
    geolocation.getCurrentPosition((position) => {
      resolve(position);
    }, () => {
      reject (new Error('Permission denied'));
    });
  });

  if(Object.entries(coordinates).length === 0) {
    // TODO: Place in constants, and/or think/discuss a better way to discuss error condition in the case of no geolocation
coordinates = {
  coords: {
    latitude: 42.5467,
    longitude: -83.2113
  }
  }
}
  
  return {
    type: Actions.GET_LOCATION,
    payload: coordinates
  }
};