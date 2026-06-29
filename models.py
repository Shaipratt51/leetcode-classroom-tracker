from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

DEPT_MAP = {
    "104": "CSE",
    "205": "IT",
    "118": "CCE",
    "148": "AI ML",
    "149": "CYBER"
}

YEAR_MAP = {
    "23": 4,
    "24": 3,
    "25": 2
}

def parse_registration_number(reg_no):
    reg_str = str(reg_no).strip()
    if len(reg_str) < 12:
        return "Unknown", 0
    join_year_code = reg_str[4:6]
    dept_code = reg_str[6:9]
    return DEPT_MAP.get(dept_code, "Unknown"), YEAR_MAP.get(join_year_code, 0)

class Student(db.Model):
    __tablename__ = 'students'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    register_number = db.Column(db.String(50), unique=True, nullable=False)
    leetcode_username = db.Column(db.String(100), unique=True, nullable=False)
    
    department = db.Column(db.String(50), nullable=True)
    academic_year = db.Column(db.Integer, nullable=True)
    
    total_solved = db.Column(db.Integer, default=0)
    easy_solved = db.Column(db.Integer, default=0)
    medium_solved = db.Column(db.Integer, default=0)
    hard_solved = db.Column(db.Integer, default=0)
    acceptance_rate = db.Column(db.Float, default=0.0)
    
    current_streak = db.Column(db.Integer, default=0)
    max_streak = db.Column(db.Integer, default=0)
    
    contest_rating = db.Column(db.Float, default=0.0)
    ranking = db.Column(db.Integer, default=0)
    avatar_url = db.Column(db.String(500), nullable=True)
    
    last_updated = db.Column(db.DateTime, nullable=True)
    is_active = db.Column(db.Boolean, default=True)
    
    # Relationships
    submissions = db.relationship('Submission', backref='student', cascade='all, delete-orphan', lazy=True)
    snapshots = db.relationship('DailySnapshot', backref='student', cascade='all, delete-orphan', lazy=True)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'register_number': self.register_number,
            'leetcode_username': self.leetcode_username,
            'department': self.department,
            'academic_year': self.academic_year,
            'total_solved': self.total_solved,
            'easy_solved': self.easy_solved,
            'medium_solved': self.medium_solved,
            'hard_solved': self.hard_solved,
            'acceptance_rate': self.acceptance_rate,
            'current_streak': self.current_streak,
            'max_streak': self.max_streak,
            'contest_rating': self.contest_rating,
            'ranking': self.ranking,
            'avatar_url': self.avatar_url,
            'last_updated': self.last_updated.isoformat() if self.last_updated else None,
            'is_active': self.is_active
        }

class Submission(db.Model):
    __tablename__ = 'submissions'
    
    id = db.Column(db.String(100), primary_key=True)  # Using LeetCode submission ID as primary key to prevent duplicates
    student_id = db.Column(db.Integer, db.ForeignKey('students.id', ondelete='CASCADE'), nullable=False)
    title = db.Column(db.String(255), nullable=False)
    title_slug = db.Column(db.String(255), nullable=False)
    difficulty = db.Column(db.String(20), nullable=False)
    timestamp = db.Column(db.DateTime, nullable=False)

class DailySnapshot(db.Model):
    __tablename__ = 'daily_snapshots'
    
    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('students.id', ondelete='CASCADE'), nullable=False)
    date = db.Column(db.Date, nullable=False)
    
    total_solved = db.Column(db.Integer, default=0)
    easy_solved = db.Column(db.Integer, default=0)
    medium_solved = db.Column(db.Integer, default=0)
    hard_solved = db.Column(db.Integer, default=0)
    
    daily_solves = db.Column(db.Integer, default=0)  # Number of solves on this day
    
    __table_args__ = (db.UniqueConstraint('student_id', 'date', name='_student_date_uc'),)

class Notification(db.Model):
    __tablename__ = 'notifications'
    
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.String(500), nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

class WeeklyReport(db.Model):
    __tablename__ = 'weekly_reports'
    
    id = db.Column(db.Integer, primary_key=True)
    week_start = db.Column(db.Date, nullable=False, unique=True)
    
    top_solver = db.Column(db.String(100))        # Name of student who solved the most
    most_active = db.Column(db.String(100))       # Name of student who solved most days
    problems_solved = db.Column(db.Integer, default=0) # Total problems solved by class
    average_solves = db.Column(db.Float, default=0.0)   # Average problems solved per student
    inactive_members = db.Column(db.Text)          # Comma-separated names of inactive students
    top_improvement = db.Column(db.String(100))   # Student who grew solved count by most
