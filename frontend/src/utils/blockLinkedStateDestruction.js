const blockLinkedStateDestruction = (linkedStateInstance) => {
  linkedStateInstance.destroy = () => {
    throw new Error('Cannot destroy this LinkedState instance', linkedStateInstance);
  };
};

export default blockLinkedStateDestruction;