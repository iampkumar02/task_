const express = require('express');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;

// Define middleware to parse JSON requests
app.use(express.json());

// Route to retrieve processed data with pagination
app.get('/data', (req, res) => {
  const page = parseInt(req.query.page) || 1;  // Get page number from query parameter, default to 1
  const pageSize = 10;  // Number of items per page

  // Read the processed data from the file
  fs.readFile('cleaned_data.csv', 'utf8', (err, data) => {
      if (err) {
          console.error('Error reading processed data:', err);
          return res.status(500).json({ error: 'Internal Server Error' });
      }

      // Parse CSV data into an array of rows
      const rows = data.trim().split('\n').slice(1); // Skip header row
      const totalItems = rows.length;

      // Calculate pagination offsets
      const startIndex = (page - 1) * pageSize;
      const endIndex = Math.min(startIndex + pageSize, totalItems);

      // Extract data for the current page
      const currentPageData = rows.slice(startIndex, endIndex);

      // Prepare response object with pagination metadata
      const responseData = {
          currentPage: page,
          totalPages: Math.ceil(totalItems / pageSize),
          pageSize: pageSize,
          totalItems: totalItems,
          data: currentPageData
      };

      // Send response
      res.json(responseData);
  });
});

// Route to retrieve specific data by ID
app.post('/data/:id', (req, res) => {
  const id = req.params.id; // Extract the ID parameter from the request

  // Read the processed data from the file
  fs.readFile('cleaned_data.csv', 'utf8', (err, data) => {
      if (err) {
          console.error('Error reading processed data:', err);
          return res.status(500).json({ error: 'Internal Server Error' });
      }

      // Parse the data into an array of objects
      const rows = data.trim().split('\n');
      const header = rows[0].split(',');
      const columnIndex = header.indexOf('id'); // Assuming 'id' is the identifier column

      // Initialize specific data as null
      let specificData = null;

      // Loop through each row to find the specific data by ID
      for (let i = 1; i < rows.length; i++) {
          const values = rows[i].split(',');
          if (values[columnIndex] === id) {
              // Found the specific data
              specificData = {};
              header.forEach((key, index) => {
                  specificData[key] = values[index];
              });
              break; // Exit the loop once specific data is found
          }
      }

      if (!specificData) {
          return res.status(404).json({ error: 'Data not found' });
      }

      // Send the specific data as a JSON response
      res.json(specificData);
  });
});

// Route to update existing data in the dataset
app.put('/data/:id', (req, res) => {
  const id = req.params.id; // Extract the ID parameter from the request
  const updatedColumns = req.body; // Extract the updated columns and their values from the request body

  // Read the existing data from the file
  fs.readFile('cleaned_data.csv', 'utf8', (err, data) => {
      if (err) {
          console.error('Error reading processed data:', err);
          return res.status(500).json({ error: 'Internal Server Error' });
      }

      // Parse the data into an array of objects
      const rows = data.trim().split('\n');
      const header = rows[0].split(',');
      const processedData = rows.slice(1).map(row => {
          const values = row.split(',');
          const obj = {};
          header.forEach((key, index) => {
              obj[key] = values[index];
          });
          return obj;
      });

      // Find the index of the data with the specified ID
      const dataIndex = processedData.findIndex(item => item.id === id);

      if (dataIndex === -1) {
          return res.status(404).json({ error: 'Data not found' });
      }

      // Update the specified columns for the data with the specified ID
      console.log("Before: ", processedData[dataIndex])
      Object.keys(updatedColumns).forEach(column => {
          processedData[dataIndex][column] = updatedColumns[column];
      });
      console.log("After:", processedData[dataIndex])
      // Convert the updated data back to CSV format
      const updatedCSV = [header.join(',')].concat(processedData.map(item => Object.values(item).join(','))).join('\n');

      // Write the updated data back to the file
      fs.writeFile('cleaned_data.csv', updatedCSV, 'utf8', (err) => {
          if (err) {
              console.error('Error writing processed data:', err);
              return res.status(500).json({ error: 'Internal Server Error' });
          }

          // Send a success response
          res.json({ message: 'Data updated successfully' });
      });
  });
});


// Route to delete existing data in the dataset
app.delete('/data/:id', (req, res) => {
    const id = req.params.id; // Extract the ID parameter from the request

    // Read the existing data from the file
    fs.readFile('cleaned_data.csv', 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading processed data:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        // Parse the data into an array of objects
        const rows = data.trim().split('\n');
        const header = rows[0].split(',');
        const processedData = rows.slice(1).map(row => {
            const values = row.split(',');
            const obj = {};
            header.forEach((key, index) => {
                obj[key] = values[index];
            });
            return obj;
        });

        // Find the index of the data with the specified ID
        const dataIndex = processedData.findIndex(item => item.id === id);

        if (dataIndex === -1) {
            return res.status(404).json({ error: 'Data not found' });
        }

        // Remove the data with the specified ID from the array
        processedData.splice(dataIndex, 1);

        // Convert the updated data back to CSV format
        const updatedCSV = [header.join(',')].concat(processedData.map(item => Object.values(item).join(','))).join('\n');

        // Write the updated data back to the file
        fs.writeFile('cleaned_data.csv', updatedCSV, 'utf8', (err) => {
            if (err) {
                console.error('Error writing processed data:', err);
                return res.status(500).json({ error: 'Internal Server Error' });
            }

            // Send a success response
            res.json({ message: 'Data deleted successfully' });
        });
    });
});


// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
