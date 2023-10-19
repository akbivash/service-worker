
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./worker.js')
   .then(registration => {
     console.log('Service Worker registered with scope:', registration.scope);
   })
   .catch(error => {
     console.error('Service Worker registration failed:', error);
   });

  document.querySelector('#heavy-calculation-button').addEventListener('click', () => {
    navigator.serviceWorker.controller.postMessage({ type: 'heavy-calculation-request' });
  });

  navigator.serviceWorker.addEventListener('message', (event) => {
    console.log(event)
    if (event.data && event.data.type === 'heavy-calculation-request') {
      const resultElement = document.querySelector('#result');
      resultElement.textContent = 'Result: ' + event.data.msg;
    }
  });

}
  