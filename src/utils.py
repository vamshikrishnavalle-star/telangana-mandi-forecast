"""
Utility Functions
"""

import pandas as pd
import numpy as np
import os
import json
from datetime import datetime

def create_directories(dirs):
    """Create directories if they don't exist"""
    for directory in dirs:
        os.makedirs(directory, exist_ok=True)

def save_json(data, filepath):
    """Save data as JSON"""
    with open(filepath, 'w') as f:
        json.dump(data, f, indent=2)

def load_json(filepath):
    """Load JSON data"""
    with open(filepath, 'r') as f:
        return json.load(f)

def calculate_metrics(actual, predicted):
    """Calculate basic evaluation metrics"""
    from sklearn.metrics import mean_absolute_error, mean_squared_error
    
    mae = mean_absolute_error(actual, predicted)
    rmse = np.sqrt(mean_squared_error(actual, predicted))
    mape = np.mean(np.abs((actual - predicted) / actual)) * 100
    
    return {
        'MAE': mae,
        'RMSE': rmse,
        'MAPE': mape
    }

def setup_logging(log_file="app.log"):
    """Setup logging configuration"""
    import logging
    
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
        handlers=[
            logging.FileHandler(log_file),
            logging.StreamHandler()
        ]
    )
    return logging.getLogger(__name__)
