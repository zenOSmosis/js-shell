const {ls, chdir} = require('../utils/fileSystem');

(async () => {
  const paths = await ls('/home/jeremy');
  console.log(paths);

  // const dir = await(chdir('/home/jeremy'));
  // console.log(dir);
})();