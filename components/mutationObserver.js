const mutationObserver = (targetNode, handler) => {
  const config = { attributeFilter: ['data-lon', 'data-lat'] };

  const callback = function(mutationsList) {
    for (let mutation of mutationsList) {
      handler(mutation.oldValue);
    }
  };

  const observer = new MutationObserver(callback);

  observer.observe(targetNode, config);
};

export default mutationObserver;
