# File: tests/test_models.py

import unittest
import pandas as pd
import numpy as np
import sys
import os

# Add src to path
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'src'))

from models import (
    naive_forecast, seasonal_naive_forecast, 
    moving_average_forecast, calculate_metrics
)

class TestModels(unittest.TestCase):
    
    def setUp(self):
        """Set up test data"""
        self.sample_data = pd.DataFrame({
            'date': pd.date_range('2023-01-01', periods=20, freq='D'),
            'commodity': ['Cotton'] * 20,
            'market_yard': ['Hyderabad RCI Market'] * 20,
            'modal_price': [5000 + i*10 for i in range(20)],
            'modal_price_target': [5000 + i*10 + 5 for i in range(20)]
        })
    
    def test_naive_forecast(self):
        """Test naive forecast"""
        df = self.sample_data.copy()
        result = naive_forecast(df, horizon=1)
        
        # Check if forecast column is created
        self.assertIn('naive_forecast', result.columns)
        
        # Check if forecast values are shifted
        self.assertEqual(result['naive_forecast'].iloc[1], result['modal_price'].iloc[0])
    
    def test_seasonal_naive_forecast(self):
        """Test seasonal naive forecast"""
        df = self.sample_data.copy()
        result = seasonal_naive_forecast(df, horizon=1)
        
        # Check if forecast column is created
        self.assertIn('seasonal_naive', result.columns)
    
    def test_moving_average_forecast(self):
        """Test moving average forecast"""
        df = self.sample_data.copy()
        result = moving_average_forecast(df, window=3, horizon=1)
        
        # Check if forecast column is created
        self.assertIn('ma_forecast', result.columns)
    
    def test_calculate_metrics(self):
        """Test metrics calculation"""
        actual = pd.Series([100, 105, 110, 115, 120])
        predicted = pd.Series([102, 107, 112, 117, 122])
        
        result = calculate_metrics(actual, predicted)
        
        # Check if metrics are calculated correctly
        self.assertIsNotNone(result)
        self.assertIn('MAE', result)
        self.assertIn('RMSE', result)
        self.assertIn('MAPE', result)
        
        # Check if MAE is reasonable
        expected_mae = 2.0  # Average absolute error
        self.assertAlmostEqual(result['MAE'], expected_mae, places=1)

if __name__ == '__main__':
    unittest.main()
