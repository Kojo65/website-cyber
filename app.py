import os
import logging
import json
from datetime import datetime
from flask import Flask, render_template, request, redirect, url_for, flash, jsonify

# Configure logging
logging.basicConfig(level=logging.DEBUG)

# Create Flask app
app = Flask(__name__)
app.secret_key = os.environ.get("SESSION_SECRET", "cybersecurity_awareness_default_key")

# Routes
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/quiz')
def quiz():
    return render_template('quiz.html')

@app.route('/best-practices')
def best_practices():
    return render_template('best_practices.html')

@app.route('/resources')
def resources():
    return render_template('resources.html')

@app.route('/news')
def news():
    return render_template('news.html')

@app.route('/contact', methods=['GET', 'POST'])
def contact():
    if request.method == 'POST':
        name = request.form.get('name')
        email = request.form.get('email')
        message = request.form.get('message')
        
        # Validate form inputs
        if not name or not email or not message:
            flash('Please fill out all fields', 'danger')
            return render_template('contact.html')
        
        # In a real application, you would send an email or store the message
        # For now, we'll just log it and show a success message
        logging.info(f"Contact form submission: {name} <{email}> - {message}")
        flash('Thank you for your message! We will get back to you soon.', 'success')
        return redirect(url_for('contact'))
    
    return render_template('contact.html')

@app.route('/api/quiz-questions')
def quiz_questions():
    try:
        with open('static/data/quiz_questions.json', 'r') as file:
            questions = json.load(file)
        return jsonify(questions)
    except Exception as e:
        logging.error(f"Error loading quiz questions: {e}")
        return jsonify({"error": "Could not load quiz questions"}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
