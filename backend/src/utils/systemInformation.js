const si = require('systeminformation');

const SYSINFO_MODE_SYSTEM = module.exports.SYSINFO_MODE_SYSTEM = 'SYSTEM';
const SYSINFO_MODE_BIOS = module.exports.SYSINFO_MODE_BIOS = 'BIOS';
const SYSINFO_MODE_BASEBOARD = module.exports.SYSINFO_MODE_BASEBOARD = 'BASEBOARD';
const SYSINFO_MODE_CHASSIS = module.exports.SYSINFO_MODE_CHASSIS = 'CHASSIS';
const SYSINFO_MODE_CPU = module.exports.SYSINFO_MODE_CPU = 'CPU';
const SYSINFO_MODE_CPUFLAGS = module.exports.SYSINFO_MODE_CPUFLAGS = 'CPUFLAGS';
const SYSINFO_MODE_CPUCACHE = module.exports.SYSINFO_MODE_CPUCACHE = 'CPUCACHE';
const SYSINFO_MODE_CPUCURRENTSPEED = module.exports.SYSINFO_MODE_CPUCURRENTSPEED = 'CPUCURRENTSPEED';
const SYSINFO_MODE_CPUTEMPERATURE = module.exports.SYSINFO_MODE_CPUTEMPERATURE = 'CPUTEMPERATURE';
const SYSINFO_MODE_MEM = module.exports.SYSINFO_MODE_MEM = 'MEM';
const SYSINFO_MODE_MEMLAYOUT = module.exports.SYSINFO_MODE_MEMLAYOUT = 'MEMLAYOUT';
const SYSINFO_MODE_BATTERY = module.exports.SYSINFO_MODE_BATTERY = 'BATTERY';
const SYSINFO_MODE_GRAPHICS = module.exports.SYSINFO_MODE_GRAPHICS = 'GRAPHICS';
const SYSINFO_MODE_OSINFO = module.exports.SYSINFO_MODE_OSINFO = 'OSINFO';
const SYSINFO_MODE_UUID = module.exports.SYSINFO_MODE_UUID = 'UUID';
const SYSINFO_MODE_VERSIONS = module.exports.SYSINFO_MODE_VERSIONS = 'VERSIONS';
const SYSINFO_MODE_SHELL = module.exports.SYSINFO_MODE_SHELL = 'SHELL';
const SYSINFO_MODE_USERS = module.exports.SYSINFO_MODE_USERS = 'USERS';
const SYSINFO_MODE_CURRENTLOAD = module.exports.SYSINFO_MODE_CURRENTLOAD = 'CURRENTLOAD';
const SYSINFO_MODE_FULLLOAD = module.exports.SYSINFO_MODE_FULLLOAD = 'FULLLOAD';
const SYSINFO_MODE_PROCESSES = module.exports.SYSINFO_MODE_PROCESSES = 'PROCESSES';
// const SYSINFO_MODE_PROCESSLOAD = module.exports.SYSINFO_MODE_PROCESSLOAD = 'PROCESSLOAD';
const SYSINFO_MODE_SERVICES = module.exports.SYSINFO_MODE_SERVICES = 'SERVICES';
const SYSINFO_MODE_DISKLAYOUT = module.exports.SYSINFO_MODE_DISKLAYOUT = 'DISKLAYOUT';
const SYSINFO_MODE_BLOCKDEVICES = module.exports.SYSINFO_MODE_BLOCKDEVICES = 'BLOCKDEVICES';
const SYSINFO_MODE_DISKSIO = module.exports.SYSINFO_MODE_DISKSIO = 'DISKSIO';
const SYSINFO_MODE_FSSIZE = module.exports.SYSINFO_MODE_FSSIZE = 'FSSIZE';
const SYSINFO_MODE_FSSTATS = module.exports.SYSINFO_MODE_FSSTATS = 'FSSTATS';
const SYSINFO_MODE_NETWORKINTERFACES = module.exports.SYSINFO_MODE_NETWORKINTERFACES = 'NETWORKINTERFACES';
const SYSINFO_MODE_NETWORKINTERFACEDEFAULT = module.exports.SYSINFO_MODE_NETWORKINTERFACEDEFAULT = 'NETWORKINTERFACEDEFAULT';
// const SYSINFO_MODE_NETWORKSTATS = module.exports.SYSINFO_MODE_NETWORKSTATS = 'NETWORKSTATS';
const SYSINFO_MODE_NETWORKCONNECTIONS = module.exports.SYSINFO_MODE_NETWORKCONNECTIONS = 'NETWORKCONNECTIONS';
// const SYSINFO_MODE_INETCHECKSITE = module.exports.SYSINFO_MODE_INETCHECKSITE = 'INETCHECKSITE';
// const SYSINFO_MODE_INETLATENCY = module.exports.SYSINFO_MODE_INETLATENCY = 'INETLATENCY';
// const SYSINFO_MODE_DOCKERCONTAINERS = module.exports.SYSINFO_MODE_DOCKERCONTAINERS = 'DOCKERCONTAINERS';
// const SYSINFO_MODE_DOCKERCONTAINERSTATS = module.exports.SYSINFO_MODE_DOCKERCONTAINERSTATS = 'DOCKERCONTAINERSTATS';
// const SYSINFO_MODE_DOCKERCONTAINERPROCESSES = module.exports.SYSINFO_MODE_DOCKERCONTAINERPROCESSES = 'DOCKERCONTAINERPROCESSES';

module.exports.SYSINFO_MODES = [
  SYSINFO_MODE_SYSTEM,
  SYSINFO_MODE_BIOS,
  SYSINFO_MODE_BASEBOARD,
  SYSINFO_MODE_CHASSIS,
  SYSINFO_MODE_CPU,
  SYSINFO_MODE_CPUFLAGS,
  SYSINFO_MODE_CPUCACHE,
  SYSINFO_MODE_CPUCURRENTSPEED,
  SYSINFO_MODE_CPUTEMPERATURE,
  SYSINFO_MODE_MEM,
  SYSINFO_MODE_MEMLAYOUT,
  SYSINFO_MODE_BATTERY,
  SYSINFO_MODE_GRAPHICS,
  SYSINFO_MODE_OSINFO,
  SYSINFO_MODE_UUID,
  SYSINFO_MODE_VERSIONS,
  SYSINFO_MODE_SHELL,
  SYSINFO_MODE_USERS,
  SYSINFO_MODE_CURRENTLOAD,
  SYSINFO_MODE_FULLLOAD,
  SYSINFO_MODE_PROCESSES,
  // SYSINFO_MODE_PROCESSLOAD,
  SYSINFO_MODE_SERVICES,
  SYSINFO_MODE_DISKLAYOUT,
  SYSINFO_MODE_BLOCKDEVICES,
  SYSINFO_MODE_DISKSIO,
  SYSINFO_MODE_FSSIZE,
  SYSINFO_MODE_FSSTATS,
  SYSINFO_MODE_NETWORKINTERFACES,
  SYSINFO_MODE_NETWORKINTERFACEDEFAULT,
  // SYSINFO_MODE_NETWORKSTATS,
  SYSINFO_MODE_NETWORKCONNECTIONS,
  // SYSINFO_MODE_INETCHECKSITE,
  // SYSINFO_MODE_INETLATENCY,
  // SYSINFO_MODE_DOCKERCONTAINERS,
  // SYSINFO_MODE_DOCKERCONTAINERSTATS,
  // SYSINFO_MODE_DOCKERCONTAINERPROCESSES
];

// @see https://www.npmjs.com/package/systeminformation
module.exports.fetchSystemInformation = async (mode) => {
  try {
    mode = (typeof mode === 'string' ? mode.toUpperCase() : undefined);

    switch (mode) {
      case SYSINFO_MODE_SYSTEM:
        return await si.system();

      case SYSINFO_MODE_BIOS:
        return await si.bios();

      case SYSINFO_MODE_BASEBOARD:
        return await si.baseboard();

      case SYSINFO_MODE_CHASSIS:
        return await si.chassis();

      case SYSINFO_MODE_CPU:
        return await si.cpu();

      case SYSINFO_MODE_CPUFLAGS:
        let cpuFlags = await si.cpuFlags();
        cpuFlags = cpuFlags.split(' ');
        return cpuFlags;

      case SYSINFO_MODE_CPUCACHE:
        return await si.cpuCache();

      case SYSINFO_MODE_CPUCURRENTSPEED:
        return await si.cpuCurrentspeed();

      case SYSINFO_MODE_CPUTEMPERATURE:
        return await si.cpuTemperature();

      case SYSINFO_MODE_MEM:
        return await si.mem();

      case SYSINFO_MODE_MEMLAYOUT:
        return await si.memLayout();

      case SYSINFO_MODE_BATTERY:
        return await si.battery();

      case SYSINFO_MODE_GRAPHICS:
        return await si.graphics();
      
      case SYSINFO_MODE_OSINFO:
        return await si.osInfo();
      
      case SYSINFO_MODE_UUID:
        return await si.uuid();

      case SYSINFO_MODE_VERSIONS:
        return await si.versions();

      case SYSINFO_MODE_SHELL:
        return await si.shell();

      case SYSINFO_MODE_USERS:
        return await si.users();

      case SYSINFO_MODE_CURRENTLOAD:
        return await si.currentLoad();

      case SYSINFO_MODE_FULLLOAD:
        return await si.fullLoad();

      case SYSINFO_MODE_PROCESSES:
        return await si.processes();

      /*
      case SYSINFO_MODE_PROCESSLOAD:
        return await si.processLoad();
      */

      case SYSINFO_MODE_SERVICES:
        return await si.services();

      case SYSINFO_MODE_DISKLAYOUT:
        return await si.diskLayout();

      case SYSINFO_MODE_BLOCKDEVICES:
        return await si.blockDevices();

      case SYSINFO_MODE_DISKSIO:
        return await si.disksIO();

      case SYSINFO_MODE_FSSIZE:
        return await si.fsSize();

      case SYSINFO_MODE_FSSTATS:
        return await si.fsStats();

      case SYSINFO_MODE_NETWORKINTERFACES:
        return await si.networkInterfaces();

      case SYSINFO_MODE_NETWORKINTERFACEDEFAULT:
        return await si.networkInterfaceDefault();

      /*
      case SYSINFO_MODE_NETWORKSTATS:
        return await si.networkStats();
      */

      case SYSINFO_MODE_NETWORKCONNECTIONS:
        return await si.networkConnections();

      /*
      case SYSINFO_MODES['INETCHECKSITE']:
      break;
      */

      /*
      case SYSINFO_MODES['INETLATENCY']:
      break;
      */

      /*
      case SYSINFO_MODES['DOCKERCONTAINERS']:
      break;
      */

      /*
      case SYSINFO_MODES['DOCKERCONTAINERSTATS']:
      break;
      */

      /*
      case SYSINFO_MODES['DOCKERCONTAINERPROCESSES']:
      break;
      */

      /*
      case SYSINFO_MODES['DOCKERALL']:
      break;
      */

      default:
        throw new Error(`Invalid mode: ${mode}`);
    }
  } catch (exc) {
    throw exc;
  }
};