.PHONY: help install test coverage clean deploy run

help:
	@echo "Smart Mandi Advisory System - Available Commands"
	@echo "================================================="
	@echo "make install    - Install project dependencies"
	@echo "make test       - Run all tests"
	@echo "make coverage   - Run tests with coverage report"
	@echo "make clean      - Clean temporary files"
	@echo "make deploy     - Deploy to Streamlit Community Cloud"
	@echo "make run        - Run the web application"

install:
	pip install -r requirements.txt
	pip install -e .

test:
	python run_tests.py

coverage:
	python run_tests.py

clean:
	python -c "import shutil, pathlib; [shutil.rmtree(p) for p in pathlib.Path('.').rglob('__pycache__')]; [p.unlink() for p in pathlib.Path('.').rglob('*.pyc')]"

run:
	cd app && python -m streamlit run app.py

deploy:
	@echo "Deploying to Streamlit Community Cloud..."
	@echo "1. Push code to GitHub"
	@echo "2. Go to share.streamlit.io"
	@echo "3. Click 'New app'"
	@echo "4. Select repository and set main file to app/app.py"
	@echo "5. Click 'Deploy'"
