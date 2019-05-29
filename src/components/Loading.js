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
            <div className='sweet-loading'>
              <ClipLoader
                sizeUnit={"px"}
                size={50}
                color={'#123abc'}
                loading={this.state.loading}
              />
            </div> 
          )
        }
      }


export default Loading;