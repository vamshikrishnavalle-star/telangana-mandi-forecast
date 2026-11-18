from setuptools import setup, find_packages

setup(
    name="smart-mandi-advisory",
    version="1.0.0",
    description="Smart Mandi Price Forecasting and Sell-Time Advisory System for Telangana Farmers",
    author="Smart Mandi Team",
    packages=find_packages(),
    install_requires=[
        "pandas>=2.0.0",
        "numpy>=1.24.0",
        "scikit-learn>=1.3.0",
        "statsmodels>=0.14.0",
        "prophet>=1.1.4",
        "xgboost>=1.7.0",
        "streamlit>=1.25.0",
        "plotly>=5.15.0",
        "matplotlib>=3.7.0",
        "seaborn>=0.12.0",
        "coverage>=5.5"
    ],
    python_requires=">=3.8",
    classifiers=[
        "Development Status :: 4 - Beta",
        "Intended Audience :: Developers",
        "License :: OSI Approved :: MIT License",
        "Programming Language :: Python :: 3",
        "Programming Language :: Python :: 3.8",
        "Programming Language :: Python :: 3.9",
        "Programming Language :: Python :: 3.10",
        "Programming Language :: Python :: 3.11",
        "Programming Language :: Python :: 3.12",
        "Programming Language :: Python :: 3.13",
        "Programming Language :: Python :: 3.14",
    ],
)
