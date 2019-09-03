import AppRegistryLinkedState from 'state/AppRegistryLinkedState';

const getAppRegistrationsWithMimeType = (mimeType) => {
  const appRegistry = new AppRegistryLinkedState();

  const appRegistrations = appRegistry.getAppRegistrations();

  const supportedAppRegistrations = appRegistrations.filter(appRegistration => {
    const _mimeTypes = appRegistration.getMimeTypes();

    return _mimeTypes.includes(mimeType) || _mimeTypes.includes('*');
  });

  return supportedAppRegistrations;
};

export default getAppRegistrationsWithMimeType;