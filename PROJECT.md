# Smart Mandi Price Forecasting - Project Documentation

## Data Sources

### Primary Data Source
- **Telangana Open Data Portal**: https://data.telangana.gov.in/dataset/daily-prices-market-yard-commodities-telangana
- **API Endpoint**: https://data.telangana.gov.in/api/3/action/package_show?id=ffbdd40f-573f-4160-9bea-3fba961834c5
- **Data Format**: CSV files with daily prices of market yard commodities

### Reference Data
- **Market Yards List**: https://data.telangana.gov.in/dataset/telangana-market-yards-list
- **Geo Locations**: https://data.telangana.gov.in/dataset/primary-market-yards-geo-locations

### External Data
- **MSP Data**: Government of India Minimum Support Prices
- **Rainfall Data**: Open-Meteo Historical API (https://archive-api.open-meteo.com/v1/archive)

## API Documentation

### Telangana Open Data API
```python
import requests

# Get dataset metadata
url = "https://data.telangana.gov.in/api/3/action/package_show?id=ffbdd40f-573f-4160-9bea-3fba961834c5"
response = requests.get(url)
data = response.json()

# Download resources
for resource in data['result']['resources']:
    if resource['format'] == 'CSV':
        file_url = resource['url']
        # Download CSV file
```

### Open-Meteo Rainfall API
```python
import requests

url = "https://archive-api.open-meteo.com/v1/archive"
params = {
    'latitude': 17.3850,
    'longitude': 78.4867,
    'start_date': '2020-01-01',
    'end_date': '2023-12-31',
    'daily': 'precipitation',
    'timezone': 'Asia/Kolkata'
}
response = requests.get(url, params=params)
rainfall_data = response.json()
```

## Project Timeline
- Phase 0-8: Core development completed
- Phase 9: Web application deployment
- Phase 10: Testing and documentation
