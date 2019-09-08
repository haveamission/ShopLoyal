import React from "react";
import { ClipLoader } from 'react-spinners';

class Loading extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true
    }
  }
  render() {
    return (
      <div className='loading-modal'>
        <ClipLoader
          sizeUnit={"em"}
          size={2.5}
          color={'#123abc'}
          loading={this.state.loading}
        />
      </div>
    )
  }
}


export default Loading;