#!/usr/bin/env python3
"""
Test runner for Smart Mandi Advisory System
"""

import unittest
import sys
import os
from pathlib import Path

def run_tests():
    """Run all tests with coverage reporting if available"""
    cov = None
    try:
        import coverage
        cov = coverage.Coverage(source=['src'])
        cov.start()
    except ImportError:
        pass
    
    # Discover and run tests
    test_loader = unittest.TestLoader()
    test_suite = test_loader.discover('tests', pattern='test_*.py')
    
    # Run tests
    runner = unittest.TextTestRunner(verbosity=2)
    result = runner.run(test_suite)
    
    # Stop coverage if active
    if cov:
        cov.stop()
        cov.save()
        print("\n📊 Coverage Report:")
        cov.report()
        try:
            cov.html_report(directory='coverage_report')
            print("📁 HTML coverage report saved to 'coverage_report/'")
        except Exception as e:
            print(f"HTML report notice: {e}")
    
    return result.wasSuccessful()

if __name__ == '__main__':
    # Change to project root directory
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    
    print("🧪 Running Smart Mandi Advisory System Tests")
    print("=" * 60)
    
    success = run_tests()
    
    print("=" * 60)
    if success:
        print("✅ All tests passed!")
    else:
        print("❌ Some tests failed!")
        sys.exit(1)
