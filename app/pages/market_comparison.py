"""
Market Comparison Page
"""

import streamlit as st
import pandas as pd
import numpy as np
import plotly.express as px
import plotly.graph_objects as go

def show():
    st.header("🏛️ Market Yard Comparison")
    
    commodity = st.selectbox(
        "Select Crop",
        ["Cotton", "Chilli", "Maize", "Paddy", "Turmeric"],
        key="compare_commodity"
    )
    
    # Generate sample yard data
    np.random.seed(hash(commodity) % 2**32)
    
    yards = [
        "Hyderabad RCI Market", "Warangal Gurramguda", "Karimnagar BCCL Market",
        "Nizamabad", "Khammam", "Adilabad", "Nalgonda", "Mahbubnagar",
        "Medak", "Suryapet"
    ]
    
    base_price = {'Cotton': 8500, 'Chilli': 12000, 'Maize': 2200, 'Paddy': 2100, 'Turmeric': 9500}
    base = base_price.get(commodity, 5000)
    
    yard_data = []
    for yard in yards:
        price = base + np.random.normal(0, base * 0.05)
        change_7d = np.random.uniform(-5, 8)
        arrivals = np.random.randint(100, 5000)
        
        yard_data.append({
            'Market Yard': yard,
            'Current Price (₹/q)': round(price),
            '7d Change (%)': round(change_7d, 1),
            'Arrivals (q)': arrivals,
            'Recommendation': 'Wait' if change_7d > 3 else 'Sell Now'
        })
    
    yard_df = pd.DataFrame(yard_data)
    yard_df = yard_df.sort_values('Current Price (₹/q)', ascending=False)
    
    # Price comparison bar chart
    fig = px.bar(
        yard_df,
        x='Market Yard',
        y='Current Price (₹/q)',
        color='Recommendation',
        color_discrete_map={'Sell Now': 'green', 'Wait': 'orange'},
        title=f'{commodity} Prices Across Market Yards'
    )
    fig.update_layout(xaxis_tickangle=45, height=500)
    st.plotly_chart(fig, use_container_width=True)
    
    # Detailed table
    st.subheader("Detailed Comparison")
    st.dataframe(yard_df, use_container_width=True, hide_index=True)
    
    # Best yard highlight
    best_yard = yard_df.iloc[0]
    st.success(
        f"🏆 **Best Price**: {best_yard['Market Yard']} at "
        f"₹{best_yard['Current Price (₹/q)']:,}/quintal "
        f"({best_yard['Recommendation']})"
    )
    
    # Price spread analysis
    st.markdown("---")
    st.subheader("Price Spread Analysis")
    
    col1, col2, col3 = st.columns(3)
    with col1:
        st.metric("Highest Price", f"₹{yard_df['Current Price (₹/q)'].max():,}")
    with col2:
        st.metric("Lowest Price", f"₹{yard_df['Current Price (₹/q)'].min():,}")
    with col3:
        spread = yard_df['Current Price (₹/q)'].max() - yard_df['Current Price (₹/q)'].min()
        st.metric("Price Spread", f"₹{spread:,}")

if __name__ == "__main__":
    show()
