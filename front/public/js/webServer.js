// Adds an event listener to the 'buyButton' to handle purchase events
// When the button is clicked, it collects the username, userid, price, and current timestamp
// Constructs a data object with the collected values and sends it to the app.js using an Axios POST request
document.getElementById('buyButton').addEventListener('click', async () => {

  const username = document.getElementById('username').value;
  const userid = document.getElementById('userid').value;
  const price = parseFloat(document.getElementById('price').value);
  const timestamp = new Date();

  const data = {
    username: username,
    userid: userid,
    price: price,
    timestamp: timestamp.toISOString()
  };

  try {
    const response = await axios.post('/sendData', data);
    console.log('Message sent successfully:', response.data);
  } catch (error) {
    console.error('Error sending message:', error);
  }
});

// Adds an event listener to the 'getAllUsersBuys' button to fetch all user purchases
// When the button is clicked, it sends a GET request to the server to retrieve all purchase data
// If the response is successful, it updates the page with the fetched data
document.getElementById('getAllUsersBuys').addEventListener('click', async () => {
  try {
    const response = await axios.get(`/getAllUsersBuys`);

    const purchasesContainer = document.createElement('div');
    response.data.forEach(purchase => {
      const purchaseElement = document.createElement('div');
      purchaseElement.innerHTML = `
        <h3 class="username">${purchase.username}</h3>
        <p class="userid">${purchase.userid}</p>
        <p class="price">${purchase.price}</p>
        <p class="timestamp">${purchase.timestamp}</p>
      `;
      purchasesContainer.appendChild(purchaseElement);
    });
    document.body.appendChild(purchasesContainer);
  } catch (error) {
    console.error('Error fetching data:', error);
  }
});



// Adds an event listener to the 'getAllUserBuys' button to fetch purchases for a specific user
// When the button is clicked, it retrieves the user ID from the input field and sends a GET request to the server
// If the response is successful, it updates the page with the fetched purchase data
document.getElementById('getAllUserBuys').addEventListener('click', async () => {
  try {
    const inputData = document.getElementById('useridBuys').value;
    const response = await axios.get(`/getAllUserBuys`, {
        params: {
            data: inputData
        }
    });

    const purchasesContainer = document.createElement('div');
    response.data.forEach(purchase => {
      const purchaseElement = document.createElement('div');
      purchaseElement.innerHTML = `
        <h3 class="username">${purchase.username}</h3>
        <p class="userid">${purchase.userid}</p>
        <p class="price">${purchase.price}</p>
        <p class="timestamp">${purchase.timestamp}</p>
      `;
      purchasesContainer.appendChild(purchaseElement);
    });
    document.body.appendChild(purchasesContainer);
  } catch (error) {
    console.error('Error fetching purchases:', error);
  }
});

