# Data Processing and API Documentation

## Dataset
The dataset used in this project is the UNSW-NB15 dataset, which contains network traffic data for cybersecurity analysis. It includes various features such as duration, protocol, service, state, and attack categories. The dataset is provided in CSV format.

## Python Data Processing Script
### Requirements
- Python 3.11.8
- pandas 2.2.1
- numpy 1.26.4
- seaborn 0.13.2
- matplotlib 3.8.3
- scikit-learn 1.4.1.post1

### Installation
```bash
pip install -r requirements.txt
```

# Python Data Processing Script

## Usage

- Ensure the dataset file 'UNSW_NB15_training-set.csv' is placed in the same directory as the script.
- Run the script 'data_processing_script.py' to perform data cleaning, transformation, analysis, and generate insights.

## Purpose of Python Code Sections

1. **Import necessary libraries for data processing and analysis:**
   - This section imports required libraries such as NumPy, Pandas, Seaborn, Matplotlib, and scikit-learn for data analysis and visualization.

2. **Read the dataset using pandas:**
   - The script reads the dataset from the file 'UNSW_NB15_training-set.csv' using the `pd.read_csv()` function from Pandas.

3. **Perform data processing to handle missing values and duplicates:**
   - Data cleaning operations are performed to handle missing values and duplicates in the dataset.

4. **Transform categorical data using LabelEncoder:**
   - Categorical data is transformed into numerical format using LabelEncoder from scikit-learn.

5. **Compute statistics and visualize data using seaborn and matplotlib:**
   - The script computes statistics and visualizes data using Seaborn and Matplotlib libraries.

6. **Export the cleaned dataset to a new CSV file:**
   - Finally, the cleaned dataset is exported to a new CSV file named 'cleaned_data.csv'.

## Usage of Additional Functions

- **Retrieving Data:** 
  - The `get_data(page)` function retrieves data from the Express.js server using a POST request for the specified page.
- **Posting Data:** 
  - The `post_data(id)` function posts data to the Express.js server using a POST request for the specified ID.
- **Updating Data:** 
  - The `put_data(id_to_update, update_data)` function updates data on the Express.js server using a PUT request for the specified ID with the provided update data.
- **Deleting Data:** 
  - The `delete_data(id)` function deletes data on the Express.js server using a DELETE request for the specified ID.


# Express.js Server

## Requirements

- Node.js
- express

## Installation

```bash
npm install
```

# Usage

- Run the command `node server.js` to start the Express.js server.
- The server will listen on port 3000 by default.

# Purpose of Server Code Sections

- Set up an Express.js server to serve as the REST API backend.
- Define routes and endpoints to expose the processed data.
- Implement appropriate HTTP methods (GET, POST, PUT, DELETE) for interacting with the data.


# Additional Notes

- Ensure that the dataset file is named 'UNSW_NB15_training-set.csv' and is located in the same directory as the Python script.
