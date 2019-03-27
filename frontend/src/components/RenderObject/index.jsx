import React, {Component} from 'react';
import { ListGroup, ListGroupItem } from 'reactstrap';

export default class RenderObject extends Component {
  render () {
    let {data, ...propsRest} = this.props;
    data = data || {};

    switch (typeof data) {
      case 'string':
      case 'number':
        data = {data}
      break;

      case 'function':
        data = data.toString();
      break;
    }

    return (
      <ListGroup
        {...propsRest}
        style={{width: '100%'}}>
        {
          Object.keys(data).map((objectKey, idx) => {
            let value = data[objectKey];
            const valueType = typeof value;

            console.debug('value type', valueType, value);
            
            switch (valueType) {
              case 'string':
              case 'number':
                // Pass value through
              break;
            
              case 'object':
                value = <RenderObject
                  key={idx}
                  data={data[objectKey]}
                />
              break;

              default:
                console.warn(`Unhandled value type: ${valueType}`);
                value = value.toString();
            }

            return (
              <ListGroupItem
                key={idx}
                active
                onClick={ (evt) => console.debug(evt) }
                style={{width: '100%', textAlign: 'left'}}
                tag="div"
              >
                key: {objectKey}
                &nbsp;|
                value: {value}
              </ListGroupItem>
            )
          })
        }
      </ListGroup>
    );
  }
}