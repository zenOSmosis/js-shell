import React, {Component} from 'react';
import { ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import socket from './../../utils/socket.io';

// import AMDLogo from '../../icons/brands/AMD-logo.svg';
// import IntelLogo from '../../icons/brands/Intel-logo.svg';
// import NvidiaLogo from '../../icons/brands/Nvidia-logo.svg';

export default class GPUSelector extends Component {
  state = {
    gpus: [],
    selectedGPU: null,
    dropdownOpen: false
  };

  componentDidMount() {
    this.fetchGPUs();
  }

  toggle = () => {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    });
  }

  /**
   * Fetches GPUs and updates the state.
   */
  fetchGPUs = () => {
    socket.emit('fetch-sys-info', {
      mode: 'GRAPHICS'
    }, (data) => {

      let {err, controllers: gpus} = data;
      
      if (err) {
        throw new Error(gpus.err);
      }

      gpus = gpus.map((gpu) => {
        return this.getGPUMetadata(gpu);
      });

      this.setState({
        gpus
      });

    });
  }

  getGPUMetadata = (gpu) => {
    const rawVendor = gpu.vendor.toUpperCase();
    const {bus, model, vendor, vram, vramDynamic} = gpu;
    let vendorName = '';
    let vendorLogo = null;

    if (rawVendor.includes('INTEL')) {
      vendorName = 'Intel';
      vendorLogo = null; // IntelLogo;
    } else if (rawVendor.includes('AMD')) {
      vendorName = 'AMD';
      vendorLogo = null; // AMDLogo;
    } else if (rawVendor.includes('NVIDIA')) {
      vendorName = 'Nvidia';
      vendorLogo = null; // NvidiaLogo;
    } else {
      vendorName = 'Unknown';
      vendorLogo = null;
    }

    const vendorModelName = `${vendorName} ${model}`;

    return {
      bus,
      model,
      vendor,
      vendorName,
      vendorModelName,
      vendorLogo,
      vram,
      vramDynamic
    }
  }

  selectGPU = (gpu) => {
    this.setState({
      selectedGPU: gpu,
    }, () => {
      console.debug('Selected GPU:', gpu);
    });
  }

  render () {
    return (
      <ButtonDropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
        <DropdownToggle caret>
          { (this.state.selectedGPU && this.state.selectedGPU.vendorModelName) || 'Select GPU' }
        </DropdownToggle>
        <DropdownMenu>
        {
          this.state.gpus.map((gpu, idx) => {
            return (
              <div key={idx}>
                <DropdownItem header>bus: {gpu.bus}</DropdownItem>
                <DropdownItem onClick={ (evt) => this.selectGPU(gpu) }>
                  <img
                    alt=""
                    style={{float: 'left'}}
                    width={80}
                    src={gpu.vendorLogo}
                  />
                  <table>
                    <tbody>
                      <tr>
                        <td>
                          <span className="label">Vendor</span>
                        </td>
                        <td>
                          {gpu.vendor}
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <span className="label">Model</span>
                        </td>
                        <td>
                          {gpu.model}
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <span className="label">VRAM</span>
                        </td>
                        <td>
                          {gpu.vram}MB ({gpu.vramDynamic ? '' : 'non-'}dynamic)
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </DropdownItem>
              </div>
            )
          })
        }
        </DropdownMenu>
      </ButtonDropdown>
    );
  }
}