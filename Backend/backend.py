from flask import Flask, request, jsonify, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_httpauth import HTTPBasicAuth
import os
from dotenv import load_dotenv
from werkzeug.security import generate_password_hash, check_password_hash  # for hashing passwords, not used yet

# Load environment variables from a .env file
load_dotenv()

# Initialize Flask application
app = Flask(__name__)
CORS(app)  # Enable CORS on the Flask app
auth = HTTPBasicAuth()

# Fetch database credentials from environment variables
username = os.getenv('FLASK_APP_USERNAME')
password = os.getenv('FLASK_APP_PASSWORD')
hostname = os.getenv('FLASK_APP_HOSTNAME')
port = os.getenv('FLASK_APP_PORT')
database_name = os.getenv('FLASK_APP_DATABASE_NAME')

# Configure the SQLAlchemy part of the app instance
app.config['SQLALCHEMY_DATABASE_URI'] = f'postgresql://{username}:{password}@{hostname}:{port}/{database_name}'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Create SQLAlchemy db instance
db = SQLAlchemy(app)

# Define User model
class User(db.Model):
    __tablename__ = 'User'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    account_id = db.Column(db.Integer, db.ForeignKey('account.id'))
    role = db.Column(db.String(50), nullable=False)

# Define Account model
class Account(db.Model):
    __tablename__ = 'account'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=True, nullable=False)

# Define Schedule model
class Schedule(db.Model):
    __tablename__ = 'schedule'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    schedule_data = db.Column(db.JSON, nullable=False)

################################# PAGES #########################################################

# Route for serving the home page
@app.route('/')
@app.route('/index.html')
@app.route('/index')
def home():
    return send_from_directory('../frontend', 'index.html')

# Route for serving the main JavaScript file
@app.route('/main.js')
def main_js():
    return send_from_directory('../frontend', 'main.js')

# Route for serving the main CSS file
@app.route('/index.css')
def index_css():
    return send_from_directory('../frontend', 'index.css')

# Route for serving the homepage CSS file
@app.route('/homepage.css')
def homepage_css():
    return send_from_directory('../frontend', 'homepage.css')

# Route for serving the homepage after login
@app.route('/homepage.html')
@app.route('/homepage')
def homepage():
    return send_from_directory('../frontend', 'homepage.html')

# Route for serving the homepage JavaScript file
@app.route('/homepage.js')
def homepage_js():
    return send_from_directory('../frontend', 'homepage.js')

# Route for serving the admin page CSS file
@app.route('/adminpage.css')
def adminpage_css():
    return send_from_directory('../frontend', 'adminpage.css')

# Route for serving the admin page
@app.route('/adminpage.html')
@app.route('/adminpage')
def adminpage():
    return send_from_directory('../frontend', 'adminpage.html')

# Route for serving the admin JavaScript file
@app.route('/adminpage.js')
def adminpage_js():
    return send_from_directory('../frontend', 'adminpage.js')

################################# API CALLS #########################################################

# Login route
@app.route('/api/login', methods=['POST'])
def login():
    username = request.json.get('username')
    password = request.json.get('password')

    if not username or not password:
        return jsonify({'message': 'Missing username or password'}), 400

    user = User.query.filter_by(username=username).first()
    if user and user.password == password:
        return jsonify({
            'message': 'Login successful', 
            'redirect_url': 'homepage.html'
        }), 200
    else:
        return jsonify({'message': 'Invalid username or password'}), 401
    
################################# User Routes #################################

# Route for creating a new user
@app.route('/api/users', methods=['POST'])
@auth.login_required
def create_user():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    account_id = data.get('account_id')

    if not username or not password or not account_id:
        return jsonify({'message': 'Missing fields'}), 400

    hashed_password = generate_password_hash(password)
    new_user = User(username=username, password=hashed_password, account_id=account_id)
    db.session.add(new_user)
    db.session.commit()
    return jsonify({'message': 'User created successfully'}), 201

# Route for getting user ID based on username and account ID
@app.route('/api/users', methods=['GET'])
def get_user_id():
    username = request.args.get('username')
    account_id = request.args.get('account_id')

    if not username or not account_id:
        return jsonify({'message': 'Missing username or account_id'}), 400

    user = User.query.filter_by(username=username, account_id=account_id).first()
    if user:
        return jsonify({'user_id': user.id}), 200
    else:
        return jsonify({'message': 'User not found'}), 404

# Route for getting user details by user ID
@app.route('/api/users/<int:user_id>', methods=['GET'])
def get_user(user_id):
    user = User.query.get_or_404(user_id)
    return jsonify({
        'id': user.id,
        'username': user.username,
        'account_id': user.account_id,
        'role': user.role
    }), 200

# Route for getting the schedule of a user by user ID
@app.route('/api/users/<int:user_id>/schedule', methods=['GET'])
def get_user_schedule(user_id):
    schedule = Schedule.query.filter_by(user_id=user_id).first()
    if schedule:
        return jsonify({
            'user_id': user_id,
            'schedule_data': schedule.schedule_data
        }), 200
    else:
        return jsonify({'message': 'No schedule found for this user'}), 404

# Route for updating user details by user ID
@app.route('/api/users/<int:user_id>', methods=['PUT'])
def update_user(user_id):
    data = request.json
    user = User.query.get_or_404(user_id)
    username = data.get('username')
    password = data.get('password')
    account_id = data.get('account_id')

    if username:
        user.username = username
    if password:
        user.password = generate_password_hash(password)
    if account_id:
        user.account_id = account_id

    db.session.commit()
    return jsonify({'message': 'User updated successfully'}), 200

# Route for deleting a user by user ID
@app.route('/api/users/<int:user_id>', methods=['DELETE'])
@auth.login_required
def delete_user(user_id):
    user = User.query.get_or_404(user_id)
    db.session.delete(user)
    db.session.commit()
    return jsonify({'message': 'User deleted successfully'}), 200

################################## Account Routes ##################################

# Route for creating a new account
@app.route('/api/accounts', methods=['POST'])
@auth.login_required
def create_account():
    data = request.json
    name = data.get('name')

    if not name:
        return jsonify({'message': 'Missing name'}), 400

    new_account = Account(name=name)
    db.session.add(new_account)
    db.session.commit()
    return jsonify({'message': 'Account created successfully'}), 201

# Route for getting all accounts
@app.route('/api/accounts', methods=['GET'])
def get_accounts():
    accounts = Account.query.all()
    accounts_list = [{'id': account.id, 'name': account.name} for account in accounts]
    return jsonify(accounts_list), 200

# Route for getting account details by account ID
@app.route('/api/accounts/<int:account_id>', methods=['GET'])
def get_account(account_id):
    account = Account.query.get_or_404(account_id)
    return jsonify({
        'id': account.id,
        'name': account.name
    }), 200

# Route for getting all users associated with a specific account
@app.route('/api/accounts/<int:account_id>/users', methods=['GET'])
def get_users_by_account(account_id):
    account = Account.query.get_or_404(account_id)
    users = User.query.filter_by(account_id=account.id).all()
    user_list = [{
        'id': user.id,
        'username': user.username,
        'account_id': user.account_id
    } for user in users]
    return jsonify(user_list), 200

# Route for updating account details by account ID
@app.route('/api/accounts/<int:account_id>', methods=['PUT'])
def update_account(account_id):
    data = request.json
    account = Account.query.get_or_404(account_id)
    name = data.get('name')

    if name:
        account.name = name

    db.session.commit()
    return jsonify({'message': 'Account updated successfully'}), 200

# Route for deleting an account by account ID
@app.route('/api/accounts/<int:account_id>', methods=['DELETE'])
@auth.login_required
def delete_account(account_id):
    account = Account.query.get_or_404(account_id)
    db.session.delete(account)
    db.session.commit()
    return jsonify({'message': 'Account deleted successfully'}), 200

################################# Schedule Routes ##################################

# Route for creating a new schedule
@app.route('/api/schedules', methods=['POST'])
@auth.login_required
def create_schedule():
    data = request.json
    user_id = data.get('user_id')
    schedule_data = data.get('schedule_data')

    if not user_id or not schedule_data:
        return jsonify({'message': 'Missing fields'}), 400

    new_schedule = Schedule(user_id=user_id, schedule_data=schedule_data)
    db.session.add(new_schedule)
    db.session.commit()
    return jsonify({'message': 'Schedule created successfully'}), 201

# Route for getting schedule details by schedule ID
@app.route('/api/schedules/<int:schedule_id>', methods=['GET'])
def get_schedule(schedule_id):
    schedule = Schedule.query.get_or_404(schedule_id)
    return jsonify({
        'id': schedule.id,
        'user_id': schedule.user_id,
        'schedule_data': schedule.schedule_data
    }), 200

# Route for updating schedule details by schedule ID
@app.route('/api/schedules/<int:schedule_id>', methods=['PUT'])
def update_schedule(schedule_id):
    data = request.json
    schedule = Schedule.query.get_or_404(schedule_id)
    schedule_data = data.get('schedule_data')

    if schedule_data:
        schedule.schedule_data = schedule_data

    db.session.commit()
    return jsonify({'message': 'Schedule updated successfully'}), 200

# Route for deleting a schedule by schedule ID
@app.route('/api/schedules/<int:schedule_id>', methods=['DELETE'])
@auth.login_required
def delete_schedule(schedule_id):
    schedule = Schedule.query.get_or_404(schedule_id)
    db.session.delete(schedule)
    db.session.commit()
    return jsonify({'message': 'Schedule deleted successfully'}), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5070)
