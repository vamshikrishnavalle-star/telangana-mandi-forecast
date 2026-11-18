"""
Phase 8: Recommendation Engine for Farmers
"""

import pandas as pd
import numpy as np
from datetime import datetime, timedelta

class RecommendationEngine:
    def __init__(self, config=None):
        self.config = config or {
            'default_margin_pct': 0.03,
            'storage_cost_daily_pct': 0.001,
            'transport_cost_per_km': 2.0,
            'risk_discount_pct': 0.02,
            'min_confidence_threshold': 0.6,
            'max_wait_days': 14
        }
    
    def calculate_net_gain(self, current_price, forecast_price, days_to_wait):
        """Calculate net gain from waiting to sell"""
        gross_gain = forecast_price - current_price
        storage_cost = current_price * self.config['storage_cost_daily_pct'] * days_to_wait
        risk_discount = forecast_price * self.config['risk_discount_pct']
        
        net_gain = gross_gain - storage_cost - risk_discount
        net_gain_pct = (net_gain / current_price) * 100
        
        return {
            'gross_gain': gross_gain,
            'storage_cost': storage_cost,
            'risk_discount': risk_discount,
            'net_gain': net_gain,
            'net_gain_pct': net_gain_pct
        }
    
    def generate_recommendation(self, current_price, forecast_7d, forecast_14d, confidence_7d, confidence_14d):
        """Generate selling recommendation based on forecasts"""
        # Calculate gains for both horizons
        gain_7d = self.calculate_net_gain(current_price, forecast_7d, 7)
        gain_14d = self.calculate_net_gain(current_price, forecast_14d, 14)
        
        # Determine best recommendation
        recommendation = "Sell Now"
        best_horizon = None
        confidence_level = "Low"
        explanation = ""
        
        # Check 7-day horizon
        if (gain_7d['net_gain_pct'] > self.config['default_margin_pct'] * 100 and 
            confidence_7d >= self.config['min_confidence_threshold']):
            
            if gain_7d['net_gain_pct'] > gain_14d['net_gain_pct'] or confidence_7d > confidence_14d:
                recommendation = "Wait 7 Days"
                best_horizon = 7
                confidence_level = "High" if confidence_7d >= 0.8 else "Medium" if confidence_7d >= 0.6 else "Low"
                explanation = f"Expected net gain of ₹{gain_7d['net_gain']:,.0f} ({gain_7d['net_gain_pct']:.1f}%) after 7 days"
        
        # Check 14-day horizon
        elif (gain_14d['net_gain_pct'] > self.config['default_margin_pct'] * 100 and 
              confidence_14d >= self.config['min_confidence_threshold']):
            
            recommendation = "Wait 14 Days"
            best_horizon = 14
            confidence_level = "High" if confidence_14d >= 0.8 else "Medium" if confidence_14d >= 0.6 else "Low"
            explanation = f"Expected net gain of ₹{gain_14d['net_gain']:,.0f} ({gain_14d['net_gain_pct']:.1f}%) after 14 days"
        
        else:
            explanation = f"Current price of ₹{current_price:,.0f} is favorable. Prices expected to remain stable or decline."
        
        return {
            'recommendation': recommendation,
            'best_horizon': best_horizon,
            'confidence_level': confidence_level,
            'explanation': explanation,
            'net_gain_pct': gain_7d['net_gain_pct'] if best_horizon == 7 else gain_14d['net_gain_pct'] if best_horizon == 14 else 0
        }
    
    def compare_yards(self, commodity, yards_data):
        """Compare different yards for selling"""
        comparisons = []
        
        for yard_data in yards_data:
            comparison = {
                'yard': yard_data['yard'],
                'current_price': yard_data['current_price'],
                'recommendation': self.generate_recommendation(
                    yard_data['current_price'],
                    yard_data['forecast_7d'],
                    yard_data['forecast_14d'],
                    yard_data['confidence_7d'],
                    yard_data['confidence_14d']
                )
            }
            comparisons.append(comparison)
        
        # Sort by current price (highest first)
        comparisons.sort(key=lambda x: x['current_price'], reverse=True)
        
        return comparisons
    
    def generate_farm_recommendations(self, df, forecasts):
        """Generate recommendations for all commodity-yard combinations"""
        recommendations = []
        
        for commodity in df['commodity'].unique():
            for yard in df['market_yard'].unique():
                # Get current data
                current_data = df[(df['commodity'] == commodity) & (df['market_yard'] == yard)]
                if len(current_data) > 0:
                    current_price = current_data['modal_price'].iloc[-1]
                    
                    # Get forecast data
                    forecast_key = f"{commodity}_{yard}"
                    if forecast_key in forecasts:
                        forecast_data = forecasts[forecast_key]
                        
                        recommendation = self.generate_recommendation(
                            current_price,
                            forecast_data['forecast_7d'],
                            forecast_data['forecast_14d'],
                            forecast_data['confidence_7d'],
                            forecast_data['confidence_14d']
                        )
                        
                        recommendations.append({
                            'commodity': commodity,
                            'yard': yard,
                            'current_price': current_price,
                            'recommendation': recommendation
                        })
        
        return pd.DataFrame(recommendations)
