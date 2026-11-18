"""
Phase 7: Model Evaluation and Comparison
"""

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from sklearn.metrics import mean_absolute_error, mean_squared_error

def calculate_comprehensive_metrics(actual, predicted):
    """Calculate comprehensive evaluation metrics"""
    mask = ~(np.isnan(actual) | np.isnan(predicted))
    actual_clean = np.array(actual)[mask]
    predicted_clean = np.array(predicted)[mask]
    
    if len(actual_clean) == 0:
        return None
    
    # Basic metrics
    mae = mean_absolute_error(actual_clean, predicted_clean)
    rmse = np.sqrt(mean_squared_error(actual_clean, predicted_clean))
    mape = np.mean(np.abs((actual_clean - predicted_clean) / actual_clean)) * 100
    smape = np.mean(2 * np.abs(actual_clean - predicted_clean) / 
                   (np.abs(actual_clean) + np.abs(predicted_clean))) * 100
    
    # MASE calculation
    naive_forecast = np.roll(actual_clean, 1)
    naive_forecast[0] = actual_clean[0]
    mae_naive = np.mean(np.abs(actual_clean - naive_forecast))
    mase = mae / mae_naive if mae_naive != 0 else float('inf')
    
    # Directional accuracy
    if len(actual_clean) > 1:
        actual_direction = np.diff(actual_clean) > 0
        predicted_direction = np.diff(predicted_clean) > 0
        directional_accuracy = np.mean(actual_direction == predicted_direction) * 100
    else:
        directional_accuracy = 0
    
    return {
        'MAE': mae,
        'RMSE': rmse,
        'MAPE': mape,
        'SMAPE': smape,
        'MASE': mase,
        'Directional_Accuracy': directional_accuracy,
        'Count': len(actual_clean)
    }

def compare_models(results_df):
    """Compare model performance across different metrics"""
    comparison = {}
    
    for metric in ['MAE', 'RMSE', 'MAPE', 'SMAPE', 'MASE', 'Directional_Accuracy']:
        if metric in results_df.columns:
            best_model = results_df.loc[results_df[metric].idxmin(), 'Model'] if metric != 'Directional_Accuracy' else results_df.loc[results_df[metric].idxmax(), 'Model']
            comparison[metric] = {
                'best_model': best_model,
                'best_value': results_df[metric].min() if metric != 'Directional_Accuracy' else results_df[metric].max(),
                'all_models': results_df[['Model', metric]].to_dict('records')
            }
    
    return comparison

def create_evaluation_visualizations(results_df, output_dir):
    """Create visualizations for model comparison"""
    # MAE comparison
    plt.figure(figsize=(12, 6))
    mae_pivot = results_df.pivot(index='Model', columns='Horizon', values='MAE')
    mae_pivot.plot(kind='bar', legend=True)
    plt.title('MAE Comparison by Model and Horizon')
    plt.ylabel('MAE (₹/quintal)')
    plt.savefig(f'{output_dir}/mae_comparison.png')
    plt.close()
    
    # MAPE comparison
    plt.figure(figsize=(12, 6))
    mape_pivot = results_df.pivot(index='Model', columns='Horizon', values='MAPE')
    mape_pivot.plot(kind='bar', legend=True)
    plt.title('MAPE Comparison by Model and Horizon')
    plt.ylabel('MAPE (%)')
    plt.savefig(f'{output_dir}/mape_comparison.png')
    plt.close()

def generate_evaluation_report(results_df, output_dir):
    """Generate comprehensive evaluation report"""
    report_lines = []
    report_lines.append("MODEL EVALUATION REPORT")
    report_lines.append("=" * 50)
    
    # Model comparison table
    report_lines.append("MODEL PERFORMANCE COMPARISON:")
    report_lines.append("-" * 40)
    for _, row in results_df.iterrows():
        report_lines.append(f"{row['Model']} ({row['Horizon']}):")
        report_lines.append(f"  MAE: ₹{row['MAE']:,.0f}")
        report_lines.append(f"  RMSE: ₹{row['RMSE']:,.0f}")
        report_lines.append(f"  MAPE: {row['MAPE']:.1f}%")
        report_lines.append(f"  SMAPE: {row['SMAPE']:.1f}%")
        report_lines.append(f"  MASE: {row['MASE']:.3f}")
        report_lines.append(f"  Directional Accuracy: {row['Directional_Accuracy']:.1f}%")
        report_lines.append("")
    
    # Best models by metric
    comparison = compare_models(results_df)
    report_lines.append("BEST MODELS BY METRIC:")
    report_lines.append("-" * 40)
    for metric, info in comparison.items():
        report_lines.append(f"{metric}: {info['best_model']} ({info['best_value']:.2f})")
    
    with open(f'{output_dir}/evaluation_report.txt', 'w') as f:
        f.write('\n'.join(report_lines))
