import React from 'react';
import Center from 'components/Center';
import Button from 'components/Button';
import './style.css';

const DrawerSettings = (props = {}) => {
  return (
    <Center>
      <div className="DrawerSettings">
        <div className="Directional">
          <div className="Row">
            <div className="Cell">
            </div>
            <div className="Cell">
              <Button className="Button">
                Top
              </Button>
            </div>
            <div className="Cell">
            </div>
          </div>

          <div className="Row">
            <div className="Cell">
              <Button className="Button">
                Left
              </Button>
            </div>
            <div className="Cell">
            </div>
            <div className="Cell">
              <Button className="Button">
                Right
              </Button>
            </div>
          </div>

          <div className="Row">
            <div className="Cell">
            </div>
            <div className="Cell">
              <Button className="Button">
                Bottom
              </Button>
            </div>
            <div className="Cell">
            </div>
          </div>
        </div>
      </div>
    </Center>
  );
};

export default DrawerSettings;