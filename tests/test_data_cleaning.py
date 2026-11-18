# Phase 10: Testing, Documentation, and Delivery
# File: tests/test_data_cleaning.py

import unittest
import pandas as pd
import numpy as np
import sys
import os

# Add src to path
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'src'))

from data_cleaning import (
    standardize_dates, standardize_names, remove_duplicates,
    handle_missing_values, detect_outliers, clean_dataset
)

class TestDataCleaning(unittest.TestCase):
    
    def setUp(self):
        """Set up test data"""
        self.sample_data = pd.DataFrame({
            'date': ['2023-01-01', '2023-01-02', '2023-01-03', '2023-01-01'],
            'commodity': ['cotton', 'chilli', 'maize', 'cotton'],
            'market_yard': ['rci market', 'gurramguda', 'bccl market', 'rci market'],
            'modal_price': [5000, 7000, 2000, 5000],
            'arrivals': [100, 150, 200, 100]
        })
    
    def test_standardize_dates(self):
        """Test date standardization"""
        df = self.sample_data.copy()
        result = standardize_dates(df)
        
        # Check if dates are datetime objects
        self.assertTrue(pd.api.types.is_datetime64_any_dtype(result['date']))
        
        # Check if dates are properly formatted
        self.assertEqual(result['date'].iloc[0], pd.Timestamp('2023-01-01'))
    
    def test_standardize_names(self):
        """Test name standardization"""
        df = self.sample_data.copy()
        result = standardize_names(df)
        
        # Check commodity standardization
        self.assertEqual(result['commodity'].iloc[0], 'Cotton')
        self.assertEqual(result['commodity'].iloc[1], 'Chilli')
        
        # Check yard standardization
        self.assertEqual(result['market_yard'].iloc[0], 'Hyderabad RCI Market')
        self.assertEqual(result['market_yard'].iloc[1], 'Warangal Gurramguda')
    
    def test_remove_duplicates(self):
        """Test duplicate removal"""
        df = self.sample_data.copy()
        initial_count = len(df)
        
        result = remove_duplicates(df)
        
        # Should remove one duplicate row
        self.assertEqual(len(result), initial_count - 1)
    
    def test_handle_missing_values(self):
        """Test missing value handling"""
        df = pd.DataFrame({
            'date': pd.date_range('2023-01-01', periods=5, freq='D'),
            'commodity': ['Cotton'] * 5,
            'market_yard': ['Hyderabad RCI Market'] * 5,
            'modal_price': [5000, np.nan, 5200, 5300, 5400],
            'arrivals': [100, 150, np.nan, 200, 250]
        })
        
        result = handle_missing_values(df)
        
        # Check if missing values are handled
        self.assertEqual(result['modal_price'].isnull().sum(), 0)
        self.assertEqual(result['arrivals'].isnull().sum(), 0)
    
    def test_detect_outliers(self):
        """Test outlier detection"""
        # Create data with clear outliers
        prices = [1000, 1020, 1015, 1030, 5000, 1025, 1010, 1035, 1020, 1015]
        df = pd.DataFrame({'modal_price': prices})
        
        outliers = detect_outliers(df)
        
        # Should detect the outlier (5000)
        self.assertEqual(len(outliers), 1)
        self.assertEqual(outliers.iloc[0]['modal_price'], 5000)
    
    def test_clean_dataset_pipeline(self):
        """Test complete cleaning pipeline"""
        df = self.sample_data.copy()
        result = clean_dataset(df)
        
        # Check if all cleaning steps were applied
        self.assertTrue(pd.api.types.is_datetime64_any_dtype(result['date']))
        self.assertEqual(result['commodity'].iloc[0], 'Cotton')
        self.assertEqual(len(result), 3)  # One duplicate removed

if __name__ == '__main__':
    unittest.main()
