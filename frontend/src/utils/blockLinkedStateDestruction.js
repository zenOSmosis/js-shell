/**
 * Prevents a LinkedState instance from being able to be destroyed, by
 * overriding the destroy method usage with a thrown error.
 * 
 * @param {LinkedState} linkedStateInstance 
 */
const blockLinkedStateDestruction = (linkedStateInstance) => {
  linkedStateInstance.destroy = () => {
    throw new Error('Cannot destroy this LinkedState instance', linkedStateInstance);
  };
};

export default blockLinkedStateDestruction;