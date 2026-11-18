# File: tests/test_recommendation.py

import unittest
import sys
import os

# Add src to path
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'src'))

from recommendation import RecommendationEngine

class TestRecommendationEngine(unittest.TestCase):
    
    def setUp(self):
        """Set up recommendation engine"""
        self.engine = RecommendationEngine()
    
    def test_calculate_net_gain(self):
        """Test net gain calculation"""
        current_price = 5000
        forecast_price = 5200
        days_to_wait = 7
        
        result = self.engine.calculate_net_gain(current_price, forecast_price, days_to_wait)
        
        # Check basic calculations
        self.assertEqual(result['gross_gain'], 200)
        self.assertEqual(result['storage_cost'], 35)  # 5000 * 0.001 * 7
        self.assertEqual(result['risk_discount'], 104)  # 5200 * 0.02
        self.assertEqual(result['net_gain'], 61)  # 200 - 35 - 104
    
    def test_generate_recommendation_sell_now(self):
        """Test sell now recommendation"""
        current_price = 5000
        forecast_7d = 5050  # Small gain
        forecast_14d = 5100
        confidence_7d = 0.65
        confidence_14d = 0.60
        
        result = self.engine.generate_recommendation(
            current_price, forecast_7d, forecast_14d, 
            confidence_7d, confidence_14d
        )
        
        # Should recommend selling now due to small gains
        self.assertEqual(result['recommendation'], 'Sell Now')
        self.assertEqual(result['confidence_level'], 'Low')
    
    def test_generate_recommendation_wait(self):
        """Test wait recommendation"""
        current_price = 5000
        forecast_7d = 5300  # Significant gain
        forecast_14d = 5400
        confidence_7d = 0.85
        confidence_14d = 0.75
        
        result = self.engine.generate_recommendation(
            current_price, forecast_7d, forecast_14d, 
            confidence_7d, confidence_14d
        )
        
        # Should recommend waiting due to significant gains
        self.assertEqual(result['recommendation'], 'Wait 7 Days')
        self.assertEqual(result['confidence_level'], 'High')
    
    def test_compare_yards(self):
        """Test yard comparison"""
        yards_data = [
            {
                'yard': 'Yard A',
                'current_price': 5000,
                'forecast_7d': 5100,
                'forecast_14d': 5200,
                'confidence_7d': 0.8,
                'confidence_14d': 0.7
            },
            {
                'yard': 'Yard B',
                'current_price': 4900,
                'forecast_7d': 5000,
                'forecast_14d': 5100,
                'confidence_7d': 0.75,
                'confidence_14d': 0.65
            }
        ]
        
        result = self.engine.compare_yards('Cotton', yards_data)
        
        # Should sort by current price (highest first)
        self.assertEqual(result[0]['yard'], 'Yard A')
        self.assertEqual(result[1]['yard'], 'Yard B')

if __name__ == '__main__':
    unittest.main()
