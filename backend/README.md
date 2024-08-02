# Catalyst

Catalyst is a comprehensive financial management application designed to help users track expenses and income, create budgets, receive investment advice, manage portfolios, plan for retirement, handle debt, create repayment plans, and set financial goals. The application integrates with Gemini to provide personalized financial advice and real-time data.

## Overview

Catalyst is built using a microservices-based architecture with a Flask backend and a PostgreSQL database. The backend handles all business logic and data storage, while the frontend communicates with the backend via RESTful API endpoints. The backend uses SQLAlchemy for ORM and JWT for authentication. The integration with Gemini ensures real-time data streaming for financial advice and adjustments. The application is designed to be scalable and secure, with horizontal scaling enabled for future growth.

### Project Structure

```
Catalyst/
│
├── src/
│   ├── __init__.py
│   ├── app.py
│   ├── blueprints/
│   │   ├── __init__.py
│   │   ├── auth.py
│   │   ├── expense.py
│   │   ├── income.py
│   │   ├── llm.py
│   │   ├── debt.py
│   │   ├── investment.py
│   │   ├── tax.py
│   │   ├── budget.py
│   ├── config.py
│   ├── enums.py
│   ├── models.py
│   ├── schemas.py
│   ├── services/
│   │   ├── __init__.py
│   │   ├── auth.py
│   │   ├── debt_tracking.py
│   │   ├── expense_tracking.py
│   │   ├── income_tracking.py
│   │   ├── base_service.py
│   │   ├── investment_service.py
│   │   ├── tax_service.py
│   │   ├── budget_service.py
│   ├── llm/
│   │   ├── __init__.py
│   │   ├── client.py
│   │   ├── services.py
│   ├── utils.py
├── README.md
```

## Features

Catalyst offers a wide range of financial management features, including:

1. **Debt Management:**
   - Track debts and analyze repayment strategies.
   - Receive personalized debt consolidation advice from Gemini.

2. **Repayment Plans:**
   - Develop dynamic repayment plans for loans and debts.
   - Optimize repayment schedules to minimize interest costs with Gemini's help.

3. **Investment Advice:**
   - Receive tailored investment recommendations based on risk profile and goals.
   - Get personalized portfolio adjustments from Gemini.

4. **Portfolio Management:**
   - Track investments and monitor performance.
   - Adjust portfolios with personalized advice from Gemini.

5. **Taxes:**
   - Manage and plan for taxes.
   - Get tax optimization strategies from Gemini.

6. **Budgeting:**
   - Create personalized budgets based on income, expenses, and goals.
   - Receive guidance on budget creation from Gemini.

7. **Goal Setting:**
   - Set and track financial goals.
   - Get guidance on achieving goals from Gemini.

## Getting Started

### Requirements

- Python 3.8+
- PostgreSQL
- Virtual Environment (venv)

### Quickstart

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/your-repo/catalyst.git
   cd catalyst
   ```

2. **Set Up a Virtual Environment:**
   ```bash
   python3 -m venv venv
   source venv/bin/activate  # On Windows use `venv\Scripts\activate`
   ```

3. **Install Dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure Environment Variables:**
   Create a `.env` file in the project root and add the following:
   ```dotenv
   SECRET_KEY=your_secret_key
   DATABASE_URL=your_database_url
   JWT_SECRET_KEY=your_jwt_secret_key
   ```

5. **Initialize the Database:**
   ```bash
   flask db init
   flask db migrate -m "Initial migration."
   flask db upgrade
   ```

6. **Run the Application:**
   ```bash
   flask run
   ```

### License

```
Copyright (c) 2024.
```