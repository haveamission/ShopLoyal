const Actions = {
    GET_LOCATION: 'GET_LOCATION'
  };

export default () => {
  const geolocation = navigator.geolocation;
  
  const coordinates = new Promise((resolve, reject) => {
    if (!geolocation) {
      reject(new Error('Not Supported'));
    }
    
    geolocation.getCurrentPosition((position) => {
      resolve(position);
    }, () => {
      reject (new Error('Permission denied'));
    });
  });
  
  return {
    type: Actions.GET_LOCATION,
    payload: coordinates
  }
};