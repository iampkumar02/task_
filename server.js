const express = require('express');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Route to fetch processed data with pagination
// Example: POST localhost:3000?page=3
app.post('/data', (req, res) => {
    const page = parseInt(req.query.page) || 1;  // Get page number from query parameter, default to 1
    const pageSize = 10;  // Number of items per page
  
    // Extract data from the request body sent by Python
    const receivedData = req.body.data;
    // Parse JSON string into JavaScript object
    const jsonDataArray = JSON.parse(receivedData);

    // Count the total number of rows
    const rowCount = jsonDataArray.length;
    console.log('Total number of rows:', rowCount);
  
    // Calculate pagination offsets
    const startIndex = (page - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, rowCount);
  
    // Extract data for the current page
    const currentPageData = jsonDataArray.slice(startIndex, endIndex);
  
    // Prepare response object with pagination metadata
    const responseData = {
      currentPage: page,
      totalPages: Math.ceil(rowCount / pageSize),
      pageSize: pageSize,
      totalItems: rowCount,
      data: currentPageData
    };
  
    // Send response
    res.json(responseData);
});
 
// Route to retrieve specific data by ID
// Example: POST localhost:3000/data/20
app.post('/data/:id', (req, res) => {
    const id = parseInt(req.params.id); // Convert parameter to integer

    // Extract data from the request body sent by Python
    const receivedData = req.body.data;

    // Parse JSON string into JavaScript object
    const jsonDataArray = JSON.parse(receivedData);

    // Find the object with the matching ID (convert ID to string for comparison)
    const specificData = jsonDataArray.find(obj => obj.id.toString() === id.toString());

    if (specificData) {
        res.json(specificData);
    } else {
        res.status(404).json({ error: 'Data not found' });
    }
});

// Route to update existing data in the dataset
// Example: PUT localhost:3000/20 and add body
app.put('/data/:id', (req, res) => {
    const id = parseInt(req.params.id); // Convert ID to a number
    const updatedColumns = req.body.to_change; // Extract the updated columns and their values from the request body

    // Extract the received data from the request body sent by Python
    const receivedData = req.body.data;
    // Parse JSON string into JavaScript object
    const jsonDataArray = JSON.parse(receivedData);

    // Find the index of the data with the specified ID
    const dataIndex = jsonDataArray.findIndex(item => item.id === id);

    if (dataIndex === -1) {
        return res.status(404).json({ error: 'Data not found' });
    }

    // Update the specified column for the data with the unique ID
    Object.keys(updatedColumns).forEach(column => {
        jsonDataArray[dataIndex][column] = updatedColumns[column];
    });

    // Send a success response
    res.json({ message: 'Data updated successfully', data: jsonDataArray[dataIndex] });
});

// Route to delete existing data in the dataset
// Example: DELETE localhost:3000/20
app.delete('/data/:id', (req, res) => {
    const id = parseInt(req.params.id); // Convert parameter to integer

    // Extract data from the request body sent by Python
    const receivedData = req.body.data;

    // Parse JSON string into JavaScript object
    const jsonDataArray = JSON.parse(receivedData);

    // Find the index of the data with the specified ID
    const dataIndex = jsonDataArray.findIndex(item => item.id === id);
    if (dataIndex === -1) {
        return res.status(404).json({ error: 'Data not found' });
    }

    // Remove the data item with the specified ID from the array
    jsonDataArray.splice(dataIndex, 1);

    // Send a success response with the updated jsonDataArray
    res.json({ message: 'Data deleted successfully', data: jsonDataArray });
});


// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
