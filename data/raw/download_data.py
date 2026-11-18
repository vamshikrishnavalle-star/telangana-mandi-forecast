"""
Data Collection API for Telangana Market Yard Commodities
"""

import requests
import pandas as pd
import os
from datetime import datetime

class TelanganaDataCollector:
    def __init__(self):
        self.base_url = "https://data.telangana.gov.in/api/3/action"
        self.package_id = "ffbdd40f-573f-4160-9bea-3fba961834c5"
        
    def get_dataset_metadata(self):
        """Get metadata for the market yard commodities dataset"""
        url = f"{self.base_url}/package_show?id={self.package_id}"
        response = requests.get(url)
        return response.json()
    
    def download_csv_files(self, output_dir="data/raw"):
        """Download all CSV files from the dataset"""
        os.makedirs(output_dir, exist_ok=True)
        
        metadata = self.get_dataset_metadata()
        resources = metadata['result']['resources']
        
        downloaded_files = []
        for i, resource in enumerate(resources):
            if resource['format'] == 'CSV':
                filename = f"market_data_{i+1}.csv"
                filepath = os.path.join(output_dir, filename)
                
                response = requests.get(resource['url'])
                with open(filepath, 'wb') as f:
                    f.write(response.content)
                
                downloaded_files.append(filepath)
                print(f"Downloaded: {filepath}")
        
        return downloaded_files
    
    def get_rainfall_data(self, latitude, longitude, start_date, end_date):
        """Get historical rainfall data from Open-Meteo"""
        url = "https://archive-api.open-meteo.com/v1/archive"
        params = {
            'latitude': latitude,
            'longitude': longitude,
            'start_date': start_date,
            'end_date': end_date,
            'daily': 'precipitation',
            'timezone': 'Asia/Kolkata'
        }
        
        response = requests.get(url, params=params)
        return response.json()

# Usage example
if __name__ == "__main__":
    collector = TelanganaDataCollector()
    
    # Download market data
    files = collector.download_csv_files()
    print(f"Downloaded {len(files)} files")
    
    # Get rainfall data for Hyderabad
    rainfall = collector.get_rainfall_data(
        latitude=17.3850,
        longitude=78.4867,
        start_date="2020-01-01",
        end_date="2023-12-31"
    )
    print("Rainfall data collected")
