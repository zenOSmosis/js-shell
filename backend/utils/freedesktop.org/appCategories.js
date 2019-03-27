// @see https://standards.freedesktop.org/menu-spec/latest/apa.html
// TODO: Include icon pointers here
const categories = [
  {
    name: 'AudioVideo',
    niceName: 'Audio / Video',
    description: 'Application for presenting, creating, or processing multimedia (audio/video).',
    iconPath: 'television/television.svg',
    notes: null
  },
  {
    name: 'Audio',
    niceName: null,
    description: 'An audio application.',
    iconPath: 'audio/audio.svg',
    notes: 'Desktop entry must include AudioVideo as well.'
  },
  {
    name: 'Video',
    niceName: null,
    description: 'A video application.',
    iconPath: 'video/video.svg',
    notes: 'Desktop entry must include AudioVideo as well.'
  },
  {
    name: 'Development',
    niceName: null,
    description: 'An application for development.',
    iconPath: 'development/development.svg',
    notes: null
  },
  {
    name: 'Education',
    niceName: null,
    description: 'Educational software.',
    iconPath: 'education/education.svg',
    notes: null
  },
  {
    name: 'Game',
    niceName: null,
    description: 'A game.',
    iconPath: 'game/game.svg',
    notes: null
  },
  {
    name: 'Graphics',
    niceName: null,
    description: 'Application for viewing, creating, or processing graphics.',
    iconPath: 'graphics/graphics.svg',
    notes: null
  },
  {
    name: 'Network',
    niceName: null,
    description: 'Network application such as a web browser.',
    iconPath: 'network/network.svg',
    notes: null
  },
  {
    name: 'Office',
    niceName: null,
    description: 'An office type application.',
    iconPath: 'office/office.svg',
    notes: null
  },
  {
    name: 'Science',
    niceName: null,
    description: 'Scientific software.',
    iconPath: 'science/science.svg',
    notes: null
  },
  {
    name: 'Settings',
    niceName: null,
    description: 'Settings applications.',
    iconPath: 'settings/settings.svg',
    notes: 'Entries may appear in a separate menu or as part of a "Control Center."'
  },
  {
    name: 'System',
    niceName: null,
    description: 'System application, "System Tools" such as say a log viewer or network monitor.',
    iconPath: 'computer/computer.svg',
    notes: null
  },
  {
    name: 'Utility',
    niceName: null,
    description: 'Small utility application, "Accessories."',
    iconPath: 'utility/utility.svg',
    notes: null
  }
]

module.exports = categories;